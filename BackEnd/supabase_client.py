import os
import uuid
from werkzeug.utils import secure_filename

from supabase import create_client

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
SUPABASE_BUCKET_NAME = os.getenv('SUPABASE_BUCKET_NAME', 'product-images')
SUPABASE_PUBLIC = os.getenv('SUPABASE_PUBLIC', 'true').lower() == 'true'

supabase = None
storage = None

if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    storage = supabase.storage.from_(SUPABASE_BUCKET_NAME)


def ensure_storage():
    if storage is None:
        raise RuntimeError(
            'Supabase storage is not configured. '
            'Please set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_BUCKET_NAME.'
        )


def make_storage_path(filename: str) -> str:
    safe_name = secure_filename(filename) or 'upload'
    return f'products/{uuid.uuid4().hex}_{safe_name}'


def get_mime_type(filename: str) -> str:
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    mime_types = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif'
    }
    return mime_types.get(ext, 'application/octet-stream')


def upload_image(file_storage) -> str:
    ensure_storage()
    file_storage.stream.seek(0)
    file_bytes = file_storage.stream.read()
    if not file_bytes:
        raise ValueError('Upload failed: file is empty')

    storage_path = make_storage_path(file_storage.filename)
    mime_type = get_mime_type(file_storage.filename)
    file_options = {'content-type': mime_type}
    response = storage.upload(storage_path, file_bytes, file_options=file_options)
    # Handle both dict-like and object responses
    if hasattr(response, 'error') and response.error:
        raise RuntimeError(f"Supabase upload error: {response.error}")
    return storage_path


def delete_image(storage_path: str):
    if not storage_path or storage is None:
        return
    response = storage.remove([storage_path])
    # Handle both dict-like and object responses
    if hasattr(response, 'error') and response.error:
        raise RuntimeError(f"Supabase delete error: {response.error}")


def get_public_url(storage_path: str) -> str | None:
    if not storage_path:
        return None
    if not SUPABASE_URL or not SUPABASE_BUCKET_NAME:
        return None
    if SUPABASE_PUBLIC:
        return f"{SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{SUPABASE_BUCKET_NAME}/{storage_path}"

    ensure_storage()
    response = storage.create_signed_url(storage_path, 60 * 60 * 24)
    # Handle both dict-like and object responses
    if hasattr(response, 'error') and response.error:
        raise RuntimeError(f"Supabase signed URL error: {response.error}")
    if hasattr(response, 'data'):
        return response.data.get('signedURL') if isinstance(response.data, dict) else None
    return None
