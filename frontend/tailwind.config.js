/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    safelist: [
      'w-screen',
      'overflow-x-hidden',
      'text-red-500',
      'bg-blue-500',
      'min-h-screen',
      // Add any other dynamic classes you want to preserve
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  