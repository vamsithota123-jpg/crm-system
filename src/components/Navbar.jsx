import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { authActions } from '../store'

export default function Navbar(){
  const auth = useSelector(s=>s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <nav className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">Acme CRM</Link>
        <Link to="/leads" className="text-sm text-gray-600">Leads</Link>
        <Link to="/dashboard" className="text-sm text-gray-600">Dashboard</Link>
      </div>
      <div className="flex items-center gap-4">
        {auth.user ? <>
          <span className="text-sm text-gray-700">{auth.user.name} ({auth.user.role})</span>
          <button className="text-sm bg-red-500 text-white px-3 py-1 rounded" onClick={()=>{ dispatch(authActions.logout()); navigate('/login') }}>Logout</button>
        </> : <Link to="/login" className="text-sm text-gray-700">Login</Link>}
      </div>
    </nav>
  )
}
