import { useState, useEffect, useRef } from 'react'
import {
  FiBold, FiItalic, FiUnderline, FiLink, FiCode
} from 'react-icons/fi'
import {
  MdFormatStrikethrough, MdFormatColorText, MdFormatColorFill
} from 'react-icons/md'
import '../styles/FormattingToolbar.css'

function FormattingToolbar({ show, position, onFormat }) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const toolbarRef = useRef(null)

  const colors = [
    { name: 'Default', value: '#ffffff' },
    { name: 'Gray', value: '#9b9b9b' },
    { name: 'Red', value: '#ff6b6b' },
    { name: 'Orange', value: '#ffa500' },
    { name: 'Yellow', value: '#ffd43b' },
    { name: 'Green', value: '#51cf66' },
    { name: 'Blue', value: '#4a9eff' },
    { name: 'Purple', value: '#9775fa' },
    { name: 'Pink', value: '#f06595' }
  ]

  const highlights = [
    { name: 'Default', value: 'transparent' },
    { name: 'Gray', value: '#3d3d3d' },
    { name: 'Red', value: '#4a2020' },
    { name: 'Orange', value: '#4a3520' },
    { name: 'Yellow', value: '#4a4220' },
    { name: 'Green', value: '#204a2e' },
    { name: 'Blue', value: '#20344a' },
    { name: 'Purple', value: '#38204a' },
    { name: 'Pink', value: '#4a2038' }
  ]

  useEffect(() => {
    if (!show) {
      setShowColorPicker(false)
      setShowHighlightPicker(false)
      setShowLinkInput(false)
    }
  }, [show])

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value)
    onFormat()
  }

  const handleLink = () => {
    if (showLinkInput && linkUrl) {
      handleFormat('createLink', linkUrl)
      setShowLinkInput(false)
      setLinkUrl('')
    } else {
      setShowLinkInput(true)
    }
  }

  const handleColorClick = (color) => {
    handleFormat('foreColor', color)
    setShowColorPicker(false)
  }

  const handleHighlightClick = (color) => {
    handleFormat('hiliteColor', color)
    setShowHighlightPicker(false)
  }

  if (!show) return null

  return (
    <div
      ref={toolbarRef}
      className="formatting-toolbar"
      style={{
        top: position.top,
        left: position.left
      }}
    >
      <button
        className="format-btn"
        onClick={() => handleFormat('bold')}
        title="Bold (Ctrl+B)"
      >
        <FiBold />
      </button>

      <button
        className="format-btn"
        onClick={() => handleFormat('italic')}
        title="Italic (Ctrl+I)"
      >
        <FiItalic />
      </button>

      <button
        className="format-btn"
        onClick={() => handleFormat('underline')}
        title="Underline (Ctrl+U)"
      >
        <FiUnderline />
      </button>

      <button
        className="format-btn"
        onClick={() => handleFormat('strikeThrough')}
        title="Strikethrough"
      >
        <MdFormatStrikethrough />
      </button>

      <div className="toolbar-divider" />

      <button
        className="format-btn"
        onClick={() => {
          const selection = window.getSelection()
          const text = selection.toString()
          handleFormat('insertHTML', `<code>${text}</code>`)
        }}
        title="Inline Code"
      >
        <FiCode />
      </button>

      <div className="toolbar-divider" />

      <div className="color-picker-wrapper">
        <button
          className="format-btn"
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Text Color"
        >
          <MdFormatColorText />
        </button>
        {showColorPicker && (
          <div className="color-picker">
            {colors.map(color => (
              <button
                key={color.name}
                className="color-option"
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorClick(color.value)}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      <div className="color-picker-wrapper">
        <button
          className="format-btn"
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          title="Highlight"
        >
          <MdFormatColorFill />
        </button>
        {showHighlightPicker && (
          <div className="color-picker">
            {highlights.map(highlight => (
              <button
                key={highlight.name}
                className="color-option"
                style={{ backgroundColor: highlight.value }}
                onClick={() => handleHighlightClick(highlight.value)}
                title={highlight.name}
              />
            ))}
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="link-wrapper">
        <button
          className="format-btn"
          onClick={handleLink}
          title="Link (Ctrl+K)"
        >
          <FiLink />
        </button>
        {showLinkInput && (
          <div className="link-input-wrapper">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Paste or type a link"
              className="link-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleLink()
                }
              }}
            />
            <button className="link-btn" onClick={handleLink}>
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormattingToolbar
