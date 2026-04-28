/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',

    content: [
        './index.html',
        './main.tsx',
        './app/**/*.{js,ts,jsx,tsx}',
        './styles/**/*.css',
    ],

    theme: {
        extend: {},
    },

    plugins: [],
};