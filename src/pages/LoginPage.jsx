import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    // Check if email is super admin
    const isSuperAdmin = email === 'jobfresh@jobfresh.in'

    const handleRequestOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const response = await axios.post('https://api.jobfresh.in/api/auth/request-otp', { email })
            setMessage(response.data.message)
            setOtpSent(true)
            setShowOtpInput(true)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await axios.post('https://api.jobfresh.in/api/auth/verify-otp', { email, otp })

            // Store auth data
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data))

            // Redirect to admin
            navigate('/admin')
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await axios.post('https://api.jobfresh.in/api/auth/login', { email, password })

            // Store auth data
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data))

            // Redirect to admin
            navigate('/admin')
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>JobFresh Admin</h1>
                        <p>Sign in to manage your job board</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {message && (
                        <div className="alert alert-success">
                            <span>✓</span> {message}
                        </div>
                    )}

                    <form onSubmit={isSuperAdmin ? (otpSent ? handleVerifyOtp : handleRequestOtp) : handlePasswordLogin}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                disabled={otpSent}
                            />
                        </div>

                        {isSuperAdmin ? (
                            // OTP Flow for Super Admin
                            <>
                                {showOtpInput && (
                                    <div className="form-group">
                                        <label>Enter OTP Code</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="123456"
                                            maxLength={6}
                                            required
                                            autoFocus
                                        />
                                        <small>Check your email for the 6-digit code</small>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : (otpSent ? 'Verify OTP' : 'Send OTP')}
                                </button>

                                {otpSent && (
                                    <button
                                        type="button"
                                        className="btn-text"
                                        onClick={() => {
                                            setOtpSent(false)
                                            setShowOtpInput(false)
                                            setOtp('')
                                            setMessage('')
                                        }}
                                    >
                                        Use different email
                                    </button>
                                )}
                            </>
                        ) : (
                            // Password Flow for Regular Users
                            <>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </>
                        )}
                    </form>

                    <div className="login-footer">
                        <small>
                            {isSuperAdmin ? (
                                '🔐 Super Admin - OTP Authentication'
                            ) : (
                                '🔑 User Login - Password Authentication'
                            )}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    )
}
