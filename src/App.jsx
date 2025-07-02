import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import FeedbackList from '@/components/pages/FeedbackList'
import WidgetSettings from '@/components/pages/WidgetSettings'
import EmailConfig from '@/components/pages/EmailConfig'
import Analytics from '@/components/pages/Analytics'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/feedback" element={<FeedbackList />} />
          <Route path="/widget" element={<WidgetSettings />} />
          <Route path="/email" element={<EmailConfig />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App