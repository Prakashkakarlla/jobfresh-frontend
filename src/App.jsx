import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import JobDetailsPage from './pages/JobDetailsPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import AboutPage from './pages/AboutPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="app">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/jobs/:slug" element={<JobDetailsPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:slug" element={<BlogDetailPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
