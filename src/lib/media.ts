"use client";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Client-side image resize → WebP, then upload. Uses Cloudinary (free tier,
 * unsigned preset) when configured — which works on the Firebase free plan
 * without a Storage bucket. Falls back to Firebase Storage otherwise (§3.1, §8).
 * Returns the hosted image URL.
 */
export async function resizeAndUpload(
  file: File,
  folder: string,
  maxW = 1280,
): Promise<string> {
  const resized = await resizeImage(file, maxW);

  // Preferred: Cloudinary unsigned upload (free, no Firebase Storage needed).
  if (CLOUDINARY_CLOUD && CLOUDINARY_PRESET) {
    const form = new FormData();
    form.append("file", resized);
    form.append("upload_preset", CLOUDINARY_PRESET);
    form.append("folder", `prelli/${folder}`);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: form },
    );
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = (await res.json()) as { secure_url: string };
    return data.secure_url;
  }

  // Fallback: Firebase Storage (requires an enabled bucket).
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
