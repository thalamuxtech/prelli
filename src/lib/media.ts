"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Client-side image resize → WebP, then upload to Firebase Storage (§3.1, §8).
 * Keeps uploads small to conserve the free-plan quota. Returns the download URL.
 */
export async function resizeAndUpload(
  file: File,
  folder: string,
  maxW = 1280,
): Promise<string> {
  const resized = await resizeImage(file, maxW);
  const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-");
  const path = `${folder}/${Date.now()}-${safeName}.webp`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, resized, { contentType: "image/webp" });
  return getDownloadURL(storageRef);
}

function resizeImage(file: File, maxW: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas context"));
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/webp",
        0.82,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    img.src = url;
  });
}
