import os

class Settings:
    PROJECT_NAME: str = "AI Metadata Cleaner"
    ALLOWED_HOSTS: list = ["*"]
    MAX_CONTENT_LENGTH: int = 15 * 1024 * 1024  # 15 MB
    SUPPORTED_MIMES: dict = {
        "image/jpeg": ["jpg", "jpeg"],
        "image/png": ["png"],
        "image/webp": ["webp"],
        "image/tiff": ["tiff", "tif"],
        "image/bmp": ["bmp"],
        "image/x-ms-bmp": ["bmp"],
        "image/heic": ["heic"],
        "image/heif": ["heif"],
    }

settings = Settings()
