// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // v4: no `content` needed (the PostCSS plugin handles it)
  darkMode: 'class', // keep if you use dark mode classes; remove if not

  theme: {
    extend: {
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: { sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'] },
    },
  },
};
