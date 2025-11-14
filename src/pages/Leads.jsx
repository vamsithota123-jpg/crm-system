import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { leadsThunk } from '../store'
import { Link } from 'react-router-dom'

export default function Leads(){
  const dispatch = useDispatch()
  const leads = useSelector(s=>s.leads.items)
  const loading = useSelector(s=>s.leads.loading)
  const error = useSelector(s=>s.leads.error)

  useEffect(()=>{ dispatch(leadsThunk()) },[dispatch])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Leads</h1>
        <Link to="/leads/new" className="inline-block bg-green-600 text-white px-3 py-1 rounded">New Lead</Link>
      </div>
      <div className="bg-white rounded shadow">
        {loading ? <div className="p-6">Loading...</div> : error ? <div className="p-6 text-red-600">{error}</div> : (
          <table className="w-full table-auto">
            <thead className="text-left bg-gray-50"><tr><th className="p-3">Name</th><th className="p-3">Company</th><th className="p-3">Owner</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
            <tbody>{leads.map(l=>(
              <tr key={l.id} className="border-t"><td className="p-3">{l.name}</td><td className="p-3">{l.company}</td><td className="p-3">{l.owner?.name}</td><td className="p-3">{l.status}</td><td className="p-3"><Link to={`/leads/${l.id}`} className="text-blue-600">Open</Link></td></tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  )
}
