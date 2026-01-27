import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet, apiPost } from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
import './Home.css'

function Home() {
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    // Wait for auth to be ready before fetching workspaces
    if (!authLoading && user) {
      fetchWorkspaces()
    } else if (!authLoading && !user) {
      // Not logged in, redirect to login
      navigate('/login')
    }
  }, [authLoading, user, navigate])

  const fetchWorkspaces = async () => {
    try {
      setError(null)
      const response = await apiGet('/api/workspaces')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setWorkspaces(data.workspaces || [])
    } catch (error) {
      console.error('Error fetching workspaces:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = async (e) => {
    e.preventDefault()
    if (!newWorkspaceName.trim()) return

    try {
      setError(null)
      const response = await apiPost('/api/workspaces', { name: newWorkspaceName })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const workspace = await response.json()
      if (workspace && workspace.id) {
        navigate(`/workspace/${workspace.id}`)
      } else {
        throw new Error('Invalid response: missing workspace ID')
      }
    } catch (error) {
      console.error('Error creating workspace:', error)
      setError(error.message)
    }
  }

  if (authLoading || loading) {
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

      {error && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          border: '1px solid #ef9a9a'
        }}>
          Error: {error}
        </div>
      )}

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
