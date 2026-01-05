
import React, { useState } from 'react';
import { VoiceName, VoiceTone } from './types';
import { generateTTS } from './services/gemini';
import { decodeBase64, pcmToWavBlob } from './utils/audio';

// Danh sách đầy đủ 30 giọng để hiển thị trong Dropdown
const ALL_VOICE_IDS = Object.values(VoiceName);
const TONES = Object.values(VoiceTone);

const App: React.FC = () => {
  const [text, setText] = useState('Chào mừng bạn đến với DuyTTS Studio. Tôi đã cập nhật tên dự án mới và sẵn sàng giúp bạn tạo ra những giọng nói AI chất lượng nhất.');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(VoiceName.Sadaltager);
  const [selectedTone, setSelectedTone] = useState<VoiceTone>(VoiceTone.Natural);
  const [speed, setSpeed] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const base64Pcm = await generateTTS(text, selectedVoice, selectedTone, speed);
      const pcmBytes = decodeBase64(base64Pcm);
      const wavBlob = await pcmToWavBlob(pcmBytes);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(URL.createObjectURL(wavBlob));
    } catch (err) {
      alert('Có lỗi xảy ra khi tạo giọng nói. Vui lòng kiểm tra lại văn bản hoặc API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12">
      {/* Hero Section */}
      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4 text-white">
          <i className="fa-solid fa-waveform-lines text-2xl"></i>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">DuyTTS Studio</h1>
        <p className="text-slate-500 font-medium">Trải nghiệm giọng nói Gemini AI chuyên nghiệp</p>
      </header>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Cấu hình */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-4">
              <i className="fa-solid fa-sliders text-indigo-600"></i> Cấu hình giọng đọc
            </h3>

            <div className="space-y-5">
              {/* Dropdown Giọng đọc */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  <i className="fa-solid fa-user-voice mr-1 text-indigo-400"></i> Chọn Giọng Đọc (30 Giọng)
                </label>
                <div className="relative">
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer pr-10"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value as VoiceName)}
                  >
                    {ALL_VOICE_IDS.map(v => (
                      <option key={v} value={v}>
                        {v.charAt(0).toUpperCase() + v.slice(1)} {v === 'sadaltager' ? '⭐' : ''}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                </div>
              </div>

              {/* Dropdown Phong cách */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  <i className="fa-solid fa-palette mr-1 text-indigo-400"></i> Phong Cách Đọc
                </label>
                <div className="relative">
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer pr-10"
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value as VoiceTone)}
                  >
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                </div>
              </div>

              {/* Slider Tốc độ */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <i className="fa-solid fa-clock mr-1 text-indigo-400"></i> Tốc Độ
                  </label>
                  <span className="text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-lg">{speed}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1" value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Text Input */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  <i className="fa-solid fa-quote-left mr-1 text-indigo-400"></i> Nội dung văn bản
                </label>
                <textarea
                  className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all resize-none shadow-inner"
                  placeholder="Nhập nội dung cần chuyển sang giọng nói..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch fa-spin text-xl"></i>
                ) : (
                  <i className="fa-solid fa-bolt-lightning text-xl"></i>
                )}
                Tạo giọng nói ngay
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Display Result */}
        <div className="lg:col-span-7">
          <div className="min-h-[500px] flex flex-col">
            <div className="bg-slate-100/50 p-1.5 rounded-2xl self-start mb-6">
              <span className="px-4 py-2 text-sm font-bold text-slate-600 flex items-center gap-2">
                <i className="fa-solid fa-play-circle text-indigo-500"></i>
                Kết quả hiển thị
              </span>
            </div>

            <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!audioUrl && !isLoading && (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center text-slate-400 p-12">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <i className="fa-solid fa-microphone-slash text-3xl opacity-20"></i>
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-2">Chưa có bản ghi nào</h3>
                  <p className="max-w-xs text-center text-sm leading-relaxed">
                    Sau khi nhấn nút tạo, âm thanh sẽ được xử lý bởi AI và xuất hiện tại đây.
                  </p>
                </div>
              )}
              
              {isLoading && (
                <div className="bg-white rounded-[2.5rem] flex-1 flex flex-col items-center justify-center p-12 shadow-sm border border-slate-50">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-waveform text-indigo-600 text-xl animate-pulse"></i>
                    </div>
                  </div>
                  <p className="mt-8 text-slate-500 font-bold animate-pulse tracking-wide">AI ĐANG XỬ LÝ ÂM THANH...</p>
                </div>
              )}

              {audioUrl && !isLoading && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <i className="fa-solid fa-volume-high"></i>
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase opacity-60 tracking-tighter">Ready to play</span>
                            <span className="block font-bold capitalize text-lg leading-none">{selectedVoice}</span>
                          </div>
                        </div>
                        <a 
                          href={audioUrl} 
                          download={`duytts_${selectedVoice}.wav`}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
                        >
                          <i className="fa-solid fa-download"></i> Tải về
                        </a>
                      </div>

                      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-inner">
                        <audio src={audioUrl} controls className="w-full custom-audio-player" autoPlay />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <i className="fa-solid fa-microphone"></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giọng đọc</p>
                        <p className="font-bold text-slate-800 capitalize">{selectedVoice}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                        <i className="fa-solid fa-wand-magic"></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phong cách</p>
                        <p className="font-bold text-slate-800">{selectedTone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Rate Limit & Billing Dashboard */}
      <section className="pt-8 border-t border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-chart-pie text-indigo-600"></i> Dashboard Quản Lý
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rate Limit Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <h4 className="font-bold text-slate-800">Giới hạn (Rate Limit)</h4>
              </div>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase">Gemini 2.5 Flash</span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Miễn phí (Free Tier):</span>
                <span className="font-bold text-slate-700">15 RPM / 1M TPM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Trả phí (Paid Tier):</span>
                <span className="font-bold text-slate-700">2000 RPM / 4M TPM</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                <div className="bg-amber-400 h-full rounded-full w-1/4"></div>
              </div>
            </div>
            
            <a 
              href="https://aistudio.google.com/app/plan_management" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center py-2 text-xs font-bold text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
            >
              Xem lưu lượng thực tế <i className="fa-solid fa-arrow-up-right-from-square ml-1"></i>
            </a>
          </div>

          {/* Billing Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <h4 className="font-bold text-slate-800">Thanh toán (Billing)</h4>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Active Plan</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Mô hình:</span>
                <span className="font-bold text-slate-700">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Đơn giá (Audio):</span>
                <span className="font-bold text-slate-700">~$0.01 / 1k s</span>
              </div>
              <p className="text-[10px] text-slate-400 italic mt-1 leading-tight">
                *Giá ước tính cho đầu ra âm thanh. Miễn phí nếu sử dụng dưới ngưỡng giới hạn.
              </p>
            </div>
            
            <a 
              href="https://ai.google.dev/pricing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              Quản lý chi phí & Gói cước <i className="fa-solid fa-arrow-up-right-from-square ml-1"></i>
            </a>
          </div>
        </div>
      </section>

      <footer className="text-center pb-8 text-slate-400 text-xs">
        <p>© 2024 DuyTTS Studio - Powered by Google Gemini AI</p>
      </footer>

      <style>{`
        .custom-audio-player::-webkit-media-controls-panel {
          background-color: transparent;
        }
        .custom-audio-player::-webkit-media-controls-play-button {
          background-color: white;
          border-radius: 50%;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
      `}</style>
    </div>
  );
};

export default App;
