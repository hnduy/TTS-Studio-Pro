
# 🎙️ DuyTTS Studio - Professional AI Voice

**DuyTTS Studio** là một ứng dụng web hiện đại cho phép chuyển đổi văn bản thành giọng nói (Text-to-Speech) chất lượng cao bằng cách tận dụng sức mạnh của mô hình **Gemini 2.5 Flash** từ Google.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5-orange.svg)

## ✨ Tính năng nổi bật

- 🎙️ **30 Giọng đọc đa dạng**: Hỗ trợ đầy đủ danh sách giọng đọc từ Google Gemini (Kore, Zephyr, Puck, v.v.)
- 🎭 **Tùy chỉnh phong cách**: Lựa chọn tông giọng (Tự nhiên, Truyền cảm, Kể chuyện, Thì thầm, v.v.)
- ⚡ **Điều chỉnh tốc độ**: Kiểm soát tốc độ nói từ 0.5x đến 2.0x.
- 📥 **Tải về chất lượng cao**: Xuất file định dạng `.wav` chuẩn 24kHz.
- 📊 **Dashboard Quản lý**: Theo dõi giới hạn Rate Limit và Billing trực quan.
- 📱 **Giao diện Responsive**: Hoạt động mượt mà trên cả máy tính và điện thoại.

## 🛠️ Công nghệ sử dụng

- **Frontend**: React (ES Modules), Tailwind CSS.
- **AI Engine**: @google/genai (Gemini 2.5 Flash TTS).
- **Icons**: Font Awesome 6.
- **Audio Processing**: Web Audio API (PCM to WAV conversion).

## 🚀 Hướng dẫn cài đặt & Chạy Local

1. **Clone dự án**:
   ```bash
   git clone https://github.com/your-username/duytts-studio.git
   cd duytts-studio
   ```

2. **Cấu hình API Key**:
   - Tạo một file `.env` (nếu chạy local với các công cụ build) hoặc thiết lập Environment Variable trên hosting.
   - Key cần thiết: `API_KEY`.

3. **Chạy ứng dụng**:
   Vì ứng dụng sử dụng ES Modules trực tiếp, bạn chỉ cần mở file `index.html` qua một Live Server (ví dụ: Extension Live Server trong VS Code).

## 🛡️ Bảo mật
Dự án này sử dụng biến môi trường `process.env.API_KEY` để bảo vệ mã API của bạn. **Lưu ý:** Không bao giờ commit trực tiếp API Key lên GitHub.

## 📄 Giấy phép
Dự án này được phát hành dưới giấy phép MIT.

---
Phát triển bởi [Tên của bạn] - 2024
