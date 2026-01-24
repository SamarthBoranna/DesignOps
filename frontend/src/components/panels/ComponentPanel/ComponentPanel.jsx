import { useState, useEffect } from 'react'
import './ComponentPanel.css'

const CATEGORIES = ['All', 'API', 'Compute', 'Database', 'Storage', 'Networking']

function ComponentPanel({ onComponentSelect }) {
  const [components, setComponents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComponents()
  }, [])

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/components')
      const data = await response.json()
      setComponents(data.components || [])
    } catch (error) {
      console.error('Error fetching components:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryForComponent = (component) => {
    const categoryMap = {
      'Networking': 'Networking',
      'Compute': 'Compute',
      'Database': 'Database',
      'Storage': 'Storage',
    }
    return categoryMap[component.category] || 'Compute'
  }

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(component))
    e.dataTransfer.effectAllowed = 'move'
  }

  const getCategoryLabel = (category) => {
    const map = {
      'Networking': 'Networking',
      'Compute': 'Compute',
      'Database': 'Database',
      'Storage': 'Storage',
    }
    return map[category] || category
  }

  const filteredComponents = components.filter(comp => {
    const categoryMatch = selectedCategory === 'All' || getCategoryForComponent(comp) === selectedCategory
    const searchMatch = !searchQuery || 
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && searchMatch
  })

  const getComponentSpecs = (component) => {
    if (component.id === 'aws-ec2') {
      const instanceType = component.config?.instanceType || 't3.micro'
      const specs = {
        't3.micro': '2 vCPU, 1GB RAM',
        't3.small': '2 vCPU, 2GB RAM',
        't3.medium': '2 vCPU, 4GB RAM',
      }
      return specs[instanceType] || '2 vCPU, 1GB RAM'
    }
    if (component.id === 'aws-lambda') {
      return 'Serverless functions'
    }
    if (component.id === 'aws-rds') {
      return 'Managed database'
    }
    if (component.id === 'aws-s3') {
      return 'Object storage'
    }
    if (component.id === 'aws-api-gateway') {
      return 'API management'
    }
    return component.description || 'Cloud component'
  }

  const getEstimatedCost = (component) => {
    // Calculate estimated cost based on default config
    const config = component.config || {}
    const pricing = component.pricing || {}
    
    if (component.id === 'aws-api-gateway') {
      const requests = config.requestsPerMonth || 1000000
      return `$${((requests / 1000000) * pricing.perMillionRequests).toFixed(0)}/mo`
    }
    if (component.id === 'aws-lambda') {
      return '$50/mo'
    }
    if (component.id === 'aws-ec2') {
      const instanceType = config.instanceType || 't3.micro'
      const hours = config.hoursPerMonth || 730
      const hourlyRate = pricing[instanceType] || 0.0104
      return `$${Math.round(hours * hourlyRate)}/mo`
    }
    if (component.id === 'aws-s3') {
      return '$25/mo'
    }
    if (component.id === 'aws-rds') {
      const instanceType = config.instanceType || 'db.t3.micro'
      const hours = config.hoursPerMonth || 730
      const hourlyRate = pricing[instanceType] || 0.017
      return `$${Math.round(hours * hourlyRate)}/mo`
    }
    return '$0/mo'
  }

  const getCategorySearchPlaceholder = () => {
    if (selectedCategory === 'All') return 'Search components...'
    return `Search ${selectedCategory}...`
  }

  return (
    <div className="component-panel">
      <div className="panel-header">
        <h2>Components</h2>
      </div>
      
      <div className="category-tabs">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="panel-search">
        <input
          type="text"
          placeholder={getCategorySearchPlaceholder()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="components-list">
        {loading ? (
          <div className="loading">Loading components...</div>
        ) : filteredComponents.length === 0 ? (
          <div className="empty">No components found</div>
        ) : (
          filteredComponents.map(component => (
            <div
              key={component.id}
              className="component-card"
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => onComponentSelect && onComponentSelect(component)}
            >
              <div className="component-icon-wrapper">
                <div className="component-icon">{component.icon || '📦'}</div>
              </div>
              <div className="component-details">
                <div className="component-name">{component.name}</div>
                <div className="component-specs">{getComponentSpecs(component)}</div>
                <div className="component-cost">{getEstimatedCost(component)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ComponentPanel
