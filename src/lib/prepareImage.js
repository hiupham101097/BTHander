// Keep animations and vector uploads intact. Resize photographic uploads before
// sending them to R2, but preserve the original when conversion increases size.
export async function prepareImage(file) {
  if (!file.type.startsWith("image/")) throw new Error("Vui lòng chọn tệp ảnh.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Ảnh phải nhỏ hơn hoặc bằng 10 MB.");
  if (!/^image\/(jpeg|png)$/.test(file.type) || typeof createImageBitmap !== "function") return file;
  // APNG must keep its animation.
  if (file.type === "image/png") {
    const header = new Uint8Array(await file.slice(0, 65536).arrayBuffer());
    if (new TextDecoder("latin1").decode(header).includes("acTL")) return file;
  }
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/webp", 0.85));
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    return file;
  } finally {
    bitmap?.close();
  }
}
