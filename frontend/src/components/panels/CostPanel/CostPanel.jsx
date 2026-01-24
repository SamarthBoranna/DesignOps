import { useState, useEffect } from 'react'
import './CostPanel.css'

function CostPanel({ nodes }) {
  const [costData, setCostData] = useState({ total_cost: 0, breakdown: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      calculateCost()
    } else {
      setCostData({ total_cost: 0, breakdown: [] })
    }
  }, [nodes])

  const calculateCost = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cost/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes })
      })
      const data = await response.json()
      setCostData(data)
    } catch (error) {
      console.error('Error calculating cost:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCostByCategory = () => {
    const categories = {}
    costData.breakdown?.forEach(item => {
      // This is simplified - in a real app, you'd map component IDs to categories
      const category = 'Compute' // Default category
      categories[category] = (categories[category] || 0) + item.cost
    })
    return categories
  }

  return (
    <div className="cost-panel">
      <div className="cost-header">
        <div className="cost-header-content">
          <div className="cost-icon">💰</div>
          <span>Cost Breakdown</span>
        </div>
      </div>
      
      <div className="cost-content">
        {loading ? (
          <div className="loading">Calculating...</div>
        ) : (
          <>
            <div className="total-cost-section">
              <div className="total-cost-label">Estimated Monthly Cost</div>
              <div className="total-cost-value">
                ${costData.total_cost?.toFixed(2) || '0.00'}
              </div>
              <div className="total-cost-period">per month</div>
            </div>

            <div className="cost-categories">
              <h3 className="cost-categories-title">Cost by Category</h3>
              {costData.breakdown && costData.breakdown.length > 0 ? (
                <div className="cost-breakdown-list">
                  {Object.entries(getCostByCategory()).map(([category, cost]) => (
                    <div key={category} className="cost-category-item">
                      <span className="category-name">{category}</span>
                      <span className="category-cost">${cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">No components added yet</div>
              )}
            </div>

            {costData.breakdown && costData.breakdown.length > 0 && (
              <div className="detailed-breakdown">
                <h3 className="breakdown-title">Component Breakdown</h3>
                {costData.breakdown.map((item, index) => (
                  <div key={index} className="breakdown-item">
                    <div className="breakdown-name">{item.componentName}</div>
                    <div className="breakdown-cost">${item.cost.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CostPanel
