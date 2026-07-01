/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./sections/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "PingFang SC",
          "Noto Sans SC",
          "sans-serif"
        ]
      },
      colors: {
        blackBg: "#050505",
        whiteBg: "#F5F5F7",
        textDark: "#111111",
        textSoft: "#86868B",
        glass: "rgba(255, 255, 255, 0.08)",
        line: "rgba(255, 255, 255, 0.14)",
        cool: "#DDEBFF"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.32)",
        soft: "0 30px 100px rgba(12, 18, 28, 0.16)",
        glow: "0 0 80px rgba(190, 214, 255, 0.22)"
      },
      borderRadius: {
        work: "24px"
      }
    }
  },
  plugins: []
};
