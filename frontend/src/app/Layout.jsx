// Main layout component for the application
function Layout({ children }) {
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
