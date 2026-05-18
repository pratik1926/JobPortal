
// export default {
//   darkMode: "class",

//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563eb",
          secondary: "#1d4ed8",
          accent: "#7c3aed",
        },

        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          elevated: "#f1f5f9",
        },

        text: {
          primary: "#0f172a",
          secondary: "#475569",
          muted: "#64748b",
        },

        border: {
          DEFAULT: "#e2e8f0",
        },

        success: "#16a34a",
        danger: "#dc2626",
        warning: "#f59e0b",
      },

      boxShadow: {
        card: "0 2px 12px rgba(15,23,42,0.06)",
        elevated: "0 12px 40px rgba(15,23,42,0.08)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },

      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },

  plugins: [],
};