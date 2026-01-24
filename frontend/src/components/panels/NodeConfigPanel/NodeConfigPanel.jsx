import { useState, useEffect } from 'react'
import './NodeConfigPanel.css'

function NodeConfigPanel({ node, onUpdate, onDelete, onClose }) {
  const [component, setComponent] = useState(null)
  const [config, setConfig] = useState(node.data.configOverrides || {})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComponent()
  }, [node.data.componentId])

  const fetchComponent = async () => {
    try {
      const response = await fetch(`/api/components/${node.data.componentId}`)
      const data = await response.json()
      setComponent(data)
      // Merge default config with overrides
      const defaultConfig = data.config || {}
      setConfig({ ...defaultConfig, ...node.data.configOverrides })
    } catch (error) {
      console.error('Error fetching component:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfigChange = (key, value) => {
    const updatedConfig = { ...config, [key]: value }
    setConfig(updatedConfig)
    onUpdate(node.id, updatedConfig)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      onDelete(node.id)
    }
  }

  if (loading) {
    return (
      <div className="node-config-panel">
        <div className="panel-header">
          <h3>Configuration</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="node-config-panel">
        <div className="panel-header">
          <h3>Configuration</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="error">Component not found</div>
      </div>
    )
  }

  return (
    <div className="node-config-panel">
      <div className="panel-header">
        <h3>{component.name}</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="config-content">
        <div className="config-section">
          <label className="config-label">Component ID</label>
          <div className="config-value">{component.id}</div>
        </div>

        <div className="config-section">
          <label className="config-label">Provider</label>
          <div className="config-value">{component.provider}</div>
        </div>

        <div className="config-section">
          <label className="config-label">Category</label>
          <div className="config-value">{component.category}</div>
        </div>

        {component.description && (
          <div className="config-section">
            <label className="config-label">Description</label>
            <div className="config-description">{component.description}</div>
          </div>
        )}

        <div className="config-divider"></div>

        <div className="config-section">
          <h4 className="config-section-title">Configuration</h4>
        </div>

        {/* API Gateway specific config */}
        {component.id === 'aws-api-gateway' && (
          <div className="config-field">
            <label className="config-label">Requests per Month</label>
            <input
              type="number"
              value={config.requestsPerMonth || 0}
              onChange={(e) => handleConfigChange('requestsPerMonth', parseInt(e.target.value) || 0)}
              className="config-input"
            />
          </div>
        )}

        {/* Lambda specific config */}
        {component.id === 'aws-lambda' && (
          <>
            <div className="config-field">
              <label className="config-label">Requests per Month</label>
              <input
                type="number"
                value={config.requestsPerMonth || 0}
                onChange={(e) => handleConfigChange('requestsPerMonth', parseInt(e.target.value) || 0)}
                className="config-input"
              />
            </div>
            <div className="config-field">
              <label className="config-label">Memory (MB)</label>
              <input
                type="number"
                value={config.memoryMB || 512}
                onChange={(e) => handleConfigChange('memoryMB', parseInt(e.target.value) || 512)}
                className="config-input"
              />
            </div>
            <div className="config-field">
              <label className="config-label">Execution Time (ms)</label>
              <input
                type="number"
                value={config.executionTimeMs || 100}
                onChange={(e) => handleConfigChange('executionTimeMs', parseInt(e.target.value) || 100)}
                className="config-input"
              />
            </div>
          </>
        )}

        {/* EC2 specific config */}
        {component.id === 'aws-ec2' && (
          <>
            <div className="config-field">
              <label className="config-label">Instance Type</label>
              <select
                value={config.instanceType || 't3.micro'}
                onChange={(e) => handleConfigChange('instanceType', e.target.value)}
                className="config-input"
              >
                <option value="t3.micro">t3.micro</option>
                <option value="t3.small">t3.small</option>
                <option value="t3.medium">t3.medium</option>
              </select>
            </div>
            <div className="config-field">
              <label className="config-label">Hours per Month</label>
              <input
                type="number"
                value={config.hoursPerMonth || 730}
                onChange={(e) => handleConfigChange('hoursPerMonth', parseInt(e.target.value) || 730)}
                className="config-input"
              />
            </div>
          </>
        )}

        {/* S3 specific config */}
        {component.id === 'aws-s3' && (
          <>
            <div className="config-field">
              <label className="config-label">Storage (GB)</label>
              <input
                type="number"
                value={config.storageGB || 0}
                onChange={(e) => handleConfigChange('storageGB', parseInt(e.target.value) || 0)}
                className="config-input"
              />
            </div>
            <div className="config-field">
              <label className="config-label">Requests per Month</label>
              <input
                type="number"
                value={config.requestsPerMonth || 0}
                onChange={(e) => handleConfigChange('requestsPerMonth', parseInt(e.target.value) || 0)}
                className="config-input"
              />
            </div>
            <div className="config-field">
              <label className="config-label">Data Transfer (GB)</label>
              <input
                type="number"
                value={config.dataTransferGB || 0}
                onChange={(e) => handleConfigChange('dataTransferGB', parseInt(e.target.value) || 0)}
                className="config-input"
              />
            </div>
          </>
        )}

        {/* RDS specific config */}
        {component.id === 'aws-rds' && (
          <>
            <div className="config-field">
              <label className="config-label">Instance Type</label>
              <select
                value={config.instanceType || 'db.t3.micro'}
                onChange={(e) => handleConfigChange('instanceType', e.target.value)}
                className="config-input"
              >
                <option value="db.t3.micro">db.t3.micro</option>
                <option value="db.t3.small">db.t3.small</option>
              </select>
            </div>
            <div className="config-field">
              <label className="config-label">Storage (GB)</label>
              <input
                type="number"
                value={config.storageGB || 20}
                onChange={(e) => handleConfigChange('storageGB', parseInt(e.target.value) || 20)}
                className="config-input"
              />
            </div>
            <div className="config-field">
              <label className="config-label">Hours per Month</label>
              <input
                type="number"
                value={config.hoursPerMonth || 730}
                onChange={(e) => handleConfigChange('hoursPerMonth', parseInt(e.target.value) || 730)}
                className="config-input"
              />
            </div>
          </>
        )}

        <div className="config-divider"></div>

        <button onClick={handleDelete} className="btn-danger">
          Delete Component
        </button>
      </div>
    </div>
  )
}

export default NodeConfigPanel
