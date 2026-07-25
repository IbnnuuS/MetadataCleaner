import base64
import asyncio
import html
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
from api.utils.magic import validate_image, get_mime_and_extension
from api.services.scanner import scan_metadata
from api.services.cleaner import clean_metadata

router = APIRouter(prefix="/api")

# Server-side queue locks and counters
clean_lock = asyncio.Lock()
active_jobs = 0
active_jobs_lock = asyncio.Lock()

def sanitize_scan_result(result: dict) -> dict:
    """
    Sanitize metadata strings to mitigate XSS (HTML escaping).
    """
    if "metadata" in result:
        sanitized = []
        for item in result["metadata"]:
            sanitized.append({
                "name": html.escape(str(item.get("name", ""))),
                "category": html.escape(str(item.get("category", ""))),
                "value": html.escape(str(item.get("value", ""))),
                "size": item.get("size", 0),
                "status": html.escape(str(item.get("status", "")))
            })
        result["metadata"] = sanitized
        
    if "ai_metadata" in result and result["ai_metadata"].get("found"):
        result["ai_metadata"]["generator"] = html.escape(str(result["ai_metadata"].get("generator", "")))
        result["ai_metadata"]["location"] = html.escape(str(result["ai_metadata"].get("location", "")))
        result["ai_metadata"]["category"] = html.escape(str(result["ai_metadata"].get("category", "")))
        
    return result

@router.get("/queue-status")
async def get_queue_status():
    global active_jobs
    return {"active_jobs": active_jobs}

@router.post("/scan")
async def api_scan(file: UploadFile = File(...)):
    try:
        contents = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Gagal membaca file upload.")

    # Validate file
    is_valid, msg = validate_image(contents, file.filename)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)

    # Scan metadata
    scan_result = scan_metadata(contents, file.filename)
    if not scan_result.get("success"):
        raise HTTPException(status_code=400, detail=scan_result.get("error", "Gagal memindai metadata."))

    # Sanitize inputs to prevent XSS
    sanitized_result = sanitize_scan_result(scan_result)
    return JSONResponse(content=sanitized_result)

@router.post("/clean")
async def api_clean(
    file: UploadFile = File(...),
    quality: int = Query(95, ge=1, le=100)
):
    global active_jobs
    
    try:
        contents = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Gagal membaca file upload.")

    # Validate file
    is_valid, msg = validate_image(contents, file.filename)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)

    mime_type, ext = get_mime_and_extension(contents, file.filename)

    # Increment active jobs counter
    async with active_jobs_lock:
        active_jobs += 1

    try:
        # Acquire lock for sequential queue processing (Only one runs at a time)
        async with clean_lock:
            # 1. Scan metadata before
            scan_before = scan_metadata(contents, file.filename)
            if not scan_before.get("success"):
                raise HTTPException(status_code=400, detail=scan_before.get("error", "Gagal memindai metadata awal."))

            # 2. Clean metadata
            try:
                clean_bytes, clean_stats = clean_metadata(contents, file.filename, mime_type, quality)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))

            # 3. Scan metadata after (Verify)
            scan_after = scan_metadata(clean_bytes, file.filename)
            if not scan_after.get("success"):
                raise HTTPException(status_code=400, detail=scan_after.get("error", "Gagal memverifikasi metadata setelah pembersihan."))
    finally:
        # Decrement active jobs counter when processing finishes or fails
        async with active_jobs_lock:
            active_jobs = max(0, active_jobs - 1)

    # Encode clean image to base64
    clean_b64 = base64.b64encode(clean_bytes).decode("utf-8")
    
    # Custom filename: e.g. image_clean.png
    base_name = ".".join(file.filename.split(".")[:-1]) if "." in file.filename else file.filename
    clean_filename = f"{base_name}_clean.{ext}"

    # Verify if metadata is fully cleaned or reasons if any remains
    metadata_fully_removed = scan_after.get("metadata_count", 0) == 0
    verification_notes = ""
    if not metadata_fully_removed:
        remaining_names = [item["name"] for item in scan_after.get("metadata", [])]
        verification_notes = f"Beberapa properti format gambar mendasar tetap dipertahankan oleh encoder: {', '.join(remaining_names)}."

    # Sanitize metadata before returning (XSS mitigation)
    sanitized_before = sanitize_scan_result(scan_before)
    sanitized_after = sanitize_scan_result(scan_after)

    response_data = {
        "success": True,
        "filename": html.escape(clean_filename),
        "mime_type": html.escape(mime_type),
        "clean_image_b64": clean_b64,
        "before": {
            "file_size": sanitized_before["file_size"],
            "metadata_size": sanitized_before["total_metadata_size"],
            "metadata_count": sanitized_before["metadata_count"],
            "dimensions": html.escape(sanitized_before["dimensions"]),
            "format": html.escape(sanitized_before["format"]),
            "metadata": sanitized_before["metadata"],
            "ai_metadata": sanitized_before["ai_metadata"]
        },
        "after": {
            "file_size": sanitized_after["file_size"],
            "metadata_size": sanitized_after["total_metadata_size"],
            "metadata_count": sanitized_after["metadata_count"],
            "dimensions": html.escape(sanitized_after["dimensions"]),
            "format": html.escape(sanitized_after["format"]),
            "metadata": sanitized_after["metadata"],
            "ai_metadata": sanitized_after["ai_metadata"]
        },
        "verification": {
            "fully_removed": metadata_fully_removed,
            "notes": html.escape(verification_notes)
        }
    }

    return JSONResponse(content=response_data)
