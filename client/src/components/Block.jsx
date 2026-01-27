import { useState, useRef, useEffect } from 'react'
import { FiMoreVertical, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import FormattingToolbar from './FormattingToolbar'
import ImageBlock from './ImageBlock'
import VideoBlock from './VideoBlock'
import FileBlock from './FileBlock'
import '../styles/Block.css'

function Block({ block, onUpdate, onAddBlock, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const inputRef = useRef(null)
  const contentEditableRef = useRef(null)

  const blockTypes = [
    { type: 'paragraph', label: 'Text', icon: '📝' },
    { type: 'heading1', label: 'Heading 1', icon: 'H1' },
    { type: 'heading2', label: 'Heading 2', icon: 'H2' },
    { type: 'heading3', label: 'Heading 3', icon: 'H3' },
    { type: 'bulletList', label: 'Bullet List', icon: '•' },
    { type: 'numberList', label: 'Numbered List', icon: '1.' },
    { type: 'todo', label: 'To-do', icon: '☐' },
    { type: 'code', label: 'Code', icon: '</>' },
    { type: 'quote', label: 'Quote', icon: '"' },
    { type: 'divider', label: 'Divider', icon: '—' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'video', label: 'Video', icon: '🎥' },
    { type: 'file', label: 'File', icon: '📎' }
  ]

  useEffect(() => {
    if (block.content === '' && inputRef.current) {
      inputRef.current.focus()
    }
    if (block.content === '' && contentEditableRef.current) {
      contentEditableRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setShowToolbar(false)
        return
      }

      // Check if selection is within this block
      const range = selection.getRangeAt(0)
      const container = contentEditableRef.current
      if (!container || !container.contains(range.commonAncestorContainer)) {
        setShowToolbar(false)
        return
      }

      // Calculate toolbar position
      const rect = range.getBoundingClientRect()
      setToolbarPosition({
        top: rect.top + window.scrollY - 45,
        left: rect.left + window.scrollX + (rect.width / 2) - 150
      })
      setShowToolbar(true)
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  const handleKeyDown = (e) => {
    // Handle formatting shortcuts
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault()
      document.execCommand('bold')
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault()
      document.execCommand('italic')
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault()
      document.execCommand('underline')
      return
    }

    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const newBlockId = onAddBlock(block.id)
      // Focus will be handled by the new block's useEffect
    }

    // Get text content for checking empty state
    const textContent = e.target.textContent || e.target.value || ''

    // Handle Backspace on empty block
    if (e.key === 'Backspace' && textContent === '') {
      e.preventDefault()
      onDelete(block.id)
    }

    // Handle "/" command for block type menu
    if (e.key === '/' && textContent === '') {
      e.preventDefault()
      setShowTypeMenu(true)
    }
  }

  const handleContentChange = (e) => {
    const value = e.target.value
    onUpdate(block.id, { content: value })

    // Check for "/" command
    if (value === '/') {
      setShowTypeMenu(true)
    } else {
      setShowTypeMenu(false)
    }
  }

  const handleContentEditableChange = () => {
    if (!contentEditableRef.current) return

    const html = contentEditableRef.current.innerHTML
    onUpdate(block.id, { content: html })

    // Check for "/" command
    const text = contentEditableRef.current.textContent
    if (text === '/') {
      setShowTypeMenu(true)
    } else {
      setShowTypeMenu(false)
    }
  }

  const changeBlockType = (newType) => {
    onUpdate(block.id, { type: newType, content: block.content.replace('/', '') })
    setShowTypeMenu(false)
    inputRef.current?.focus()
  }

  const toggleTodo = () => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        checked: !block.properties.checked
      }
    })
  }

  const renderInput = () => {
    // Media blocks use custom components
    if (block.type === 'image') {
      return <ImageBlock block={block} onUpdate={onUpdate} />
    }

    if (block.type === 'video') {
      return <VideoBlock block={block} onUpdate={onUpdate} />
    }

    if (block.type === 'file') {
      return <FileBlock block={block} onUpdate={onUpdate} />
    }

    // Divider block
    if (block.type === 'divider') {
      return <div className="divider-block" />
    }

    // Code blocks use plain textarea (no rich text)
    if (block.type === 'code') {
      return (
        <textarea
          ref={inputRef}
          dir="ltr"
          value={block.content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder="Type / for commands"
          className="block-input code"
          rows="3"
        />
      )
    }

    // All other blocks use contentEditable for rich text
    const className = `block-input ${block.type}`

    return (
      <div
        ref={contentEditableRef}
        contentEditable
        dir="ltr"
        suppressContentEditableWarning
        onInput={handleContentEditableChange}
        onKeyDown={handleKeyDown}
        className={className}
        dangerouslySetInnerHTML={{ __html: block.content || '' }}
        data-placeholder={block.content ? '' : 'Type / for commands'}
      />
    )
  }

  const getBlockIcon = () => {
    const type = blockTypes.find(t => t.type === block.type)
    return type?.icon || '📝'
  }

  return (
    <>
      <FormattingToolbar
        show={showToolbar && block.type !== 'code'}
        position={toolbarPosition}
        onFormat={() => {
          // Save changes after formatting
          setTimeout(handleContentEditableChange, 0)
        }}
      />

      <div className={`block-wrapper ${block.type}`}>
        <div className="block-controls">
          <button
            className="block-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FiMoreVertical />
          </button>
          {showMenu && (
            <div className="block-menu">
              <button onClick={() => { onDelete(block.id); setShowMenu(false); }}>
                <FiTrash2 /> Delete
              </button>
              {!isFirst && (
                <button onClick={() => { onMoveUp(block.id); setShowMenu(false); }}>
                  <FiChevronUp /> Move Up
                </button>
              )}
              {!isLast && (
                <button onClick={() => { onMoveDown(block.id); setShowMenu(false); }}>
                  <FiChevronDown /> Move Down
                </button>
              )}
            </div>
          )}
        </div>

        <div className="block-content">
          <div className="block-type-indicator">{getBlockIcon()}</div>

          {block.type === 'bulletList' && <span className="bullet">•</span>}
          {block.type === 'numberList' && <span className="number">1.</span>}
          {block.type === 'todo' && (
            <input
              type="checkbox"
              checked={block.properties?.checked || false}
              onChange={toggleTodo}
              className="todo-checkbox"
            />
          )}

          {renderInput()}
        </div>

        {showTypeMenu && (
          <div className="type-menu">
            {blockTypes.map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => changeBlockType(type)}
                className="type-menu-item"
              >
                <span className="type-icon">{icon}</span>
                <span className="type-label">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Block
