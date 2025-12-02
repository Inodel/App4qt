# React + TypeScript + Vite App

This is a React application built with Vite and TypeScript, deployed on Vercel.

## Status
test something message

## Deployed on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo-name)

This project is configured for deployment on Vercel. To deploy:

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Import your project
4. Vercel will automatically detect this is a Vite project and build it appropriately
5. Add your environment variables (GEMINI_API_KEY) in the Vercel dashboard under Settings > Environment Variables

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