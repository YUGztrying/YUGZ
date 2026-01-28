import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import SearchModal from './components/SearchModal'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import QuickActions from './components/QuickActions'
import './styles/App.css'

function App() {
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)

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
      // Create template pages
      const now = Date.now()
      
      const projectsDashboard = {
        id: (now + 1).toString(),
        title: 'Projects Dashboard',
        icon: '🎯',
        blocks: [
          {
            id: '1',
            type: 'heading1',
            content: 'Projects Dashboard',
            properties: {}
          },
          {
            id: '2',
            type: 'paragraph',
            content: 'Track all your active projects, blockers, and next actions in one place.',
            properties: {}
          },
          {
            id: '3',
            type: 'project',
            content: '',
            properties: {
              projectName: 'BADAGUESTHOUSE',
              status: 'blocked',
              nextAction: 'Contact owner about Infomaniak DNS access',
              notes: 'Website complete, blocked on DNS verification for Resend API setup'
            }
          },
          {
            id: '4',
            type: 'project',
            content: '',
            properties: {
              projectName: 'YUGZ',
              status: 'active',
              nextAction: 'Test mobile experience and gather feedback',
              notes: 'Custom productivity OS - Phase 1 complete with Instagram & Project blocks'
            }
          },
          {
            id: '5',
            type: 'project',
            content: '',
            properties: {
              projectName: 'YECARS',
              status: 'planning',
              nextAction: '',
              notes: ''
            }
          },
          {
            id: '6',
            type: 'project',
            content: '',
            properties: {
              projectName: '',
              status: 'planning',
              nextAction: '',
              notes: ''
            }
          }
        ],
        createdAt: new Date().toISOString()
      }

      const instagramHub = {
        id: (now + 2).toString(),
        title: 'Instagram Content',
        icon: '📱',
        blocks: [
          {
            id: '1',
            type: 'heading1',
            content: 'Instagram Content Hub',
            properties: {}
          },
          {
            id: '2',
            type: 'paragraph',
            content: 'Draft and organize your Instagram posts. Focus on AI automation, web dev, and emerging tech.',
            properties: {}
          },
          {
            id: '3',
            type: 'instagram',
            content: '',
            properties: {
              caption: '',
              hashtags: '#ai #automation #worldbank #tech',
              image: ''
            }
          },
          {
            id: '4',
            type: 'instagram',
            content: '',
            properties: {
              caption: '',
              hashtags: '#ai #automation #worldbank #tech',
              image: ''
            }
          },
          {
            id: '5',
            type: 'instagram',
            content: '',
            properties: {
              caption: '',
              hashtags: '#ai #automation #worldbank #tech',
              image: ''
            }
          }
        ],
        createdAt: new Date().toISOString()
      }

      const welcomePage = {
        id: now.toString(),
        title: 'Welcome to YUGZ',
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
            content: 'Your personal productivity OS. Built for automation, content creation, and getting shit done.',
            properties: {}
          },
          {
            id: '3',
            type: 'heading2',
            content: 'Quick Start',
            properties: {}
          },
          {
            id: '4',
            type: 'bulletList',
            content: '<strong>Projects Dashboard</strong> - Track all your projects in one place',
            properties: {}
          },
          {
            id: '5',
            type: 'bulletList',
            content: '<strong>Instagram Content</strong> - Draft posts with captions & hashtags',
            properties: {}
          },
          {
            id: '6',
            type: 'bulletList',
            content: 'Press <strong>/</strong> to see all block types',
            properties: {}
          },
          {
            id: '7',
            type: 'bulletList',
            content: 'Press <strong>Ctrl/Cmd + K</strong> to search',
            properties: {}
          }
        ],
        createdAt: new Date().toISOString()
      }

      const defaultPages = [welcomePage, projectsDashboard, instagramHub]
      setPages(defaultPages)
      setCurrentPage(projectsDashboard)
      localStorage.setItem('yugz-pages', JSON.stringify(defaultPages))
    }
  }, [])

  useEffect(() => {
    // Global keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        createNewPage()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && !e.shiftKey) {
        e.preventDefault()
        setShowAnalytics(true)
        setCurrentPage(null)
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

  const handleQuickAction = (action) => {
    switch (action) {
      case 'newPage':
        createNewPage()
        break
      case 'newInstagram':
        createInstagramPage()
        break
      case 'newProject':
        createProjectPage()
        break
      case 'analytics':
        setShowAnalytics(true)
        setCurrentPage(null)
        break
      case 'export':
        exportData()
        break
      case 'backup':
        backupData()
        break
      default:
        break
    }
  }

  const createInstagramPage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: 'Instagram Content',
      icon: '📱',
      blocks: [
        {
          id: (Date.now() + 1).toString(),
          type: 'instagram',
          content: '',
          properties: { caption: '', hashtags: '#ai #automation #tech', image: '' }
        }
      ],
      createdAt: new Date().toISOString()
    }
    const updatedPages = [...pages, newPage]
    setPages(updatedPages)
    setCurrentPage(newPage)
    setShowAnalytics(false)
    localStorage.setItem('yugz-pages', JSON.stringify(updatedPages))
  }

  const createProjectPage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: 'Projects',
      icon: '🎯',
      blocks: [
        {
          id: (Date.now() + 1).toString(),
          type: 'project',
          content: '',
          properties: { projectName: '', status: 'planning', nextAction: '', notes: '' }
        }
      ],
      createdAt: new Date().toISOString()
    }
    const updatedPages = [...pages, newPage]
    setPages(updatedPages)
    setCurrentPage(newPage)
    setShowAnalytics(false)
    localStorage.setItem('yugz-pages', JSON.stringify(updatedPages))
  }

  const exportData = () => {
    const dataStr = JSON.stringify(pages, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `yugz-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const backupData = () => {
    exportData()
    alert('✅ Backup created! Data exported as JSON.')
  }

  return (
    <div className="app">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        pages={pages}
        onSelectPage={setCurrentPage}
      />

      {/* Mobile menu button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <Sidebar
        pages={pages}
        currentPage={currentPage}
        onSelectPage={(page) => {
          setCurrentPage(page)
          setShowAnalytics(false)
          // Auto-close sidebar on mobile after selecting page
          if (window.innerWidth <= 768) {
            setIsSidebarOpen(false)
          }
        }}
        onCreatePage={createNewPage}
        onDeletePage={deletePage}
        onOpenSearch={() => setIsSearchOpen(true)}
        onShowAnalytics={() => {
          setShowAnalytics(true)
          setCurrentPage(null)
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="main-content">
        {showAnalytics ? (
          <AnalyticsDashboard pages={pages} />
        ) : currentPage ? (
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

      <QuickActions onAction={handleQuickAction} />
    </div>
  )
}

export default App
