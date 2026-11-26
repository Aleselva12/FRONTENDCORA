/** Browser-only checksum helper for preview attachments. */
export async function hashFile(file: Blob, progress?: (percent: number) => void) {
 const bytes = await file.arrayBuffer();
 const digest = await crypto.subtle.digest("SHA-256", bytes);
 progress?.(100);
 return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
