import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import LeadDetail from './pages/LeadDetail'
import NotificationsPanel from './components/NotificationsPanel'
import useSocket from './hooks/useSocket'

function AppContent() {
  useSocket()
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<div className="p-6">Welcome to Acme CRM. Go to <Link to="/dashboard" className="text-blue-600">Dashboard</Link></div>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/leads" element={<Leads/>} />
          <Route path="/leads/:id" element={<LeadDetail/>} />
        </Routes>
        <NotificationsPanel />
      </div>
    </Router>
  )
}

export default function RootApp() {
  return <Provider store={store}><AppContent/></Provider>
}
