import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk, authActions } from '../store'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const dispatch = useDispatch()
  const auth = useSelector(s=>s.auth)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()

  useEffect(()=>{ if(auth.token) navigate('/dashboard') },[auth.token,navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(loginThunk({email,password})).unwrap()
      navigate('/dashboard')
    } catch(err){}
  }

  const demo = () => {
    const demoUser = { id: 999, name:'Demo User', role:'Admin', email:'demo@preview'}
    dispatch(authActions.loginSuccess({ token:'demo-token-preview', user: demoUser }))
    setTimeout(()=>navigate('/dashboard'),150)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Sign in to Acme CRM</h2>
        <label className="block mb-2 text-sm">Email</label>
        <input className="w-full border p-2 mb-3 rounded" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="block mb-2 text-sm">Password</label>
        <input type="password" className="w-full border p-2 mb-4 rounded" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">{auth.loading ? 'Signing...' : 'Sign In'}</button>

        <div className="mt-3 text-center">
          <button type="button" onClick={demo} className="w-full bg-gray-800 text-white py-2 rounded">Demo login (preview)</button>
        </div>

        <div className="mt-3 text-xs text-gray-500">Use Demo login when running the front-end preview without a backend.</div>

        {auth.error && <div className="mt-3 text-sm text-red-600">{auth.error}</div>}
      </form>
    </div>
  )
}
