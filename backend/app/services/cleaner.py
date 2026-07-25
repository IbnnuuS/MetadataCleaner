import io
from PIL import Image, ImageOps
import pillow_heif
import piexif
from typing import Tuple, Dict, Any

# Ensure HEIF support
pillow_heif.register_heif_opener()

def clean_metadata(image_data: bytes, filename: str, mime_type: str, quality: int = 95) -> Tuple[bytes, Dict[str, Any]]:
    """
    Remove all metadata (EXIF, GPS, IPTC, XMP, Comments, ICC Profile, etc.)
    while preserving resolution, visual quality, and transparency. Supports custom quality compression.
    """
    try:
        in_stream = io.BytesIO(image_data)
        image = Image.open(in_stream)
        img_format = image.format or filename.split(".")[-1].upper()
    except Exception as e:
        raise ValueError(f"Gagal memuat gambar untuk dibersihkan: {str(e)}")

    out_stream = io.BytesIO()
    
    # 1. Base format parameters
    save_args = {}
    
    # Preserve format
    save_format = img_format
    if save_format == "MPO":
        save_format = "JPEG"
    elif save_format in ["HEIF", "HEIC"]:
        save_format = "HEIF"

    # Preserve PNG transparency / mode
    if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
        save_args["transparency"] = image.info.get("transparency")

    # Set quality options based on user compression input
    if save_format in ["JPEG", "JPG"]:
        save_args["quality"] = quality
        save_args["optimize"] = True
    elif save_format == "WEBP":
        save_args["quality"] = quality
        save_args["lossless"] = (quality == 100) # Lossless only if 100% quality selected
    elif save_format in ["PNG"]:
        # PNG compression is 0 (fastest/largest) to 9 (slowest/smallest)
        # Map quality (1-100) to PNG compress_level (9 to 0)
        # 100 quality -> compress_level 1 (low compression, fast)
        # 1 quality -> compress_level 9 (high compression, slow)
        png_compress = max(0, min(9, int((100 - quality) / 10)))
        save_args["compress_level"] = png_compress
        save_args["optimize"] = True
        
    # 2. Re-create the image by copying pixel data only
    # This strips all info dict, ICC profiles, EXIF, etc.
    try:
        # Auto-orient image based on EXIF before stripping it (so the image is not rotated sideways after cleaning)
        try:
            image = ImageOps.exif_transpose(image)
        except Exception:
            pass

        # Create clean image copy
        clean_image = Image.new(image.mode, image.size)
        clean_image.putdata(list(image.getdata()))
        
        # Save back to memory without 'info', 'exif', 'icc_profile'
        clean_image.save(out_stream, format=save_format, **save_args)
        cleaned_data = out_stream.getvalue()
        
    except Exception as e:
        # Fallback to direct save if copy-pixels method fails
        out_stream = io.BytesIO()
        try:
            image.save(out_stream, format=save_format, **save_args)
            cleaned_data = out_stream.getvalue()
            if save_format in ["JPEG", "JPG"]:
                try:
                    cleaned_data = piexif.remove(cleaned_data)
                except Exception:
                    pass
        except Exception as e2:
            raise ValueError(f"Proses pembersihan metadata gagal: {str(e2)}")

    # Prepare status report
    stats = {
        "success": True,
        "format": save_format,
        "width": image.width,
        "height": image.height,
        "original_size": len(image_data),
        "clean_size": len(cleaned_data)
    }

    return cleaned_data, stats
