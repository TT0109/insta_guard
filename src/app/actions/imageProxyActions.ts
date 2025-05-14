import axios from "axios";

export async function getImageBase64(imageUrl: string, hasboo: boolean= false): Promise<string> {
  if (!imageUrl) return '';

  try {
    const response = await axios.post<ArrayBuffer>(
      'https://proxy-one-hazel.vercel.app/api',
      { url: imageUrl }, // body
      {
        responseType: "arraybuffer",
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const contentType = response.headers["content-type"] || "image/jpeg";
    const imageBuffer = Buffer.from(response.data);
    const base64 = imageBuffer.toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Erro ao converter imagem para base64:", error);
    return '';
  }
}
