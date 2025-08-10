// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // v4: no `content` needed (the PostCSS plugin handles it)
  darkMode: 'class', // keep if you use dark mode classes; remove if not

  theme: {
    extend: {
      borderRadius: { DEFAULT: 'var(--radius)' },
      fontFamily: { sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'] },
    },
  },
};
