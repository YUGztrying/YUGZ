import { useState } from 'react'
import { FiZap, FiCalendar, FiClock, FiCheck, FiCopy, FiTrendingUp } from 'react-icons/fi'
import '../styles/InstagramAutomation.css'

function InstagramAutomation({ block, onUpdate }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  // AI Caption Generator (simulated - can integrate with OpenAI later)
  const generateCaption = async () => {
    setIsGenerating(true)
    
    // Simulated AI generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const templates = [
      "🚀 Leveling up with AI automation! Here's what I've been building...\n\nThe future is now, and it's powered by intelligent systems that work while you sleep. 💭",
      "💡 Hot take on AI automation:\n\nIt's not about replacing humans—it's about amplifying what we can achieve. Building tools that make us 10x more productive.\n\n#TechThoughts",
      "🔥 Just deployed something wild...\n\nWhen automation meets creativity, magic happens. This is what I'm working on at the World Bank and beyond.",
      "✨ Building in public: Day [X]\n\nHere's the behind-the-scenes of creating AI-powered tools that actually solve real problems. Progress over perfection.",
      "🎯 Focus: Automation + Impact\n\nEvery line of code should solve a real problem. Here's how I'm thinking about tech that matters."
    ]
    
    const randomCaption = templates[Math.floor(Math.random() * templates.length)]
    
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        caption: randomCaption
      }
    })
    
    setIsGenerating(false)
  }

  // Smart Hashtag Suggestions
  const suggestHashtags = () => {
    const hashtagSets = [
      '#ai #automation #tech #coding #developer #worldbank #innovation #machinelearning',
      '#webdev #javascript #react #nodejs #fullstack #programming #code #techlife',
      '#startup #entrepreneur #productivity #hustle #grind #mindset #motivation',
      '#artificialintelligence #technology #innovation #futureofwork #digital #automation',
      '#developer #coding #programming #software #tech #ai #ml #innovation'
    ]
    
    const suggested = hashtagSets[Math.floor(Math.random() * hashtagSets.length)]
    onUpdate(block.id, {
      properties: {
        ...block.properties,
        hashtags: suggested
      }
    })
  }

  const schedulePost = () => {
    if (scheduledDate && scheduledTime) {
      const scheduleTimestamp = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      onUpdate(block.id, {
        properties: {
          ...block.properties,
          scheduledFor: scheduleTimestamp,
          status: 'scheduled'
        }
      })
      setShowScheduler(false)
      alert(`Post scheduled for ${new Date(scheduleTimestamp).toLocaleString()}`)
    }
  }

  const copyToClipboard = () => {
    const caption = block.properties?.caption || ''
    const hashtags = block.properties?.hashtags || ''
    const fullText = `${caption}\n\n${hashtags}`
    navigator.clipboard.writeText(fullText)
    alert('✅ Copied to clipboard!')
  }

  return (
    <div className="ig-automation-panel">
      <div className="automation-header">
        <FiZap className="automation-icon" />
        <span>Automation Tools</span>
      </div>

      <div className="automation-actions">
        <button 
          className="automation-btn generate-btn"
          onClick={generateCaption}
          disabled={isGenerating}
        >
          <FiZap size={16} />
          {isGenerating ? 'Generating...' : 'AI Caption'}
        </button>

        <button 
          className="automation-btn hashtag-btn"
          onClick={suggestHashtags}
        >
          <FiTrendingUp size={16} />
          Smart Hashtags
        </button>

        <button 
          className="automation-btn schedule-btn"
          onClick={() => setShowScheduler(!showScheduler)}
        >
          <FiCalendar size={16} />
          Schedule
        </button>

        <button 
          className="automation-btn copy-btn"
          onClick={copyToClipboard}
        >
          <FiCopy size={16} />
          Copy All
        </button>
      </div>

      {showScheduler && (
        <div className="scheduler-panel">
          <div className="scheduler-inputs">
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="schedule-input"
              min={new Date().toISOString().split('T')[0]}
            />
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="schedule-input"
            />
          </div>
          <button 
            className="schedule-confirm-btn"
            onClick={schedulePost}
            disabled={!scheduledDate || !scheduledTime}
          >
            <FiCheck size={16} />
            Confirm Schedule
          </button>
        </div>
      )}

      {block.properties?.scheduledFor && (
        <div className="scheduled-badge">
          <FiClock size={14} />
          Scheduled for {new Date(block.properties.scheduledFor).toLocaleString()}
        </div>
      )}
    </div>
  )
}

export default InstagramAutomation
