# 📚 BookStore - Hệ Thống Quản Lý Bán Sách Online

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.27.3-0170FE?logo=ant-design&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?logo=tailwind-css&logoColor=white)

Ứng dụng web quản lý bán sách hiện đại với AI Assistant, được xây dựng bằng React, TypeScript, Ant Design và Tailwind CSS

[Features](#-tính-năng) • [Installation](#-cài-đặt) • [Usage](#-sử-dụng) • [Project Structure](#-cấu-trúc-dự-án) • [Tech Stack](#-tech-stack)

</div>

---

## 📋 Tổng Quan

**BookStore** là một hệ thống quản lý bán sách online full-stack với các tính năng hiện đại:

- 🛒 **E-commerce Platform**: Mua sắm sách trực tuyến với giỏ hàng và thanh toán
- 🤖 **AI Assistant**: Trợ lý AI tích hợp để tư vấn và hỗ trợ khách hàng
- 👨‍💼 **Admin Dashboard**: Quản lý sách, người dùng, đơn hàng
- 📱 **Responsive Design**: Tối ưu cho mọi thiết bị (Mobile, Tablet, Desktop)
- 🎨 **Modern UI/UX**: Giao diện đẹp mắt với Ant Design và Tailwind CSS

## ✨ Tính Năng

### 🔐 Xác Thực & Bảo Mật

- ✅ Đăng nhập / Đăng ký với validation
- 🔒 Bảo vệ routes với Private Router
- 🎫 Quản lý session và JWT token
- 👤 Phân quyền Admin/User

### 🛍️ Trang Khách Hàng (Client)

#### Trang Chủ

- 📚 Hiển thị danh sách sách với pagination
- 🔍 Tìm kiếm và lọc sách theo:
  - Danh mục (Category)
  - Khoảng giá (Price Range)
  - Sắp xếp (Phổ biến, Hàng mới, Giá cao/thấp)
- ⭐ Đánh giá sách với Rate component
- 📱 Responsive grid layout (1-4 cột tùy màn hình)

#### Chi Tiết Sách

- 🖼️ Image Gallery với thumbnail và slider
- 📖 Thông tin chi tiết: tác giả, giá, số lượng, đánh giá
- 🛒 Thêm vào giỏ hàng / Mua ngay
- 💬 Modal gallery để xem ảnh fullscreen
- 📱 Responsive layout (stack trên mobile, side-by-side trên desktop)

#### AI Assistant

- 🤖 Chat với AI để tư vấn về sách
- 💬 Tìm kiếm từ header để mở modal chat
- 📝 Conversation history
- 🎯 Tư vấn về sách, tác giả, giá cả

### 👨‍💼 Trang Quản Trị (Admin)

#### Dashboard

- 📊 Thống kê tổng quan
- 📈 Biểu đồ và metrics

#### Quản Lý Sách

- ✅ CRUD đầy đủ (Create, Read, Update, Delete)
- 🖼️ Upload ảnh thumbnail và slider
- 📝 Quản lý: tên, tác giả, giá, số lượng, thể loại
- 🔍 Tìm kiếm và sắp xếp
- 📊 ProTable với pagination và filtering
- 📥 Export dữ liệu (CSV)

#### Quản Lý Người Dùng

- ✅ CRUD người dùng
- 📥 Import/Export dữ liệu (CSV, Excel)
- 🔍 Tìm kiếm và lọc
- 📄 Phân trang
- 📊 ProTable với advanced features

#### Quản Lý Đơn Hàng

- 📋 Xem danh sách đơn hàng
- 📊 Thống kê đơn hàng

### 🎨 Giao Diện & UX

- 🎯 **Ant Design**: Component library chuyên nghiệp
- 🎨 **Tailwind CSS**: Utility-first CSS framework
- 📱 **Responsive**: Mobile-first design
- 🌈 **Theme Integration**: Ant Design theme tokens với Tailwind
- ⚡ **Performance**: Code splitting, lazy loading
- 🎭 **Animations**: Smooth transitions và hover effects

## 🛠️ Tech Stack

### Frontend Core

- **React 18.3.1** - UI Library với Hooks
- **TypeScript 5.6.3** - Type Safety
- **Vite 5.4.8** - Build Tool & Dev Server (siêu nhanh ⚡)

### UI Libraries

- **Ant Design 5.27.3** - Enterprise UI Component Library
- **Ant Design Pro Components 2.8.1** - Advanced Components (ProTable, ProForm)
- **Tailwind CSS 4.1.18** - Utility-first CSS Framework
- **@ant-design/icons 6.0.2** - Icon Library

### Routing & State

- **React Router DOM 7.9.1** - Client-side Routing
- **React Context API** - State Management

### HTTP & API

- **Axios 1.12.2** - HTTP Client
- **Axios Interceptors** - Request/Response handling

### Utilities

- **Day.js 1.11.13** - Date manipulation
- **ExcelJS 4.4.0** - Excel file handling
- **React CSV 2.2.2** - CSV export
- **React Image Gallery 1.3.0** - Image gallery component
- **NProgress 0.2.0** - Progress bar
- **UUID 13.0.0** - Unique ID generation

### Styling

- **Sass 1.92.1** - CSS Preprocessor
- **PostCSS 8.5.6** - CSS Processing
- **Autoprefixer 10.4.23** - CSS Vendor Prefixes

### Development Tools

- **ESLint 9.12.0** - Code Linting
- **TypeScript ESLint 8.8.1** - TypeScript Linting
- **Vite TSConfig Paths** - Path Aliases (@/)

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

- **Node.js** >= 18.x
- **npm** >= 9.x hoặc **yarn** >= 1.22.x hoặc **pnpm** >= 8.x
- **Git** (để clone repository)

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

Tạo file `.env` trong thư mục root (hoặc sử dụng `.env.development` và `.env.production`):

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:8080

# AI API (nếu có)
VITE_AI_API_URL=http://localhost:8080/api/v1/ai
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
# hoặc
npm start

# Build cho production
npm run build

# Preview build production
npm run preview

# Chạy linter
npm run lint
```

### Cấu Trúc Routes

#### Public Routes

```
/login              → Đăng nhập
/register           → Đăng ký
```

#### Protected Routes (Client)

```
/                   → Trang chủ - Danh sách sách
/book/:id           → Chi tiết sách
/about               → Giới thiệu
```

#### Protected Routes (Admin)

```
/admin/dashboard    → Dashboard admin
/admin/book         → Quản lý sách
/admin/user         → Quản lý người dùng
/admin/order        → Quản lý đơn hàng
```

### Tính Năng Chính

#### 🛒 Mua Sắm Sách

1. **Tìm kiếm sách**: Sử dụng filter sidebar hoặc search bar
2. **Xem chi tiết**: Click vào sách để xem thông tin đầy đủ
3. **Thêm giỏ hàng**: Click "Thêm vào giỏ hàng" (cần đăng nhập)
4. **Mua ngay**: Click "Mua ngay" để checkout

#### 🤖 Sử Dụng AI Assistant

1. **Tìm kiếm từ header**: Nhập câu hỏi vào search bar
2. **Nhấn Enter** hoặc **click icon robot** để mở modal chat
3. **Chat với AI**: Hỏi về sách, tác giả, giá cả, cách mua hàng
4. **Lịch sử chat**: AI nhớ context của cuộc trò chuyện

#### 👨‍💼 Quản Trị

1. **Đăng nhập với tài khoản Admin**
2. **Quản lý sách**: CRUD, upload ảnh, export dữ liệu
3. **Quản lý người dùng**: CRUD, import/export CSV/Excel
4. **Xem thống kê**: Dashboard với metrics và charts

## 📁 Cấu Trúc Dự Án

```
src/
├── components/              # Components tái sử dụng
│   ├── admin/              # Components cho admin
│   │   ├── books/         # Quản lý sách
│   │   │   ├── create.book.tsx
│   │   │   ├── detail.book.tsx
│   │   │   ├── table.books.tsx
│   │   │   └── update.book.tsx
│   │   └── user/          # Quản lý người dùng
│   │       ├── create.user.tsx
│   │       ├── detail.user.tsx
│   │       ├── table.user.tsx
│   │       ├── update.user.tsx
│   │       └── data/
│   │           └── import.user.tsx
│   ├── context/           # React Context (Auth)
│   │   └── context.tsx
│   ├── layout/            # Layout components
│   │   ├── app.header.tsx # Header với AI search
│   │   ├── app.footer.tsx
│   │   ├── layout.admin.tsx
│   │   └── ai-chat.modal.tsx # AI Chat Modal
│   └── theme/             # Theme provider
│       └── theme.provider.tsx
│
├── pages/                  # Pages/Views
│   ├── admin/             # Admin pages
│   │   ├── dashboard.tsx
│   │   ├── manager.book.tsx
│   │   ├── manager.user.tsx
│   │   └── manager.order.tsx
│   ├── client/            # Client pages
│   │   ├── home.tsx       # Trang chủ với filter
│   │   ├── book.tsx       # Book wrapper
│   │   ├── book/          # Book detail
│   │   │   ├── book.detail.tsx
│   │   │   └── modal.gallery.tsx
│   │   ├── about.tsx
│   │   └── authentication/
│   │       ├── login.tsx
│   │       ├── register.tsx
│   │       ├── login.scss
│   │       └── register.scss
│   └── private.router.tsx # Protected routes
│
├── services/               # API services
│   ├── api.service.ts     # API endpoints
│   ├── axios.customize.ts # Axios config & interceptors
│   └── helper.ts          # Helper functions
│
├── styles/                 # Global styles
│   └── global.css         # Tailwind imports & CSS variables
│
├── types/                  # TypeScript definitions
│   ├── global.d.ts        # Global types (IUser, IBookTable, etc.)
│   ├── file.d.ts
│   └── react-csv.d.ts
│
├── layout.tsx             # Root layout
└── main.tsx               # Entry point
```

## 🔧 Cấu Hình

### API Configuration

Cấu hình API endpoint trong `src/services/axios.customize.ts`:

```typescript
const instance = axios.create({
  baseURL: `http://localhost:8080`, // hoặc import.meta.env.VITE_BACKEND_URL
  withCredentials: true,
});
```

### Tailwind CSS Configuration

File `tailwind.config.js`:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Custom theme extensions
};
```

### Ant Design Theme

Theme được cấu hình trong `src/components/theme/theme.provider.tsx` và inject CSS variables vào `:root` để tích hợp với Tailwind.

### Environment Variables

Tạo file `.env`:

```env
# Backend API
VITE_BACKEND_URL=http://localhost:8080

# AI API (optional)
VITE_AI_API_URL=http://localhost:8080/api/v1/ai
```

## 🎨 Styling Guide

### Tailwind CSS

Sử dụng Tailwind utility classes cho styling:

```tsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
  <h1 className="text-2xl font-bold text-blue-600">Title</h1>
</div>
```

### Ant Design Theme Integration

Sử dụng CSS variables từ Ant Design theme:

```tsx
<div className="bg-[var(--ant-color-bg-container)] rounded-[var(--ant-border-radius-lg)]">
  Content
</div>
```

### Responsive Breakpoints

- `sm`: ≥ 640px
- `md`: ≥ 768px
- `lg`: ≥ 1024px
- `xl`: ≥ 1280px

## 📝 Ghi Chú

- ⚠️ **Backend API** cần chạy trên port 8080 (mặc định)
- ⚠️ **CORS** phải được cấu hình đúng ở backend
- ⚠️ **Upload ảnh** yêu cầu endpoint `/api/v1/file/upload`
- ⚠️ **AI API** hiện tại dùng mock, cần tích hợp backend endpoint `/api/v1/ai/chat`
- ⚠️ **Authentication** sử dụng JWT token trong localStorage

### Deploy lên Vercel/Netlify

1. Push code lên GitHub
2. Kết nối repository với Vercel/Netlify
3. Cấu hình environment variables
4. Deploy!

## 📄 License

Dự án này được phát hành dưới license MIT.

## 👤 Tác Giả

**hktkhai2020**

- GitHub: [@hktkhai2020](https://github.com/hktkhai2020)

## 🙏 Lời Cảm Ơn

- [Ant Design](https://ant.design/) - UI Component Library
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://react.dev/) - The library for web and native user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Router](https://reactrouter.com/) - Declarative routing for React

---

<div align="center">

Made with ❤️ by hktkhai2020

⭐ Star this repo if you find it helpful!

**Happy Coding! 🚀**

</div>
