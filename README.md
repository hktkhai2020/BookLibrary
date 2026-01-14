# 📚 Hệ Thống Quản Lý Bán Hàng

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.27.3-0170FE?logo=ant-design&logoColor=white)

Ứng dụng web quản lý bán hàng hiện đại được xây dựng với React, TypeScript và Ant Design

[Features](#-tính-năng) • [Installation](#-cài-đặt) • [Usage](#-sử-dụng) • [Project Structure](#-cấu-trúc-dự-án)

</div>

---

## 📋 Tổng Quan

Hệ thống quản lý bán hàng là một ứng dụng web full-stack cho phép quản lý toàn bộ quy trình bán hàng từ quản lý sản phẩm, đơn hàng đến quản lý người dùng. Ứng dụng được xây dựng với công nghệ hiện đại, giao diện đẹp mắt và trải nghiệm người dùng tốt.

## ✨ Tính Năng

### 🔐 Xác Thực Người Dùng

- Đăng nhập / Đăng ký
- Bảo vệ routes với Private Route
- Quản lý session và authentication

### 👥 Quản Lý Người Dùng

- ✅ Tạo, xem, sửa, xóa người dùng
- 📊 Hiển thị danh sách người dùng dạng bảng
- 📥 Import/Export dữ liệu người dùng (CSV, Excel)
- 🔍 Tìm kiếm và lọc người dùng
- 📄 Phân trang dữ liệu

### 📖 Quản Lý Sách

- ✅ CRUD đầy đủ cho sách
- 🖼️ Upload và quản lý ảnh (Thumbnail & Slider)
- 📝 Quản lý thông tin sách: tên, tác giả, giá, số lượng, thể loại
- 🔍 Tìm kiếm và sắp xếp
- 📊 Hiển thị chi tiết sách

### 🛒 Quản Lý Đơn Hàng

- 📋 Xem danh sách đơn hàng
- 📊 Dashboard thống kê

### 🎨 Giao Diện

- 🎯 UI/UX hiện đại với Ant Design
- 📱 Responsive design
- 🌈 Dark mode support (nếu có)
- ⚡ Tối ưu hiệu suất

## 🛠️ Tech Stack

### Frontend

- **React 18.3.1** - UI Library
- **TypeScript 5.6.3** - Type Safety
- **Vite 5.4.8** - Build Tool & Dev Server
- **Ant Design 5.27.3** - UI Component Library
- **Ant Design Pro Components 2.8.1** - Advanced Components
- **React Router DOM 7.9.1** - Routing
- **Axios 1.12.2** - HTTP Client
- **Sass 1.92.1** - CSS Preprocessor

### Utilities

- **Day.js 1.11.13** - Date manipulation
- **ExcelJS 4.4.0** - Excel file handling
- **React CSV 2.2.2** - CSV export
- **NProgress 0.2.0** - Progress bar
- **UUID 13.0.0** - Unique ID generation

### Development Tools

- **ESLint 9.12.0** - Code linting
- **TypeScript ESLint 8.8.1** - TypeScript linting

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js >= 18.x
- npm hoặc yarn hoặc pnpm

### Các Bước Cài Đặt

1. **Clone repository**

```bash
git clone <repository-url>
cd 01-react-vite-starter-master
```

2. **Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. **Cấu hình môi trường**

```bash
# Tạo file .env nếu cần
# VITE_API_URL=http://localhost:8080
```

4. **Chạy ứng dụng**

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

5. **Mở trình duyệt**

```
http://localhost:5173
```

## 🚀 Sử Dụng

### Scripts Có Sẵn

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build production
npm run preview

# Chạy linter
npm run lint

# Start (alias của dev)
npm start
```

### Cấu Trúc Routes

```
/                    → Trang chủ (Protected)
/book                → Trang sách (Protected)
/about               → Giới thiệu (Protected)
/login               → Đăng nhập
/register            → Đăng ký
/admin/dashboard     → Dashboard admin (Protected)
/admin/book          → Quản lý sách (Protected)
/admin/user          → Quản lý người dùng (Protected)
/admin/order         → Quản lý đơn hàng (Protected)
```

### Tính Năng Chính

#### Quản Lý Sách

- Tạo sách mới với upload ảnh thumbnail và slider
- Cập nhật thông tin sách
- Xóa sách với xác nhận
- Xem chi tiết sách
- Tìm kiếm và lọc sách

#### Quản Lý Người Dùng

- CRUD người dùng
- Import/Export dữ liệu
- Tìm kiếm và phân trang

## 📁 Cấu Trúc Dự Án

```
src/
├── components/          # Components tái sử dụng
│   ├── admin/           # Components cho admin
│   │   ├── books/       # Components quản lý sách
│   │   └── user/        # Components quản lý người dùng
│   ├── context/         # React Context
│   └── layout/         # Layout components
├── pages/               # Pages/Views
│   ├── admin/          # Admin pages
│   └── client/         # Client pages
│       └── authentication/  # Login/Register
├── services/            # API services
│   ├── api.service.ts  # API calls
│   └── axios.customize.ts  # Axios config
├── styles/             # Global styles
├── types/               # TypeScript type definitions
└── main.tsx            # Entry point
```

## 🔧 Cấu Hình

### API Configuration

Cấu hình API endpoint trong `src/services/axios.customize.ts`:

```typescript
// Mặc định: http://localhost:8080
```

### Environment Variables

Tạo file `.env` để cấu hình:

```env
VITE_API_URL=http://localhost:8080
```

## 📝 Ghi Chú

- Backend API cần chạy trên port 8080 (mặc định)
- Đảm bảo backend đã được cấu hình CORS đúng cách
- Upload ảnh yêu cầu backend hỗ trợ endpoint `/api/v1/file/upload`

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát hành dưới license MIT.

## 👤 Tác Giả

**hktkhai2020**

- GitHub: [@hktkhai2020](https://github.com/hktkhai2020)

## 🙏 Lời Cảm Ơn

- [Ant Design](https://ant.design/) - UI Component Library
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://react.dev/) - The library for web and native user interfaces

---

<div align="center">

Made with ❤️ by hktkhai2020

⭐ Star this repo if you find it helpful!

</div>
