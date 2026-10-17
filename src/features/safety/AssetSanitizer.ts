export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const MAX_JSON_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;

const activeObjectURLs = new Set<string>();

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  // Explicit SVG rejection to block stored XSS
  const fileName = file.name.toLowerCase();
  if (
    file.type === 'image/svg+xml' ||
    fileName.endsWith('.svg') ||
    fileName.endsWith('.svgz')
  ) {
    return {
      isValid: false,
      error: 'Security restriction: SVG image uploads are disallowed to prevent script injection.',
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `Unsupported image format (${file.type || 'unknown'}). Allowed: PNG, JPEG, WebP.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `File size exceeds 2MB limit (current: ${sizeMb}MB).`,
    };
  }

  return { isValid: true };
}

export function validateJsonFile(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  if (file.size > MAX_JSON_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'Project JSON exceeds maximum allowed size of 1MB.',
    };
  }

  return { isValid: true };
}

export function createManagedObjectURL(blob: Blob | File): string {
  const url = URL.createObjectURL(blob);
  activeObjectURLs.add(url);
  return url;
}

export function revokeManagedObjectURL(url: string): void {
  if (activeObjectURLs.has(url)) {
    URL.revokeObjectURL(url);
    activeObjectURLs.delete(url);
  }
}

export function revokeAllManagedObjectURLs(): void {
  for (const url of activeObjectURLs) {
    URL.revokeObjectURL(url);
  }
  activeObjectURLs.clear();
}
