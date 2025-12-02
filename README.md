# React + TypeScript + Vite App

This is a React application built with Vite and TypeScript, deployed on Vercel.

## Status
test something message

## Deployed on Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/your-repo-name)

This project is configured for deployment on Netlify. To deploy:

1. Push your code to a GitHub repository
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git" and connect your repository
4. Netlify will automatically detect the build settings from netlify.toml
5. Add your environment variables (GEMINI_API_KEY) in Site settings > Environment variables

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Building for Production

To build the project for production:
```bash
npm run build
```

This will create a `dist` folder with the production-ready build.