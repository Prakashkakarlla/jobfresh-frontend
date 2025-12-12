// Simple cache utility with localStorage and expiration

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export const cache = {
    // Set data with expiration
    set: (key, data) => {
        try {
            const cacheItem = {
                data,
                timestamp: Date.now()
            }
            localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem))
        } catch (error) {
            console.warn('Cache set failed:', error)
        }
    },

    // Get data if not expired
    get: (key) => {
        try {
            const cached = localStorage.getItem(`cache_${key}`)
            if (!cached) return null

            const cacheItem = JSON.parse(cached)
            const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION

            if (isExpired) {
                localStorage.removeItem(`cache_${key}`)
                return null
            }

            return cacheItem.data
        } catch (error) {
            console.warn('Cache get failed:', error)
            return null
        }
    },

    // Clear specific key
    remove: (key) => {
        try {
            localStorage.removeItem(`cache_${key}`)
        } catch (error) {
            console.warn('Cache remove failed:', error)
        }
    },

    // Clear all cache
    clear: () => {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'))
            keys.forEach(key => localStorage.removeItem(key))
        } catch (error) {
            console.warn('Cache clear failed:', error)
        }
    }
}

// Cache keys
export const CACHE_KEYS = {
    JOBS: 'jobs',
    JOB_CATEGORIES: 'job_categories',
    BLOG_POSTS: 'blog_posts',
    BLOG_CATEGORIES: 'blog_categories'
}

export default cache
