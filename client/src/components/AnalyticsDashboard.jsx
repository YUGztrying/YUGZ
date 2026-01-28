import { useMemo } from 'react'
import { FiTrendingUp, FiCheckCircle, FiClock, FiZap } from 'react-icons/fi'
import '../styles/AnalyticsDashboard.css'

function AnalyticsDashboard({ pages }) {
  const analytics = useMemo(() => {
    let totalBlocks = 0
    let instagramPosts = 0
    let scheduledPosts = 0
    let projects = 0
    let activeProjects = 0
    let completedProjects = 0
    let blockedProjects = 0

    pages.forEach(page => {
      totalBlocks += page.blocks.length

      page.blocks.forEach(block => {
        if (block.type === 'instagram') {
          instagramPosts++
          if (block.properties?.status === 'scheduled') {
            scheduledPosts++
          }
        }
        if (block.type === 'project') {
          projects++
          if (block.properties?.status === 'active') activeProjects++
          if (block.properties?.status === 'done') completedProjects++
          if (block.properties?.status === 'blocked') blockedProjects++
        }
      })
    })

    return {
      totalPages: pages.length,
      totalBlocks,
      instagramPosts,
      scheduledPosts,
      projects,
      activeProjects,
      completedProjects,
      blockedProjects
    }
  }, [pages])

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="stat-card" style={{ borderColor: `${color}40` }}>
      <div className="stat-header">
        <Icon size={20} style={{ color }} />
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {trend && (
        <div className="stat-trend" style={{ color: `${color}80` }}>
          <FiTrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
  )

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <FiZap className="dashboard-icon" />
          Analytics Dashboard
        </h2>
        <p className="dashboard-subtitle">Track your productivity and content strategy</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={FiCheckCircle}
          label="Total Pages"
          value={analytics.totalPages}
          color="#4a9eff"
          trend="Active workspace"
        />
        
        <StatCard
          icon={FiZap}
          label="Total Blocks"
          value={analytics.totalBlocks}
          color="#ffa500"
          trend="Content pieces"
        />

        <StatCard
          icon={FiTrendingUp}
          label="Instagram Posts"
          value={analytics.instagramPosts}
          color="#ff6b6b"
          trend={`${analytics.scheduledPosts} scheduled`}
        />

        <StatCard
          icon={FiClock}
          label="Active Projects"
          value={analytics.activeProjects}
          color="#4aff4a"
          trend={`${analytics.projects} total`}
        />
      </div>

      <div className="project-breakdown">
        <h3 className="breakdown-title">Project Status</h3>
        <div className="breakdown-bars">
          <div className="breakdown-item">
            <span className="breakdown-label">🚀 Active</span>
            <div className="breakdown-bar-container">
              <div 
                className="breakdown-bar" 
                style={{ 
                  width: `${(analytics.activeProjects / Math.max(analytics.projects, 1)) * 100}%`,
                  background: '#4aff4a'
                }}
              />
            </div>
            <span className="breakdown-count">{analytics.activeProjects}</span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-label">✅ Completed</span>
            <div className="breakdown-bar-container">
              <div 
                className="breakdown-bar" 
                style={{ 
                  width: `${(analytics.completedProjects / Math.max(analytics.projects, 1)) * 100}%`,
                  background: '#4a9eff'
                }}
              />
            </div>
            <span className="breakdown-count">{analytics.completedProjects}</span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-label">🚧 Blocked</span>
            <div className="breakdown-bar-container">
              <div 
                className="breakdown-bar" 
                style={{ 
                  width: `${(analytics.blockedProjects / Math.max(analytics.projects, 1)) * 100}%`,
                  background: '#ff4a4a'
                }}
              />
            </div>
            <span className="breakdown-count">{analytics.blockedProjects}</span>
          </div>
        </div>
      </div>

      <div className="quick-insights">
        <h3 className="insights-title">💡 Quick Insights</h3>
        <ul className="insights-list">
          {analytics.blockedProjects > 0 && (
            <li className="insight-item warning">
              ⚠️ You have {analytics.blockedProjects} blocked project{analytics.blockedProjects !== 1 ? 's' : ''} - consider unblocking or pivoting
            </li>
          )}
          {analytics.scheduledPosts > 0 && (
            <li className="insight-item success">
              ✨ {analytics.scheduledPosts} Instagram post{analytics.scheduledPosts !== 1 ? 's' : ''} scheduled - content pipeline looking good!
            </li>
          )}
          {analytics.activeProjects === 0 && analytics.projects > 0 && (
            <li className="insight-item info">
              💭 No active projects - time to kickstart something from your planning list?
            </li>
          )}
          {analytics.instagramPosts < 5 && (
            <li className="insight-item info">
              📱 Consider creating more Instagram drafts to maintain consistent posting
            </li>
          )}
          {analytics.completedProjects > 0 && (
            <li className="insight-item success">
              🎉 {analytics.completedProjects} project{analytics.completedProjects !== 1 ? 's' : ''} completed - keep the momentum!
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
