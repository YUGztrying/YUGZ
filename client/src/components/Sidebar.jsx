import { FiPlus, FiTrash2 } from 'react-icons/fi'
import '../styles/Sidebar.css'

function Sidebar({ pages, currentPage, onSelectPage, onCreatePage, onDeletePage }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>📝 Notion Clone</h1>
        <button className="new-page-btn" onClick={onCreatePage} title="New Page">
          <FiPlus />
        </button>
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
