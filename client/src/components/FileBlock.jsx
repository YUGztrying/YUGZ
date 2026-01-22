import { useState, useRef } from 'react'
import { FiFile, FiUpload, FiDownload, FiTrash2, FiFileText, FiImage } from 'react-icons/fi'
import '../styles/MediaBlocks.css'

function FileBlock({ block, onUpdate }) {
  const [showUpload, setShowUpload] = useState(!block.properties?.data)
  const fileInputRef = useRef(null)

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return <FiImage />
    if (type?.includes('pdf')) return <FiFileText />
    return <FiFile />
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Limit file size to 10MB for localStorage
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        onUpdate(block.id, {
          properties: {
            ...block.properties,
            data: event.target.result,
            name: file.name,
            size: file.size,
            type: file.type
          }
        })
        setShowUpload(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        onUpdate(block.id, {
          properties: {
            ...block.properties,
            data: event.target.result,
            name: file.name,
            size: file.size,
            type: file.type
          }
        })
        setShowUpload(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = () => {
    if (block.properties?.data) {
      const link = document.createElement('a')
      link.href = block.properties.data
      link.download = block.properties.name || 'file'
      link.click()
    }
  }

  const handleRemove = () => {
    onUpdate(block.id, {
      properties: {}
    })
    setShowUpload(true)
  }

  if (showUpload || !block.properties?.data) {
    return (
      <div className="media-upload-container">
        <div
          className="media-upload-area"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <FiFile className="upload-icon" />
          <h3>Upload a file</h3>
          <p>PDFs, documents, or any file (max 10MB)</p>

          <button
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUpload /> Choose File
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="media-block-container">
      <div className="file-block-wrapper">
        <div className="file-info">
          <div className="file-icon">
            {getFileIcon(block.properties.type)}
          </div>
          <div className="file-details">
            <div className="file-name">{block.properties.name}</div>
            <div className="file-meta">
              {formatFileSize(block.properties.size)}
            </div>
          </div>
        </div>

        <div className="file-actions">
          <button onClick={handleDownload} className="file-action-btn" title="Download">
            <FiDownload />
          </button>
          <button onClick={handleRemove} className="file-action-btn" title="Remove">
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileBlock
