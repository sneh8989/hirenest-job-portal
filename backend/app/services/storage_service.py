import os
import uuid
import re
from fastapi import UploadFile, HTTPException
from app.core.config import settings

def sanitize_filename(filename: str) -> str:
    # Remove path traversal and illegal chars
    clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
    return clean_name

async def save_upload_file(upload_file: UploadFile, subfolder: str = "resumes") -> str:
    """Safely saves an uploaded file and returns its relative accessible URL."""
    folder_path = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(folder_path, exist_ok=True)
    
    original_name = upload_file.filename or "file.dat"
    clean_original = sanitize_filename(original_name)
    ext = clean_original.split(".")[-1].lower() if "." in clean_original else ""
    
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File extension '.{ext}' not permitted. Allowed: {settings.ALLOWED_EXTENSIONS}")

    unique_filename = f"{uuid.uuid4().hex}_{clean_original}"
    dest_path = os.path.join(folder_path, unique_filename)

    content = await upload_file.read()
    # Check max file size
    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum size of {settings.MAX_FILE_SIZE_MB}MB")

    with open(dest_path, "wb") as f:
        f.write(content)

    return f"/uploads/{subfolder}/{unique_filename}"
