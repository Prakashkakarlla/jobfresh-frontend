# JobFresh Frontend

A modern React.js frontend for the JobFresh job board application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🌐 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://api.jobfresh.in`)
5. Click Deploy

### Option 2: Deploy via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://api.jobfresh.in
```

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes (for production) |

## 📁 Project Structure

```
src/
├── components/     # Reusable components
│   ├── admin/      # Admin panel components
│   ├── common/     # Common UI components
│   └── layout/     # Layout components
├── pages/          # Page components
├── api.js          # Axios configuration
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## 🎨 Features

- **Job Listings** - Browse and search jobs
- **Blog** - Career guides and tips
- **Admin Panel** - Manage jobs, blogs, categories
- **User Authentication** - Login/Register
- **Responsive Design** - Works on all devices

## 🔒 Admin Roles

- **SUPER_ADMIN** - Full access
- **ADMIN** - Manage all content
- **JOB_MANAGER** - Manage jobs and companies
- **CONTENT_MANAGER** - Manage blogs

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📄 License

MIT License
