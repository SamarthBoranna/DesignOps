import { useState } from 'react'
import CostPanel from '../CostPanel/CostPanel'
import AIPanel from '../AIPanel/AIPanel'
import './RightSidebar.css'

function RightSidebar({ nodes }) {
  const [activeTab, setActiveTab] = useState('costs')

  return (
    <div className="right-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === 'costs' ? 'active' : ''}`}
          onClick={() => setActiveTab('costs')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1L10.5 6H15L11 9.5L13.5 15L8 11.5L2.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor"/>
          </svg>
          <span>Costs</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8C14 4.69 11.31 2 8 2ZM8 12.5C5.52 12.5 3.5 10.48 3.5 8C3.5 5.52 5.52 3.5 8 3.5C10.48 3.5 12.5 5.52 12.5 8C12.5 10.48 10.48 12.5 8 12.5ZM7 9.5H9V11H7V9.5ZM7 5H9V8H7V5Z" fill="currentColor"/>
          </svg>
          <span>AI Assistant</span>
        </button>
      </div>
      <div className="sidebar-content">
        {activeTab === 'costs' && <CostPanel nodes={nodes} />}
        {activeTab === 'ai' && <AIPanel />}
      </div>
    </div>
  )
}

export default RightSidebar
