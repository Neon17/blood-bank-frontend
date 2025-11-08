// tailwind.config.js
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/_components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './**/*.{js,ts,jsx,tsx,mdx}', // Nuclear option - scan everything
  ],
  important: true, // Force all utilities to be !important
  theme: { extend: {} },
  plugins: [],
};
