// utils/fileHelper.js
export const FileHelper = {
  async toBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  },

  async prepareFiles(formData) {
    return {
      ...formData,
      profilePic: formData.profilePic
        ? await FileHelper.toBase64(formData.profilePic)
        : null,
      olTranscript: formData.olTranscript
        ? await FileHelper.toBase64(formData.olTranscript)
        : null,
      alTranscript: formData.alTranscript
        ? await FileHelper.toBase64(formData.alTranscript)
        : null,
    };
  },
};


// Converts ArrayBuffer / Uint8Array (from backend blob) to base64
export function arrayBufferToBase64(buffer) {
  if (!buffer) return null;
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function downloadArrayBufferAsFile(buffer, filename, mimeType = "application/octet-stream") {
  if (!buffer) return;

  const base64String = arrayBufferToBase64(buffer);
  const link = document.createElement("a");
  link.href = `data:${mimeType};base64,${base64String}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}