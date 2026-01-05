
import React, { useState } from 'react';
import { VoiceName, VoiceTone } from '../types';

interface CodeDisplayProps {
  text: string;
  voice: VoiceName;
  tone: VoiceTone;
  speed: number;
  type: 'streamlit';
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ text, voice, tone, speed }) => {
  const [copied, setCopied] = useState(false);

  const streamlitCode = `
import streamlit as st
import wave
import io
from google import genai
from google.genai import types

# --- CẤU HÌNH GIAO DIỆN ---
st.set_page_config(page_title="VietTTS Studio Pro", page_icon="🎙️", layout="wide")

# Custom CSS cho phong cách chuyên nghiệp
st.markdown("""
    <style>
    .main { background-color: #f8fafc; }
    .stTextArea textarea { border-radius: 20px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .stButton button { border-radius: 15px; height: 3.5em; font-weight: bold; background-color: #2563eb; color: white; border: none; }
    .stButton button:hover { background-color: #1d4ed8; }
    </style>
""", unsafe_url_ok=True)

# --- THANH BÊN (SIDEBAR) ---
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/3064/3064197.png", width=80)
    st.title("Studio Config")
    api_key = st.text_input("🔑 Gemini API Key", type="password", help="Lấy key tại: aistudio.google.com")
    
    st.divider()
    
    # Toàn bộ 30 giọng đọc chính thức
    ALL_VOICES = [
        "achernar", "achird", "algenib", "algieba", "alnilam", "aoede", "autonoe", 
        "callirrhoe", "charon", "despina", "enceladus", "erinome", "fenrir", "gacrux", 
        "iapetus", "kore", "laomedeia", "leda", "orus", "puck", "pulcherrima", 
        "rasalgethi", "sadachbia", "sadaltager", "schedar", "sulafat", "umbriel", 
        "vindemiatrix", "zephyr", "zubenelgenubi"
    ]
    
    selected_voice = st.selectbox(
        "Chọn giọng đọc",
        options=ALL_VOICES,
        format_func=lambda x: x.capitalize(),
        index=ALL_VOICES.index("${voice}")
    )
    
    selected_tone = st.selectbox(
        "Phong cách đọc",
        options=["Tự nhiên", "Truyền cảm", "Trang trọng", "Vui vẻ", "Kể chuyện", "Thì thầm"],
        index=["Tự nhiên", "Truyền cảm", "Trang trọng", "Vui vẻ", "Kể chuyện", "Thì thầm"].index("${tone}")
    )
    
    selected_speed = st.slider("Tốc độ", 0.5, 2.0, ${speed}, 0.1)

# --- GIAO DIỆN CHÍNH ---
st.title("🎙️ VietTTS Studio Pro")
st.write("Chuyển văn bản thành giọng nói bằng AI (Gemini 2.5 Flash)")

col1, col2 = st.columns([2, 1])

with col1:
    input_text = st.text_area("Văn bản đầu vào:", value="""${text}""", height=400)

with col2:
    st.info(f"Cấu hình: **{selected_voice.capitalize()}** | **{selected_tone}**")
    if st.button("▶️ TẠO GIỌNG NÓI", use_container_width=True):
        if not api_key:
            st.error("Vui lòng nhập API Key để tiếp tục.")
        elif not input_text.strip():
            st.warning("Vui lòng nhập văn bản.")
        else:
            try:
                with st.spinner("AI đang tạo âm thanh..."):
                    client = genai.Client(api_key=api_key)
                    
                    # Prompt Engineering để điều chỉnh tốc độ & phong cách
                    speed_desc = "rất chậm" if selected_speed < 0.8 else "rất nhanh" if selected_speed > 1.2 else "bình thường"
                    final_prompt = f"Hãy nói với tốc độ {speed_desc} và phong cách {selected_tone}: {input_text}"
                    
                    response = client.models.generate_content(
                        model='gemini-2.5-flash-preview-tts',
                        contents=final_prompt,
                        config=types.GenerateContentConfig(
                            response_modalities=['AUDIO'],
                            speech_config=types.SpeechConfig(
                                voice_config=types.VoiceConfig(
                                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=selected_voice)
                                )
                            )
                        )
                    )
                    
                    audio_data = response.candidates[0].content.parts[0].inline_data.data
                    
                    # Chuyển đổi sang định dạng WAV để Streamlit có thể phát
                    buffer = io.BytesIO()
                    with wave.open(buffer, 'wb') as wav:
                        wav.setnchannels(1)
                        wav.setsampwidth(2)
                        wav.setframerate(24000)
                        wav.writeframes(audio_data)
                    
                    st.success("Tạo thành công!")
                    st.audio(buffer.getvalue(), format="audio/wav")
                    st.download_button("📥 Tải tệp .WAV", buffer.getvalue(), f"studio_audio_{selected_voice}.wav")
            except Exception as e:
                st.error(f"Lỗi: {e}")

st.divider()
st.caption("Hệ thống VietTTS Studio Pro - Được cung cấp bởi Google Gemini AI")
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(streamlitCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="ml-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest">app.py</span>
        </div>
        <button onClick={handleCopy} className="text-slate-300 hover:text-white transition-colors text-xs font-bold flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-lg">
          <i className={`fa-solid ${copied ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
          {copied ? 'Đã sao chép!' : 'Sao chép mã'}
        </button>
      </div>
      <div className="p-6 overflow-x-auto max-h-[600px] custom-scrollbar bg-[#0d1117]">
        <pre className="text-blue-200 font-mono text-[12px] leading-relaxed"><code>{streamlitCode}</code></pre>
      </div>
    </div>
  );
};

export default CodeDisplay;
