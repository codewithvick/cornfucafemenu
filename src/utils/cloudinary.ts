export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'du6bnkxcv';
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'cornfucafe_unsigned';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Uploads an image file directly to Cloudinary using an unsigned upload preset.
 * Works from both mobile and desktop browsers.
 */
export async function uploadImageToCloudinary(
  file: File,
  folder = 'cornfucafe_menu'
): Promise<string> {
  if (!file) throw new Error('No file provided');

  // Verify file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file (PNG, JPG, WEBP, etc.)');
  }

  // 15MB limit check
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Image size must be under 15MB');
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Cloudinary upload failed with status ${res.status}`
    );
  }

  const data: CloudinaryUploadResponse = await res.json();
  return data.secure_url;
}
