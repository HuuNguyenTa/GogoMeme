# Trạm Yêu Thương (SSG105)

## Giới thiệu
Trạm Yêu Thương là nền tảng lan tỏa tình yêu thương và nâng cao nhận thức cộng đồng về bảo vệ động vật bị bỏ rơi. Người dùng có thể gửi gắm lời chúc tốt đẹp tới những người bạn bốn chân và tra cứu mạng lưới các trạm cứu hộ trên toàn quốc.

## Tech Stack
- **Frontend**: React 19, Vite (JSX thuần, Vanilla CSS)
- **Backend / Database**: Supabase JS (Supabase Database, Realtime)
- **Kiến trúc**: One-page scroll application

## Yêu cầu môi trường
- **Node.js**: >= 22.12.0 (yêu cầu bởi Vite 8 và các thư viện hiện tại)
- **npm**: >= 10.0.0

## Cách chạy local
1. Di chuyển vào thư mục dự án:
   ```bash
   cd my-landing-page
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   # hoặc dùng 'npm ci' khi cần cài đặt đồng bộ chuẩn xác từ package-lock.json
   ```
3. Tạo file cấu hình môi trường:
   Sao chép `.env.example` thành `.env` (hoặc `.env.local`) và kiểm tra thông tin Supabase:
   ```bash
   cp .env.example .env
   ```
   (Cần có `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY` lấy từ Supabase Dashboard).
4. Kiểm tra mã nguồn (lint):
   ```bash
   npm run lint
   ```
5. Khởi chạy dev server:
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

## Chế độ hoạt động (Supabase & Mock Mode)
- **Chế độ kết nối Supabase (Production / Default khi có .env)**:
  Các lời chúc gửi lên sẽ được lưu trữ lâu dài vào bảng `wishes` của Supabase và tự động phát sóng realtime qua Postgres Changes đến toàn bộ người dùng đang mở trang.
- **Chế độ Mock data (Dev fallback khi thiếu .env)**:
  Nếu chưa cấu hình `VITE_SUPABASE_URL` hoặc `VITE_SUPABASE_PUBLISHABLE_KEY`, ứng dụng sẽ tự động chuyển sang chế độ Mock (`src/data/mockData.js`). Mọi tính năng giao diện và khu vườn vẫn hoạt động đầy đủ, lời chúc mới gửi sẽ xuất hiện tức thì trong phiên duyệt web hiện tại nhưng **không lưu trữ vĩnh viễn** (dữ liệu mock mới tạo sẽ reset về danh sách mẫu khi tải lại trang).

