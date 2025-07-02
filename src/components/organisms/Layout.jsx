import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Dashboard', subtitle: 'Customer feedback overview' }
      case '/feedback':
        return { title: 'Feedback', subtitle: 'Manage customer responses' }
      case '/widget':
        return { title: 'Widget Settings', subtitle: 'Customize your feedback widget' }
      case '/email':
        return { title: 'Email Configuration', subtitle: 'Set up notifications' }
      case '/analytics':
        return { title: 'Analytics', subtitle: 'Detailed feedback insights' }
      default:
        return { title: 'FeedbackPulse', subtitle: 'Customer Analytics Platform' }
    }
  }

  const { title, subtitle } = getPageInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout