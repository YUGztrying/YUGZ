import { useState, useRef } from 'react'
import { FiImage, FiLink, FiUpload, FiTrash2 } from 'react-icons/fi'
import '../styles/MediaBlocks.css'

function ImageBlock({ block, onUpdate }) {
  const [showUrlInput, setShowUrlInput] = useState(!block.properties?.url && !block.properties?.data)
  const [urlInput, setUrlInput] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const fileInputRef = useRef(null)
  const imageRef = useRef(null)
  const resizeStartRef = useRef({ width: 0, startX: 0 })

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onUpdate(block.id, {
          properties: {
            ...block.properties,
            data: event.target.result,
            name: file.name,
            size: file.size
          }
        })
        setShowUrlInput(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUpdate(block.id, {
        properties: {
          ...block.properties,
          url: urlInput.trim()
        }
      })
      setShowUrlInput(false)
      setUrlInput('')
    }
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault()
        const file = items[i].getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            onUpdate(block.id, {
              properties: {
                ...block.properties,
                data: event.target.result,
                name: file.name || 'pasted-image.png'
              }
            })
            setShowUrlInput(false)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onUpdate(block.id, {
          properties: {
            ...block.properties,
            data: event.target.result,
            name: file.name
          }
        })
        setShowUrlInput(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResizeStart = (e) => {
    e.preventDefault()
    setIsResizing(true)
    resizeStartRef.current = {
      width: imageRef.current?.offsetWidth || 0,
      startX: e.clientX
    }
  }

  const handleResizeMove = (e) => {
    if (!isResizing) return

    const deltaX = e.clientX - resizeStartRef.current.startX
    const newWidth = Math.max(200, Math.min(900, resizeStartRef.current.width + deltaX))

    onUpdate(block.id, {
      properties: {
        ...block.properties,
        width: newWidth
      }
    })
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  const handleCaptionChange = (e) => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        caption: e.target.value
      }
    })
  }

  const handleRemove = () => {
    onUpdate(block.id, {
      properties: {}
    })
    setShowUrlInput(true)
  }

  const imageUrl = block.properties?.data || block.properties?.url

  if (showUrlInput || !imageUrl) {
    return (
      <div className="media-upload-container" onPaste={handlePaste}>
        <div
          className="media-upload-area"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <FiImage className="upload-icon" />
          <h3>Add an image</h3>
          <p>Upload, paste, or use a URL</p>

          <div className="upload-actions">
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload /> Upload
            </button>
            <span className="upload-divider">or</span>
            <div className="url-input-group">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="Paste image URL..."
                className="url-input"
              />
              <button onClick={handleUrlSubmit} className="url-submit-btn">
                <FiLink />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className="media-block-container"
      onMouseMove={handleResizeMove}
      onMouseUp={handleResizeEnd}
      onMouseLeave={handleResizeEnd}
    >
      <div className="media-block-wrapper" style={{ width: block.properties?.width || '100%' }}>
        <div className="media-actions">
          <button onClick={handleRemove} className="media-action-btn" title="Remove">
            <FiTrash2 />
          </button>
        </div>

        <img
          ref={imageRef}
          src={imageUrl}
          alt={block.properties?.caption || 'Image'}
          className="media-image"
          draggable={false}
        />

        <div className="resize-handle" onMouseDown={handleResizeStart}>
          <div className="resize-handle-icon" />
        </div>

        <input
          type="text"
          value={block.properties?.caption || ''}
          onChange={handleCaptionChange}
          placeholder="Add a caption..."
          className="media-caption"
        />
      </div>
    </div>
  )
}

export default ImageBlock
