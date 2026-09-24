# Trạm Yêu Thương (SSG105)

## Giới thiệu
Trạm Yêu Thương là nền tảng lan tỏa tình yêu thương và nâng cao nhận thức cộng đồng về bảo vệ động vật bị bỏ rơi. Người dùng có thể gửi gắm lời chúc tốt đẹp tới những người bạn bốn chân và tra cứu mạng lưới các trạm cứu hộ trên toàn quốc.

## Tech Stack
- **Frontend**: React 19, Vite (JSX thuần, Vanilla CSS)
- **Backend / Database**: Supabase JS (Supabase Database, Realtime)
- **Kiến trúc**: One-page scroll application

## Yêu cầu môi trường
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

## Cách chạy local
1. Di chuyển vào thư mục dự án:
   ```bash
   cd my-landing-page
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường:
   Sao chép `.env.example` thành `.env.local` và điền thông tin Supabase:
   ```bash
   cp .env.example .env.local
   ```
   (Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY` lấy từ Supabase Dashboard).
4. Khởi chạy dev server:
   ```bash
   npm run dev
   ```
   Truy cập website tại `http://localhost:5173`.

## Cách build
Biên dịch ứng dụng cho môi trường production:
```bash
npm run build
```
Kết quả build được tạo tại thư mục `dist/`.

## Cấu trúc thư mục chính
- `src/`: Toàn bộ mã nguồn ứng dụng (giao diện `components/`, dữ liệu tĩnh `data/`, kết nối dịch vụ `services/`, giao diện chung `styles/`).
- `public/`: Chứa các tài nguyên tĩnh phục vụ trực tiếp cho website (icons, fonts, static assets).
- `supabase/`: Chứa các file migrations và kịch bản cơ sở dữ liệu Supabase.

## Ghi chú
Dự án được thiết kế cơ chế tự động chuyển sang sử dụng mock data (`src/data/mockData.js`) khi chưa cấu hình kết nối Supabase, đảm bảo toàn bộ luồng trải nghiệm trên giao diện vẫn hoạt động bình thường.
