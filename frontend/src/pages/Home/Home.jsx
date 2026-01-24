import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces')
      const data = await response.json()
      setWorkspaces(data.workspaces || [])
    } catch (error) {
      console.error('Error fetching workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = async (e) => {
    e.preventDefault()
    if (!newWorkspaceName.trim()) return

    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWorkspaceName })
      })
      const workspace = await response.json()
      navigate(`/workspace/${workspace.id}`)
    } catch (error) {
      console.error('Error creating workspace:', error)
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Your Workspaces</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ New Workspace'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateWorkspace} className="create-workspace-form">
          <input
            type="text"
            placeholder="Workspace name"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            autoFocus
            className="workspace-input"
          />
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="workspaces-grid">
        {workspaces.length === 0 ? (
          <div className="empty-state">
            <p>No workspaces yet. Create your first workspace to get started!</p>
          </div>
        ) : (
          workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="workspace-card"
              onClick={() => navigate(`/workspace/${workspace.id}`)}
            >
              <h3>{workspace.name}</h3>
              <p className="workspace-meta">
                {workspace.nodes?.length || 0} components
              </p>
              <p className="workspace-date">
                Updated {new Date(workspace.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Home
