import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi'
import '../styles/Sidebar.css'

function Sidebar({ pages, currentPage, onSelectPage, onCreatePage, onDeletePage, onOpenSearch }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>📝 YUGZ</h1>
        <div className="sidebar-actions">
          <button className="search-btn" onClick={onOpenSearch} title="Search (Ctrl+K)">
            <FiSearch />
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
    </div>
  )
}

export default Sidebar
