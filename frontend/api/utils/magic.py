import magic
from typing import Tuple, Optional
from api.core.config import settings

# Initialize magic
try:
    mime_detector = magic.Magic(mime=True)
except Exception:
    mime_detector = None

def get_mime_and_extension(data: bytes, filename: str) -> Tuple[Optional[str], Optional[str]]:
    # 1. Detect mime type using magic bytes
    detected_mime = None
    if mime_detector:
        try:
            detected_mime = mime_detector.from_buffer(data)
        except Exception:
            pass

    # Fallback to extension check if magic fails
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    
    # Map common extensions if mime is missing or generic
    if not detected_mime or detected_mime in ["application/octet-stream", "text/plain"]:
        mime_map = {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "webp": "image/webp",
            "tiff": "image/tiff",
            "tif": "image/tiff",
            "bmp": "image/bmp",
            "heic": "image/heic",
            "heif": "image/heif"
        }
        detected_mime = mime_map.get(ext, detected_mime)

    # Clean up mime type names
    if detected_mime:
        detected_mime = detected_mime.lower()

    return detected_mime, ext

def validate_image(data: bytes, filename: str) -> Tuple[bool, str]:
    if len(data) > settings.MAX_CONTENT_LENGTH:
        return False, "Ukuran file melebihi batas maksimum 4MB (Batas Serverless Vercel)."
    
    if len(data) == 0:
        return False, "File gambar kosong."

    mime, ext = get_mime_and_extension(data, filename)
    if not mime or mime not in settings.SUPPORTED_MIMES:
        return False, f"Format file tidak didukung: {ext.upper() if ext else 'Tidak dikenal'} ({mime or 'unknown'})."

    return True, "Valid"
