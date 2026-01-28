import { useState } from 'react'
import { FiVideo, FiTrash2 } from 'react-icons/fi'
import '../styles/MediaBlocks.css'

function VideoBlock({ block, onUpdate }) {
  const [urlInput, setUrlInput] = useState('')
  const [showInput, setShowInput] = useState(!block.properties?.embedUrl)

  const parseVideoUrl = (url) => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
        id: youtubeMatch[1]
      }
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
        id: vimeoMatch[1]
      }
    }

    // Loom
    const loomRegex = /loom\.com\/share\/([a-zA-Z0-9]+)/
    const loomMatch = url.match(loomRegex)
    if (loomMatch) {
      return {
        type: 'loom',
        embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
        id: loomMatch[1]
      }
    }

    return null
  }

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return

    const videoData = parseVideoUrl(urlInput)
    if (videoData) {
      onUpdate(block.id, {
        properties: {
          ...block.properties,
          ...videoData,
          originalUrl: urlInput
        }
      })
      setShowInput(false)
      setUrlInput('')
    } else {
      alert('Please enter a valid YouTube, Vimeo, or Loom URL')
    }
  }

  const handleRemove = () => {
    onUpdate(block.id, {
      properties: {}
    })
    setShowInput(true)
  }

  const handleCaptionChange = (e) => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        caption: e.target.value
      }
    })
  }

  if (showInput || !block.properties?.embedUrl) {
    return (
      <div className="media-upload-container">
        <div className="media-upload-area">
          <FiVideo className="upload-icon" />
          <h3>Embed a video</h3>
          <p>YouTube, Vimeo, or Loom</p>

          <div className="url-input-group">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              placeholder="Paste video URL..."
              className="url-input"
              autoFocus
              dir="ltr"
              lang="en"
              style={{
                direction: 'ltr',
                textAlign: 'left'
              }}
            />
            <button onClick={handleUrlSubmit} className="url-submit-btn">
              Embed
            </button>
          </div>

          <div className="url-examples">
            <small>Examples:</small>
            <small>• youtube.com/watch?v=...</small>
            <small>• vimeo.com/...</small>
            <small>• loom.com/share/...</small>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="media-block-container">
      <div className="media-block-wrapper">
        <div className="media-actions">
          <button onClick={handleRemove} className="media-action-btn" title="Remove">
            <FiTrash2 />
          </button>
        </div>

        <div className="video-wrapper">
          <iframe
            src={block.properties.embedUrl}
            title={block.properties.caption || 'Video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-embed"
          />
        </div>

        <input
          type="text"
          value={block.properties?.caption || ''}
          onChange={handleCaptionChange}
          placeholder="Add a caption..."
          className="media-caption"
          dir="ltr"
          lang="en"
          style={{
            direction: 'ltr',
            textAlign: 'left'
          }}
        />
      </div>
    </div>
  )
}

export default VideoBlock
