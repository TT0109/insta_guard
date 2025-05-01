"use server";

import axios from "axios";

export async function getImageBase64(imageUrl: string, onBlurFollowersFotos = false): Promise<string> {
  if (!imageUrl) return '';

  try {
    const response = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "image/*",
      },
    });

    const contentType = response.headers["content-type"] || "image/jpeg";
    const imageBuffer = Buffer.from(response.data as ArrayBuffer); 
    const finalBuffer = imageBuffer as any;
    const base64 = finalBuffer.toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Erro ao converter imagem para base64:", error);
    return '';
  }
}
