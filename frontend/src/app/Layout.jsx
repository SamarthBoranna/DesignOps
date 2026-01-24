// Main layout component for the application
// This will wrap all pages with common UI elements

function Layout({ children }) {
  return (
    <div className="layout">
      {children}
    </div>
  )
}

export default Layout
