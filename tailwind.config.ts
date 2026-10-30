import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        angoepo: {
          navy: '#0b1329',
          'navy-light': '#162044',
          blue: '#1d4ed8',
          cyan: '#0284c7',
          emerald: '#16a34a',
          gold: '#d97706',
        },
      },
    },
  },
  plugins: [],
};

export default config;
