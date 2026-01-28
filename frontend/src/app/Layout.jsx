import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// Main layout component for the application
function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="layout" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>DesignOps</h1>
            <p className="header-subtitle">Cloud Architecture Designer</p>
          </div>
          <div className="header-actions">
            <button className="btn-header">Export</button>
            <button className="btn-header btn-primary-header">Save Project</button>
            
            {user && (
              <div className="user-menu-container" style={{ position: 'relative', marginLeft: '1rem' }}>
                <button 
                  className="user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    background: '#1e1e2e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    minWidth: '180px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    zIndex: 1000
                  }}>
                    <div style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '0.5rem'
                    }}>
                      Signed in as<br/>
                      <span style={{ color: '#fff', fontWeight: '500' }}>{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}

export default Layout
