import { useState, useRef } from 'react'
import { FiImage, FiUpload } from 'react-icons/fi'
import InstagramAutomation from './InstagramAutomation'
import '../styles/CustomBlocks.css'
import '../styles/InstagramAutomation.css'

function InstagramPostBlock({ block, onUpdate }) {
  const [imagePreview, setImagePreview] = useState(block.properties?.image || '')
  const fileInputRef = useRef(null)

  const handleCaptionChange = (e) => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        caption: e.target.value
      }
    })
  }

  const handleHashtagsChange = (e) => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        hashtags: e.target.value
      }
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result
      setImagePreview(imageUrl)
      onUpdate(block.id, {
        properties: {
          ...block.properties,
          image: imageUrl
        }
      })
    }
    reader.readAsDataURL(file)
  }

  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setImagePreview(url)
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        image: url
      }
    })
  }

  return (
    <div className="instagram-post-block">
      <div className="ig-post-header">
        <span className="ig-post-icon">📱</span>
        <span className="ig-post-title">Instagram Post</span>
      </div>

      <div className="ig-post-content">
        {/* Image Section */}
        <div className="ig-image-section">
          {imagePreview ? (
            <div className="ig-image-preview">
              <img src={imagePreview} alt="Post preview" />
              <button 
                className="ig-change-image"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="ig-image-upload">
              <button
                className="ig-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiImage size={24} />
                <span>Add Image</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="ig-url-input">
                <input
                  type="text"
                  placeholder="Or paste image URL"
                  onChange={handleImageUrlChange}
                  className="ig-url-field"
                />
              </div>
            </div>
          )}
        </div>

        {/* Caption Section */}
        <div className="ig-caption-section">
          <label className="ig-label">Caption</label>
          <textarea
            value={block.properties?.caption || ''}
            onChange={handleCaptionChange}
            placeholder="Write your caption here..."
            className="ig-caption-input"
            rows="4"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
          <div className="ig-caption-count">
            {(block.properties?.caption || '').length} characters
          </div>
        </div>

        {/* Hashtags Section */}
        <div className="ig-hashtags-section">
          <label className="ig-label">Hashtags</label>
          <input
            type="text"
            value={block.properties?.hashtags || ''}
            onChange={handleHashtagsChange}
            placeholder="#ai #automation #tech"
            className="ig-hashtags-input"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
        </div>

        {/* Status Badge */}
        <div className="ig-status">
          <span className="ig-status-badge">
            {block.properties?.status === 'scheduled' ? '📅 Scheduled' : '📝 Draft'}
          </span>
        </div>

        {/* Automation Tools */}
        <InstagramAutomation block={block} onUpdate={onUpdate} />
      </div>
    </div>
  )
}

export default InstagramPostBlock
