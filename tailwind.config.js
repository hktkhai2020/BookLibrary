/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // Tắt preflight nếu muốn giữ nguyên styles hiện tại của Ant Design
  corePlugins: {
    preflight: false, // Giữ nguyên để không conflict với Ant Design
  },
};
