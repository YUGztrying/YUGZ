import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import './styles/App.css'

function App() {
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(null)

  useEffect(() => {
    // Load pages from localStorage on mount
    const savedPages = localStorage.getItem('notion-pages')
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
            content: 'Welcome to Notion Clone!',
            properties: {}
          },
          {
            id: '2',
            type: 'paragraph',
            content: 'This is a block-based editor similar to Notion. Start typing to create content.',
            properties: {}
          }
        ],
        createdAt: new Date().toISOString()
      }
      setPages([defaultPage])
      setCurrentPage(defaultPage)
      localStorage.setItem('notion-pages', JSON.stringify([defaultPage]))
    }
  }, [])

  const savePage = (updatedPage) => {
    const updatedPages = pages.map(p =>
      p.id === updatedPage.id ? updatedPage : p
    )
    setPages(updatedPages)
    setCurrentPage(updatedPage)
    localStorage.setItem('notion-pages', JSON.stringify(updatedPages))
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
    localStorage.setItem('notion-pages', JSON.stringify(updatedPages))
  }

  const deletePage = (pageId) => {
    const updatedPages = pages.filter(p => p.id !== pageId)
    setPages(updatedPages)
    if (currentPage?.id === pageId) {
      setCurrentPage(updatedPages[0] || null)
    }
    localStorage.setItem('notion-pages', JSON.stringify(updatedPages))
  }

  return (
    <div className="app">
      <Sidebar
        pages={pages}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onCreatePage={createNewPage}
        onDeletePage={deletePage}
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
