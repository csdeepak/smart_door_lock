module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'granted': '#10B981',  // Green for success
        'denied': '#EF4444',   // Red for errors
        'pending': '#F59E0B',  // Yellow for in-progress
      },
      fontFamily: {
        'mono': ['"Roboto Mono"', 'monospace'] // For status logs
      }
    },
  },
  plugins: [],
}