// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'], // Ajusta el contenido según tu proyecto
  theme: {
    extend: {
      // Añadimos las clases personalizadas
      scrollbar: {
        hide: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '&': {
            '-ms-overflow-style': 'none', /* IE y Edge */
            'scrollbar-width': 'none', /* Firefox */
          },
        },
      },
    },
  },
  plugins: [],
};
