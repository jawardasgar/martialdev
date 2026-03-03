# MartialDev

**The Future of Development**

MartialDev is a futuristic development platform that combines the discipline and precision of martial arts with cutting-edge development practices.

## 🎨 Theme

- **Primary Color**: Royal Blue (#4169E1)
- **Secondary Color**: Crimson Red (#DC143C)
- **Background**: Deep Black (#000000)
- **Style**: Futuristic with glowing effects, animations, and cyberpunk aesthetics

## 🚀 Features

- ⚡ Lightning fast performance
- 🔒 Secure by default
- 🚀 Infinitely scalable
- 💎 Modern technology stack
- 🎯 Futuristic UI with glowing effects
- ✨ Smooth animations and transitions
- 📱 Fully responsive design

## 🛠️ Tech Stack

- TypeScript
- Express.js
- HTML5 / CSS3
- Modern JavaScript (ES6+)

## 🏗️ Project Architecture

**Stack**: Node.js + Express.js (Backend) + Vanilla JavaScript (Frontend)

This is a **full-stack web application** using:

- **Backend**: Express.js server (TypeScript)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN) + Custom CSS
- **No framework dependencies** - Pure vanilla JS for maximum performance

## 📁 Project Structure

```
martialdev/
├── src/                        # Backend source code (TypeScript)
│   ├── app.ts                  # Express server entry point
│   └── types/
│       └── index.ts            # TypeScript type definitions
│
├── public/                     # Frontend static assets
│   ├── index.html              # Main HTML page
│   ├── styles.css              # Custom styling & animations
│   ├── script.js               # Core JavaScript functionality
│   ├── chatbot.js              # AI chatbot integration
│   ├── animated-background.js  # Dynamic background effects
│   ├── logo.svg                # Brand logo
│   └── icons/                  # Icon assets
│
├── dist/                       # Compiled TypeScript output
│   └── app.js                  # Compiled Express server
│
├── node_modules/               # Dependencies (gitignored)
├── package.json                # NPM configuration
├── tsconfig.json               # TypeScript configuration
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
└── LOGO_INSTRUCTIONS.md        # Logo guidelines
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Build TypeScript and start server
npm run dev
```

### Production

```bash
# Build TypeScript
npm run build

# Start the production server
npm start
```

The server will start on `http://localhost:3000`

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled server
- `npm run dev` - Build and start (development mode)

## 🎨 Logo

The MartialDev logo features:

- "Martial" in gradient blue with glow effect
- "Dev" in gradient red with glow effect
- Black background with rounded corners
- Futuristic Orbitron font

To replace the SVG logo with your PNG logo:

1. Save your logo image as `public/logo.png`
2. Update the image references in `public/index.html` to use `.png` instead of `.svg`

## 🌟 Design Features

### Futuristic Elements

- Animated starfield background
- Glitch text effects on hero title
- Rotating orbital circles
- Gradient borders and glowing effects
- Smooth scroll animations
- Interactive hover states with ripple effects

### Responsive Layout

- Mobile-first design
- Optimized for all screen sizes
- Touch-friendly navigation

## 📝 Customization

Edit the CSS variables in `public/styles.css` to customize colors:

```css
:root {
  --primary-blue: #4169e1;
  --secondary-red: #dc143c;
  --dark-bg: #000000;
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the ISC License.

---

**Built with 🥋 by MartialDev Team**
