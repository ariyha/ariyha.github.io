# Portfolio Website

A modern, interactive developer portfolio showcasing AI research and full-stack development projects. Built with React, Vite, and styled with Tailwind CSS, featuring smooth animations and an engaging user experience.

## 🚀 Features

- **Interactive Design**: Smooth animations powered by Framer Motion
- **Modern Tech Stack**: React 18, Vite, Tailwind CSS
- **Responsive Layout**: Optimized for all device sizes
- **Dynamic Animations**: Particle effects, cursor trails, and typing animations
- **Dark Mode UI**: Professional dark theme design
- **Performance Optimized**: Fast loading with Vite bundler

## 📁 Project Structure

```
portfolio/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/                    # Source code
│   ├── App.css            # Legacy styles (if needed)
│   ├── App.test.js        # Test files
│   ├── index.css          # Global styles and Tailwind imports
│   ├── index.js           # Legacy entry point
│   ├── main.jsx           # Main React entry point
│   ├── Portfolio.jsx      # Main portfolio component
│   └── logo.svg           # React logo
├── index.html             # Vite entry HTML
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, React Spring
- **Icons**: Lucide React
- **Development**: ESLint for code quality

## 📦 Dependencies

### Core Dependencies
- `react` & `react-dom` - React framework
- `framer-motion` - Animation library
- `@react-spring/web` & `react-spring` - Spring animations
- `lucide-react` - Icon library

### Development Dependencies
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite
- `tailwindcss` - Utility-first CSS framework
- `autoprefixer` & `postcss` - CSS processing

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine (version 14 or higher recommended).

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Project

#### Development Mode
Start the development server with hot reload:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

#### Build for Production
Create an optimized production build:
```bash
npm run build
```
The built files will be in the `dist` directory.

#### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

#### Code Linting
Run ESLint to check code quality:
```bash
npm run lint
```

#### Deploy (if configured)
Deploy to GitHub Pages:
```bash
npm run deploy
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` to customize the design system
- Edit `src/index.css` for global styles
- Component-specific styles are handled with Tailwind classes in `Portfolio.jsx`

### Content
- Update personal information, projects, and experience in `src/Portfolio.jsx`
- Replace logos and images in the `public` directory
- Modify the typing animation text and other dynamic content

### Animations
- Framer Motion configurations can be adjusted in `Portfolio.jsx`
- Particle effects and cursor trails are customizable through component state

## 🔧 Configuration Files

- **`vite.config.js`**: Vite bundler configuration
- **`tailwind.config.js`**: Tailwind CSS customization
- **`postcss.config.js`**: PostCSS plugins configuration
- **`package.json`**: Project metadata and scripts

## 🌐 Deployment

The project is configured for easy deployment to various platforms:

- **GitHub Pages**: Use `npm run deploy` (requires gh-pages package)
- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **Other platforms**: Upload the contents of `dist` folder

## 📱 Browser Support

The portfolio is optimized for modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

For questions or suggestions, feel free to reach out through the contact form on the portfolio or via the social links provided.

---

Built with ❤️ using React and modern web technologies and **VIBE CODING**.
