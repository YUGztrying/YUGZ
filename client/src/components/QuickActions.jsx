import { useState } from 'react'
import { FiZap, FiFileText, FiInstagram, FiTarget, FiBarChart, FiCopy, FiDownload } from 'react-icons/fi'
import '../styles/QuickActions.css'

function QuickActions({ onAction }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const actions = [
    { icon: FiFileText, label: 'New Page', action: 'newPage', color: '#4a9eff', shortcut: 'Ctrl+N' },
    { icon: FiInstagram, label: 'New IG Post', action: 'newInstagram', color: '#ff6b6b', shortcut: 'Ctrl+I' },
    { icon: FiTarget, label: 'New Project', action: 'newProject', color: '#ffa500', shortcut: 'Ctrl+P' },
    { icon: FiBarChart, label: 'Analytics', action: 'analytics', color: '#4aff9e', shortcut: 'Ctrl+A' },
    { icon: FiCopy, label: 'Export JSON', action: 'export', color: '#8a2be2', shortcut: '' },
    { icon: FiDownload, label: 'Backup', action: 'backup', color: '#ff4a9e', shortcut: '' }
  ]

  return (
    <>
      <button 
        className="quick-actions-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
        title="Quick Actions"
      >
        <FiZap size={20} />
      </button>

      {isExpanded && (
        <>
          <div 
            className="quick-actions-overlay"
            onClick={() => setIsExpanded(false)}
          />
          <div className="quick-actions-panel">
            <div className="quick-actions-header">
              <FiZap className="qa-header-icon" />
              <h3>Quick Actions</h3>
            </div>

            <div className="quick-actions-grid">
              {actions.map(action => (
                <button
                  key={action.action}
                  className="quick-action-btn"
                  onClick={() => {
                    onAction(action.action)
                    setIsExpanded(false)
                  }}
                  style={{ '--action-color': action.color }}
                >
                  <action.icon size={20} className="qa-icon" />
                  <span className="qa-label">{action.label}</span>
                  {action.shortcut && (
                    <span className="qa-shortcut">{action.shortcut}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="keyboard-shortcuts">
              <h4 className="shortcuts-title">⌨️ Keyboard Shortcuts</h4>
              <div className="shortcuts-list">
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl/Cmd + K</span>
                  <span className="shortcut-desc">Search</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">/</span>
                  <span className="shortcut-desc">Block Menu</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl/Cmd + B</span>
                  <span className="shortcut-desc">Bold Text</span>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-key">Ctrl/Cmd + I</span>
                  <span className="shortcut-desc">Italic Text</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default QuickActions
