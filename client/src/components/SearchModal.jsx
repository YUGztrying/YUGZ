import { useState, useEffect, useRef } from 'react'
import { FiSearch, FiFile, FiClock } from 'react-icons/fi'
import '../styles/SearchModal.css'

function SearchModal({ isOpen, onClose, pages, onSelectPage }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      // Show recent pages when no query
      setResults(pages.slice(0, 5))
      return
    }

    // Search across page titles and content
    const searchTerm = query.toLowerCase()
    const searchResults = pages
      .map(page => {
        const titleMatch = page.title.toLowerCase().includes(searchTerm)

        // Search in block content
        let contentMatches = []
        page.blocks.forEach(block => {
          // Strip HTML tags for searching
          const textContent = block.content.replace(/<[^>]*>/g, '')
          if (textContent.toLowerCase().includes(searchTerm)) {
            contentMatches.push(textContent.substring(0, 100))
          }
        })

        if (titleMatch || contentMatches.length > 0) {
          return {
            ...page,
            titleMatch,
            contentMatches: contentMatches.slice(0, 2), // Limit to 2 matches
            relevance: titleMatch ? 100 : contentMatches.length * 10
          }
        }
        return null
      })
      .filter(Boolean)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10) // Limit to 10 results

    setResults(searchResults)
    setSelectedIndex(0)
  }, [query, pages])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelectPage(results[selectedIndex])
    }
  }

  const handleSelectPage = (page) => {
    onSelectPage(page)
    onClose()
  }

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    )
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages..."
            className="search-input"
          />
          <kbd className="search-hint">ESC</kbd>
        </div>

        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty">
              {query ? 'No results found' : 'Start typing to search...'}
            </div>
          ) : (
            <>
              {!query && (
                <div className="search-section-title">
                  <FiClock /> Recent Pages
                </div>
              )}
              {results.map((page, index) => (
                <div
                  key={page.id}
                  className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectPage(page)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="result-icon">
                    {page.icon || <FiFile />}
                  </div>
                  <div className="result-content">
                    <div className="result-title">
                      {query ? highlightMatch(page.title || 'Untitled', query) : (page.title || 'Untitled')}
                    </div>
                    {page.contentMatches && page.contentMatches.length > 0 && (
                      <div className="result-snippets">
                        {page.contentMatches.map((match, idx) => (
                          <div key={idx} className="result-snippet">
                            ...{highlightMatch(match, query)}...
                          </div>
                        ))}
                      </div>
                    )}
                    {!query && page.createdAt && (
                      <div className="result-date">
                        {new Date(page.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {index === selectedIndex && (
                    <div className="result-hint">
                      <kbd>↵</kbd>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="search-footer">
          <div className="search-footer-item">
            <kbd>↑</kbd> <kbd>↓</kbd> Navigate
          </div>
          <div className="search-footer-item">
            <kbd>↵</kbd> Open
          </div>
          <div className="search-footer-item">
            <kbd>ESC</kbd> Close
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
