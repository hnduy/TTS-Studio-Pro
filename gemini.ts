
import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName, VoiceTone } from "../types";

export const generateTTS = async (text: string, voice: VoiceName, tone: VoiceTone, speed: number = 1.0) => {
  // Khởi tạo instance mới mỗi lần gọi để đảm bảo lấy đúng API_KEY từ env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Điều chỉnh prompt dựa trên tốc độ và phong cách để AI hiểu ngữ cảnh tốt hơn
  const speedDesc = speed < 0.8 ? "rất chậm" : speed > 1.2 ? "rất nhanh" : "bình thường";
  const prompt = `Hãy đọc đoạn văn bản sau với tốc độ ${speedDesc} và phong cách ${tone}: ${text}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("Không nhận được dữ liệu âm thanh từ Gemini.");
    }

    return base64Audio;
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    // Nếu lỗi do API Key không tìm thấy (thường gặp khi deploy chưa set env)
    if (error.message?.includes("API_KEY")) {
      throw new Error("Vui lòng cấu hình API_KEY trong phần Environment Variables.");
    }
    throw error;
  }
};
