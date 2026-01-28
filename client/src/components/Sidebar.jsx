import { FiPlus, FiTrash2, FiSearch, FiBarChart } from 'react-icons/fi'
import '../styles/Sidebar.css'

function Sidebar({ pages, currentPage, onSelectPage, onCreatePage, onDeletePage, onOpenSearch, onShowAnalytics, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h1>📝 YUGZ</h1>
        <div className="sidebar-actions">
          <button className="search-btn" onClick={onOpenSearch} title="Search (Ctrl+K)">
            <FiSearch />
          </button>
          <button className="analytics-btn" onClick={onShowAnalytics} title="Analytics (Ctrl+A)">
            <FiBarChart />
          </button>
          <button className="new-page-btn" onClick={onCreatePage} title="New Page">
            <FiPlus />
          </button>
        </div>
      </div>

      <div className="pages-list">
        {pages.map(page => (
          <div
            key={page.id}
            className={`page-item ${currentPage?.id === page.id ? 'active' : ''}`}
            onClick={() => onSelectPage(page)}
          >
            <span className="page-icon">{page.icon}</span>
            <span className="page-title">{page.title || 'Untitled'}</span>
            <button
              className="delete-page-btn"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete "${page.title}"?`)) {
                  onDeletePage(page.id)
                }
              }}
              title="Delete Page"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button
          className="reset-btn"
          onClick={() => {
            if (confirm('Reset workspace to templates? This will delete all current pages.')) {
              localStorage.removeItem('yugz-pages')
              window.location.reload()
            }
          }}
          title="Reset to Templates"
        >
          🔄 Reset Workspace
        </button>
      </div>
    </div>
    </>
  )
}

export default Sidebar
