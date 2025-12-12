import './Skeleton.css'

// Skeleton Job Card Component
export function SkeletonJobCard() {
    return (
        <div className="skeleton-job-card">
            <div className="skeleton skeleton-badge"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-company"></div>
            <div className="skeleton-meta">
                <div className="skeleton skeleton-meta-item"></div>
                <div className="skeleton skeleton-meta-item"></div>
            </div>
            <div className="skeleton skeleton-salary"></div>
        </div>
    )
}

// Skeleton Blog Card Component
export function SkeletonBlogCard() {
    return (
        <div className="skeleton-blog-card">
            <div className="skeleton skeleton-blog-image"></div>
            <div className="skeleton-blog-content">
                <div className="skeleton skeleton-blog-title"></div>
                <div className="skeleton skeleton-blog-excerpt"></div>
                <div className="skeleton skeleton-blog-excerpt" style={{ width: '80%' }}></div>
                <div className="skeleton skeleton-blog-meta"></div>
            </div>
        </div>
    )
}

// Grid of skeleton job cards
export function SkeletonJobGrid({ count = 6 }) {
    return (
        <div className="jobs-grid">
            {Array(count).fill(0).map((_, index) => (
                <SkeletonJobCard key={index} />
            ))}
        </div>
    )
}

// Grid of skeleton blog cards
export function SkeletonBlogGrid({ count = 6 }) {
    return (
        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {Array(count).fill(0).map((_, index) => (
                <SkeletonBlogCard key={index} />
            ))}
        </div>
    )
}

// Skeleton for job details page
export function SkeletonJobDetails() {
    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="skeleton skeleton-detail-title"></div>
            <div className="skeleton skeleton-detail-subtitle"></div>
            <div style={{ marginTop: '2rem' }}>
                {Array(8).fill(0).map((_, index) => (
                    <div key={index} className="skeleton skeleton-detail-content"></div>
                ))}
            </div>
        </div>
    )
}

// Skeleton for blog details page
export function SkeletonBlogDetails() {
    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="skeleton skeleton-detail-hero"></div>
            <div className="skeleton skeleton-detail-title"></div>
            <div className="skeleton skeleton-detail-subtitle"></div>
            <div style={{ marginTop: '2rem' }}>
                {Array(10).fill(0).map((_, index) => (
                    <div key={index} className="skeleton skeleton-detail-content"></div>
                ))}
            </div>
        </div>
    )
}
