import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import SearchModal from './components/SearchModal'
import './styles/App.css'

function App() {
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    // Load pages from localStorage on mount
    const savedPages = localStorage.getItem('yugz-pages')
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages)
      setPages(parsedPages)
      if (parsedPages.length > 0) {
        setCurrentPage(parsedPages[0])
      }
    } else {
      // Create a default page
      const defaultPage = {
        id: Date.now().toString(),
        title: 'Getting Started',
        icon: '👋',
        blocks: [
          {
            id: '1',
            type: 'heading1',
            content: 'Welcome to YUGZ!',
            properties: {}
          },
          {
            id: '2',
            type: 'paragraph',
            content: 'A powerful block-based editor with rich text formatting. Start typing to create content, or press <strong>Ctrl/Cmd + K</strong> to search.',
            properties: {}
          }
        ],
        createdAt: new Date().toISOString()
      }
      setPages([defaultPage])
      setCurrentPage(defaultPage)
      localStorage.setItem('yugz-pages', JSON.stringify([defaultPage]))
    }
  }, [])

  useEffect(() => {
    // Global keyboard shortcut for search
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const savePage = (updatedPage) => {
    const updatedPages = pages.map(p =>
      p.id === updatedPage.id ? updatedPage : p
    )
    setPages(updatedPages)
    setCurrentPage(updatedPage)
    localStorage.setItem('yugz-pages', JSON.stringify(updatedPages))
  }

  const createNewPage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: 'Untitled',
      icon: '📄',
      blocks: [
        {
          id: Date.now().toString(),
          type: 'paragraph',
          content: '',
          properties: {}
        }
      ],
      createdAt: new Date().toISOString()
    }
    const updatedPages = [...pages, newPage]
    setPages(updatedPages)
    setCurrentPage(newPage)
    localStorage.setItem('yugz-pages', JSON.stringify(updatedPages))
  }

  const deletePage = (pageId) => {
    const updatedPages = pages.filter(p => p.id !== pageId)
    setPages(updatedPages)
    if (currentPage?.id === pageId) {
      setCurrentPage(updatedPages[0] || null)
    }
    localStorage.setItem('yugz-pages', JSON.stringify(updatedPages))
  }

  return (
    <div className="app">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        pages={pages}
        onSelectPage={setCurrentPage}
      />

      <Sidebar
        pages={pages}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onCreatePage={createNewPage}
        onDeletePage={deletePage}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <div className="main-content">
        {currentPage ? (
          <Editor
            page={currentPage}
            onSave={savePage}
          />
        ) : (
          <div className="empty-state">
            <h2>No page selected</h2>
            <p>Create a new page or select one from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
