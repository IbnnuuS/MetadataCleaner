import io
from PIL import Image
import pillow_heif
import exifread
import piexif
from typing import Dict, List, Any, Optional

# Register HEIF opener
pillow_heif.register_heif_opener()

AI_SIGNATURES = {
    "Midjourney": ["midjourney", "mj_"],
    "Stable Diffusion / ComfyUI / A1111": ["stable diffusion", "automatic1111", "comfyui", "sdxl", "sd15", "sd21", "sd3", "stealth_pnginfo", "parameters", "prompt", "negative_prompt", "sampler", "cfg_scale"],
    "Adobe Firefly": ["adobe firefly", "firefly", "adobe-photoshop-generative-fill"],
    "DALL-E / OpenAI": ["openai", "dall-e", "dalle", "chatgpt"],
    "Google AI (Gemini / Imagen)": ["google ai", "gemini", "imagen", "google-imagen"],
    "Flux (Black Forest Labs)": ["flux", "blackforestlabs", "flux.1"],
    "Ideogram": ["ideogram"],
    "Leonardo AI": ["leonardo ai", "leonardo.ai"],
    "Fooocus": ["fooocus"],
    "InvokeAI": ["invokeai"],
    "Playground AI": ["playground ai", "playgroundai"]
}

def scan_ai_metadata(metadata_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Search scanned metadata for AI signature.
    """
    highest_confidence = 0.0
    detected_generator = None
    detected_location = None
    detected_category = None
    
    # Flatten metadata list to inspect content
    for item in metadata_list:
        name = str(item.get("name", "")).lower()
        val = str(item.get("value", "")).lower()
        category = str(item.get("category", ""))
        
        for generator, signatures in AI_SIGNATURES.items():
            for sig in signatures:
                if sig in val or sig in name:
                    # Found match
                    confidence = 0.95 if sig in val else 0.70
                    if confidence > highest_confidence:
                        highest_confidence = confidence
                        detected_generator = generator
                        detected_location = f"{category} -> {item.get('name')}"
                        detected_category = category

    if detected_generator:
        return {
            "found": True,
            "generator": detected_generator,
            "confidence": f"{int(highest_confidence * 100)}%",
            "location": detected_location,
            "category": detected_category
        }
    
    return {
        "found": False,
        "message": "Tidak ditemukan metadata AI."
    }

def get_exif_category(tag_name: str) -> str:
    tag_lower = tag_name.lower()
    if "gps" in tag_lower:
        return "GPS"
    if "camera" in tag_lower or "model" in tag_lower or "make" in tag_lower or "lens" in tag_lower or "aperture" in tag_lower or "shutter" in tag_lower or "iso" in tag_lower:
        return "Camera"
    if "software" in tag_lower or "author" in tag_lower or "copyright" in tag_lower or "artist" in tag_lower or "owner" in tag_lower:
        return "Author / Software"
    if "date" in tag_lower or "time" in tag_lower:
        return "Date"
    return "EXIF"

def scan_metadata(image_data: bytes, filename: str) -> Dict[str, Any]:
    metadata_list = []
    
    try:
        image = Image.open(io.BytesIO(image_data))
        width, height = image.size
        img_format = image.format or filename.split(".")[-1].upper()
    except Exception as e:
        return {
            "success": False,
            "error": f"Gagal membuka gambar: {str(e)}"
        }

    # 1. ICC Profile check
    icc_profile = image.info.get("icc_profile")
    if icc_profile:
        metadata_list.append({
            "name": "ICC Profile",
            "category": "ICC Profile",
            "value": f"ICC Profile Data ({len(icc_profile)} bytes)",
            "size": len(icc_profile),
            "status": "Available"
        })

    # 2. Check info dictionary (PNG tEXt, WebP properties, comments, etc.)
    for key, val in image.info.items():
        if key == "icc_profile":
            continue
        val_str = str(val)
        # Skip raw EXIF/IPTC binary data as it will be parsed separately
        if isinstance(val, bytes) and len(val) > 200:
            val_str = f"Binary Data ({len(val)} bytes)"
        
        metadata_list.append({
            "name": key,
            "category": "Image Info / Text Chunk",
            "value": val_str,
            "size": len(str(val).encode('utf-8', errors='ignore')),
            "status": "Available"
        })

    # 3. EXIF parsing with exifread
    try:
        f = io.BytesIO(image_data)
        tags = exifread.process_file(f, details=False)
        for tag, val in tags.items():
            # Skip MakerNote binary if it is huge or unreadable
            val_str = str(val)
            if "MakerNote" in tag and len(val_str) > 256:
                val_str = f"MakerNote Binary ({len(val_str)} characters)"
                
            metadata_list.append({
                "name": tag,
                "category": get_exif_category(tag),
                "value": val_str,
                "size": len(val_str.encode('utf-8', errors='ignore')),
                "status": "Available"
            })
    except Exception:
        pass

    # 4. EXIF/GPS parsing with piexif if format supports it
    if img_format in ["JPEG", "TIFF", "TIF"]:
        try:
            exif_dict = piexif.load(image_data)
            for ifd in ("0th", "Exif", "GPS", "1st", "Interop"):
                if ifd in exif_dict and exif_dict[ifd]:
                    for tag, value in exif_dict[ifd].items():
                        tag_name = piexif.TAGS[ifd].get(tag, {}).get("name", f"UnknownTag_{ifd}_{tag}")
                        if isinstance(value, bytes):
                            try:
                                val_str = value.decode('utf-8', errors='replace')
                            except Exception:
                                val_str = f"Binary EXIF ({len(value)} bytes)"
                        else:
                            val_str = str(value)
                            
                        # Avoid duplicates from exifread if name matches
                        if not any(item['name'] == tag_name for item in metadata_list):
                            metadata_list.append({
                                "name": tag_name,
                                "category": get_exif_category(tag_name),
                                "value": val_str,
                                "size": len(val_str.encode('utf-8', errors='ignore')),
                                "status": "Available"
                            })
        except Exception:
            pass

    # 5. Scan AI metadata
    ai_status = scan_ai_metadata(metadata_list)

    total_metadata_size = sum(item["size"] for item in metadata_list)

    return {
        "success": True,
        "filename": filename,
        "format": img_format,
        "width": width,
        "height": height,
        "dimensions": f"{width} x {height}",
        "file_size": len(image_data),
        "total_metadata_size": total_metadata_size,
        "metadata_count": len(metadata_list),
        "metadata": metadata_list,
        "ai_metadata": ai_status
    }
