# 📝 YUGZ

A powerful block-based editor inspired by Notion. Built with React, Node.js, Express, and MongoDB. Features rich text formatting, intelligent search, page management, and a beautiful dark mode interface.

## ✨ Features

### Block-Based Editor
- **Multiple Block Types:**
  - 📝 Paragraph
  - H1/H2/H3 Headings
  - • Bullet Lists
  - 1. Numbered Lists
  - ☐ To-do Lists with checkboxes
  - `</> Code blocks
  - " Quotes

### Rich Text Formatting
- **Text Styles:**
  - **Bold** (Ctrl/Cmd + B)
  - *Italic* (Ctrl/Cmd + I)
  - Underline (Ctrl/Cmd + U)
  - ~~Strikethrough~~
  - `Inline Code`
  - [Links](https://example.com) (Ctrl/Cmd + K)
- **Colors & Highlights:**
  - 9 text colors
  - 9 background highlights
  - Visual color picker

### Search
- **Quick Search** (Ctrl/Cmd + K)
  - Search across all page titles and content
  - Real-time search results
  - Keyboard navigation (↑↓ arrows, Enter to open)
  - Shows content snippets with highlighted matches
  - Recent pages when no query
- **Smart Highlighting:**
  - Query matches highlighted in titles
  - Context snippets from page content
  - Relevance-based sorting

### Editor Capabilities
- **Keyboard Shortcuts:**
  - `Ctrl/Cmd + K` - Open search
  - `Enter` - Create new block below
  - `Backspace` on empty block - Delete block
  - `/` - Open block type menu
  - `Ctrl/Cmd + B` - Bold
  - `Ctrl/Cmd + I` - Italic
  - `Ctrl/Cmd + U` - Underline

- **Block Operations:**
  - Move blocks up/down
  - Delete blocks via menu
  - Change block type on-the-fly
  - Select text to show formatting toolbar

### Page Management
- Create unlimited pages
- Custom page icons (emoji support)
- Page titles
- Sidebar navigation
- Delete pages

### Storage
- **Dual Mode:**
  - localStorage (works offline, no setup)
  - MongoDB backend (persistent, scalable)
- Automatic fallback to localStorage if backend unavailable

### UI/UX
- **Dark Mode** - Beautiful dark theme inspired by Notion
- Clean, minimal interface
- Smooth transitions and animations
- Responsive design

## 🚀 Quick Start

### Option 1: localStorage Mode (No Database Required)

Perfect for quick testing and personal use:

```bash
# Install dependencies
npm run install-all

# Start frontend only
cd client
npm run dev
```

Visit `http://localhost:3000` - Your data will be saved in the browser!

### Option 2: Full Stack with MongoDB

For persistent storage across devices:

1. **Install MongoDB** (if not already installed)
   - macOS: `brew install mongodb-community`
   - Ubuntu: `sudo apt install mongodb`
   - Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)

2. **Start MongoDB**
   ```bash
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

3. **Run the application**
   ```bash
   # Install all dependencies
   npm run install-all

   # Start both frontend and backend
   npm run dev
   ```

4. **Access the app**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📁 Project Structure

```
notion-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Editor.jsx
│   │   │   └── Block.jsx
│   │   ├── styles/        # CSS files
│   │   ├── utils/         # API utilities
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   │   └── Page.js
│   ├── routes/           # API routes
│   │   └── pages.js
│   ├── server.js         # Express server
│   └── package.json
│
└── package.json          # Root package file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

## 📝 Usage Guide

### Creating Pages
1. Click the `+` button in the sidebar
2. New page appears with default "Untitled" name
3. Click on page to edit

### Editing Content
1. Click in the editor to start typing
2. Press `/` to see block type options
3. Use `Enter` to create new blocks
4. Hover over blocks to see controls (delete, move, etc.)

### Block Types
- Type `/` and select from the menu, or
- Start typing and change type later via the menu button

### Keyboard Shortcuts
- `Enter` - New block
- `Backspace` on empty - Delete block
- `/` - Block type menu

## 🔧 Development

### Available Scripts

```bash
# Install all dependencies (root, client, server)
npm run install-all

# Run frontend and backend concurrently
npm run dev

# Run frontend only
npm run client

# Run backend only
npm run server
```

### Frontend Development
```bash
cd client
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd server
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
```

## 🌐 API Endpoints

### Pages
- `GET /api/pages` - Get all pages
- `GET /api/pages/:id` - Get single page
- `POST /api/pages` - Create new page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

### Health Check
- `GET /api/health` - Server status

## 🎨 Customization

### Styling
All styles are in `client/src/styles/`:
- `index.css` - Global styles and CSS variables
- `App.css` - Main layout
- `Sidebar.css` - Sidebar styling
- `Editor.css` - Editor layout
- `Block.css` - Block components

### CSS Variables (Dark Mode)
The app uses a beautiful dark theme. Edit `client/src/styles/index.css` to customize colors:
```css
:root {
  --bg-primary: #191919;      /* Main background */
  --bg-secondary: #252525;    /* Sidebar & code blocks */
  --bg-hover: #2f2f2f;        /* Hover states */
  --text-primary: #ffffff;    /* Primary text */
  --text-secondary: #9b9b9b;  /* Secondary text */
  --border-color: #373737;    /* Borders */
  --accent-color: #4a9eff;    /* Links & accents */
}
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is installed and running
- Check connection string in `server/.env`
- App will fallback to localStorage automatically

### Port Already in Use
- Frontend (3000): Edit `client/vite.config.js`
- Backend (5000): Edit `server/.env`

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment. Follow these steps:

1. **Push your code to GitHub** (if not already done)
   ```bash
   git push origin your-branch
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`
   - Click "Deploy"

3. **That's it!** Your app will be live in seconds.

The app uses localStorage by default, so no database setup is needed for deployment. Your data persists in the browser.

### Alternative: Deploy Frontend to Netlify
```bash
cd client
npm run build
# Deploy the 'dist' folder to Netlify
```

### Optional: Deploy Backend (Heroku/Railway)
If you want to add MongoDB backend:
```bash
cd server
# Set environment variables (MONGODB_URI)
# Deploy with Node.js buildpack
```

## 📄 License

MIT License - feel free to use this project for learning or personal use!

## 🤝 Contributing

This is a learning project, but contributions are welcome:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🙏 Acknowledgments

- Inspired by [Notion](https://www.notion.so)
- Built to demonstrate modern block-based editor architecture
- Powered by React, Express, and MongoDB

---

**Enjoy building with YUGZ!** 🚀