import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ysu-red': '#C41230',
        'ysu-black': '#000000',
        'fyss-teal': '#00796B',
      },
    },
  },
  plugins: [],
};

export default config;
