import { useState } from 'react'
import '../styles/CustomBlocks.css'

function ProjectTrackerBlock({ block, onUpdate }) {
  const statuses = [
    { value: 'active', label: 'Active', color: '#4a9eff', emoji: '🚀' },
    { value: 'blocked', label: 'Blocked', color: '#ff4a4a', emoji: '🚧' },
    { value: 'done', label: 'Done', color: '#4aff4a', emoji: '✅' },
    { value: 'planning', label: 'Planning', color: '#ffa500', emoji: '💭' }
  ]

  const currentStatus = block.properties?.status || 'planning'
  const statusData = statuses.find(s => s.value === currentStatus) || statuses[0]

  const handleProjectNameChange = (e) => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        projectName: e.target.value
      }
    })
  }

  const handleStatusChange = (newStatus) => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        status: newStatus
      }
    })
  }

  const handleNextActionChange = (e) => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        nextAction: e.target.value
      }
    })
  }

  const handleNotesChange = (e) => {
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        notes: e.target.value
      }
    })
  }

  return (
    <div className="project-tracker-block">
      <div className="project-header">
        <span className="project-icon">🎯</span>
        <input
          type="text"
          value={block.properties?.projectName || ''}
          onChange={handleProjectNameChange}
          placeholder="Project Name"
          className="project-name-input"
          dir="ltr"
          style={{ direction: 'ltr', textAlign: 'left' }}
        />
      </div>

      <div className="project-content">
        {/* Status Selector */}
        <div className="project-field">
          <label className="project-label">Status</label>
          <div className="project-status-selector">
            {statuses.map(status => (
              <button
                key={status.value}
                className={`status-option ${currentStatus === status.value ? 'active' : ''}`}
                style={{
                  borderColor: currentStatus === status.value ? status.color : 'transparent',
                  background: currentStatus === status.value ? `${status.color}20` : 'transparent'
                }}
                onClick={() => handleStatusChange(status.value)}
              >
                <span className="status-emoji">{status.emoji}</span>
                <span className="status-label">{status.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Next Action */}
        <div className="project-field">
          <label className="project-label">Next Action</label>
          <input
            type="text"
            value={block.properties?.nextAction || ''}
            onChange={handleNextActionChange}
            placeholder="What's the immediate next step?"
            className="project-input"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
        </div>

        {/* Notes */}
        <div className="project-field">
          <label className="project-label">Notes</label>
          <textarea
            value={block.properties?.notes || ''}
            onChange={handleNotesChange}
            placeholder="Additional context, blockers, updates..."
            className="project-notes"
            rows="3"
            dir="ltr"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
        </div>

        {/* Status Badge at Bottom */}
        <div className="project-footer">
          <div 
            className="project-status-badge"
            style={{ 
              backgroundColor: `${statusData.color}20`,
              borderColor: statusData.color,
              color: statusData.color
            }}
          >
            {statusData.emoji} {statusData.label}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectTrackerBlock
