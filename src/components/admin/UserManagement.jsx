import { useState, useEffect } from 'react'
import axios from 'axios'
import './UserManagement.css'

export default function UserManagement() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'ADMIN'
    })

    const roles = [
        { value: 'ADMIN', label: 'Admin', desc: 'Manage users & content' },
        { value: 'CONTENT_MANAGER', label: 'Content Manager', desc: 'Manage blog posts' },
        { value: 'JOB_MANAGER', label: 'Job Manager', desc: 'Manage job postings' }
    ]

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users')
            setUsers(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching users:', error)
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (editingUser) {
                // Update user
                await axios.put(`/api/admin/users/${editingUser.id}`, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    role: formData.role,
                    enabled: true
                })
            } else {
                // Create new user
                await axios.post('/api/admin/users', formData)
            }

            fetchUsers()
            closeModal()
        } catch (error) {
            console.error('Error saving user:', error)
            alert(error.response?.data?.error || 'Failed to save user')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return

        try {
            await axios.delete(`/api/admin/users/${id}`)
            fetchUsers()
        } catch (error) {
            console.error('Error deleting user:', error)
            alert(error.response?.data?.error || 'Failed to delete user')
        }
    }

    const openAddModal = () => {
        setEditingUser(null)
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            role: 'ADMIN'
        })
        setShowModal(true)
    }

    const openEditModal = (user) => {
        setEditingUser(user)
        setFormData({
            email: user.email,
            password: '',
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingUser(null)
    }

    const getRoleBadge = (role) => {
        const colors = {
            SUPER_ADMIN: 'badge-purple',
            ADMIN: 'badge-blue',
            CONTENT_MANAGER: 'badge-green',
            JOB_MANAGER: 'badge-orange'
        }
        return colors[role] || 'badge-gray'
    }

    if (loading) return <div className="loading">Loading users...</div>

    return (
        <div className="user-management">
            <div className="management-header">
                <div>
                    <h2>User Management</h2>
                    <p>{users.length} total users</p>
                </div>
                <button onClick={openAddModal} className="btn-add">
                    + Add User
                </button>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-name">{user.fullName}</div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${getRoleBadge(user.role)}`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    {user.lastLogin
                                        ? new Date(user.lastLogin).toLocaleDateString()
                                        : 'Never'}
                                </td>
                                <td>
                                    {user.role !== 'SUPER_ADMIN' && (
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="btn-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={closeModal} className="modal-close">×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {!editingUser && (
                                <>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password *</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                        <small>Minimum 6 characters. User will receive this via email.</small>
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label>Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    required
                                >
                                    {roles.map(role => (
                                        <option key={role.value} value={role.value}>
                                            {role.label} - {role.desc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
