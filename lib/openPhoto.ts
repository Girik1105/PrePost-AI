// Turns whatever photo someone picks into an ImageBitmap we can draw.
// Browsers open JPEG, PNG, WebP, AVIF and GIF themselves. Only Safari opens iPhone HEIC/HEIF photos,
// so everywhere else we decode those on the device with heic-to (libheif), loaded only when needed.

const PHOTO_EXT = /\.(jpe?g|png|webp|avif|gif|bmp|heic|heif)$/i;
const HEIC_EXT = /\.(heic|heif)$/i;

/** True for files we should try to open. Some systems give HEIC files an empty type, so check the name too. */
export function looksLikePhoto(file: File) {
  return file.type.startsWith("image/") || PHOTO_EXT.test(file.name);
}

export async function openPhoto(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file);
  } catch (err) {
    const { heicTo, isHeic } = await import("heic-to");
    const heic = /hei[cf]/i.test(file.type) || HEIC_EXT.test(file.name) || (await isHeic(file).catch(() => false));
    if (!heic) throw err;
    return heicTo({ blob: file, type: "bitmap" });
  }
}
