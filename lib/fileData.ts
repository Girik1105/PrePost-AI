// Reads the hidden data a photo file carries (EXIF), so we can show it before the canvas redraw drops it.
// Runs in the browser on the original file. Nothing here is sent anywhere.

export interface FileData {
  lat?: number;
  lon?: number;
  taken?: Date;
  camera?: string;
  software?: string;
}

export async function readFileData(file: File): Promise<FileData | null> {
  try {
    const { default: exifr } = await import("exifr");
    const tags = await exifr.parse(file, {
      gps: true,
      tiff: true,
      exif: true,
      pick: ["latitude", "longitude", "GPSLatitude", "GPSLongitude", "GPSLatitudeRef", "GPSLongitudeRef", "DateTimeOriginal", "CreateDate", "Make", "Model", "Software"],
    });
    if (!tags) return {};
    const data: FileData = {};
    if (Number.isFinite(tags.latitude) && Number.isFinite(tags.longitude) && !(tags.latitude === 0 && tags.longitude === 0)) {
      data.lat = tags.latitude;
      data.lon = tags.longitude;
    }
    const taken = tags.DateTimeOriginal ?? tags.CreateDate;
    if (taken instanceof Date && !Number.isNaN(taken.getTime())) data.taken = taken;
    const make = typeof tags.Make === "string" ? tags.Make.trim() : "";
    const model = typeof tags.Model === "string" ? tags.Model.trim() : "";
    // Models often repeat the make ("Canon" + "Canon EOS R6").
    const camera = model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`.trim();
    if (camera) data.camera = camera;
    if (typeof tags.Software === "string" && tags.Software.trim()) data.software = tags.Software.trim();
    return data;
  } catch {
    return null;
  }
}

export function formatCoords(lat: number, lon: number) {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
}

export function mapUrl(lat: number, lon: number) {
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lon.toFixed(5)}#map=17/${lat.toFixed(5)}/${lon.toFixed(5)}`;
}
