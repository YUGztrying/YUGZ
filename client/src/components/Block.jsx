import { useState, useRef, useEffect } from 'react'
import { FiMoreVertical, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import '../styles/Block.css'

function Block({ block, onUpdate, onAddBlock, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const inputRef = useRef(null)

  const blockTypes = [
    { type: 'paragraph', label: 'Text', icon: '📝' },
    { type: 'heading1', label: 'Heading 1', icon: 'H1' },
    { type: 'heading2', label: 'Heading 2', icon: 'H2' },
    { type: 'heading3', label: 'Heading 3', icon: 'H3' },
    { type: 'bulletList', label: 'Bullet List', icon: '•' },
    { type: 'numberList', label: 'Numbered List', icon: '1.' },
    { type: 'todo', label: 'To-do', icon: '☐' },
    { type: 'code', label: 'Code', icon: '</>' },
    { type: 'quote', label: 'Quote', icon: '"' }
  ]

  useEffect(() => {
    if (block.content === '' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e) => {
    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const newBlockId = onAddBlock(block.id)
      // Focus will be handled by the new block's useEffect
    }

    // Handle Backspace on empty block
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault()
      onDelete(block.id)
    }

    // Handle "/" command for block type menu
    if (e.key === '/' && block.content === '') {
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
    const commonProps = {
      ref: inputRef,
      value: block.content,
      onChange: handleContentChange,
      onKeyDown: handleKeyDown,
      placeholder: 'Type / for commands'
    }

    switch (block.type) {
      case 'heading1':
        return <input {...commonProps} className="block-input heading1" />
      case 'heading2':
        return <input {...commonProps} className="block-input heading2" />
      case 'heading3':
        return <input {...commonProps} className="block-input heading3" />
      case 'code':
        return <textarea {...commonProps} className="block-input code" rows="3" />
      case 'quote':
        return <textarea {...commonProps} className="block-input quote" rows="2" />
      default:
        return <input {...commonProps} className="block-input paragraph" />
    }
  }

  const getBlockIcon = () => {
    const type = blockTypes.find(t => t.type === block.type)
    return type?.icon || '📝'
  }

  return (
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
  )
}

export default Block
