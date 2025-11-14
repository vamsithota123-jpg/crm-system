import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

export default function LeadDetail(){
  const { id } = useParams()
  const [lead,setLead]=useState(null)
  const [activities,setActivities]=useState([])
  const [note,setNote]=useState('')

  useEffect(()=>{
    let mounted=true
    const load = async ()=>{
      try {
        const res = await api.get(`/leads/${id}`)
        if(!mounted) return
        setLead(res.data.lead)
        setActivities(res.data.activities||[])
      } catch(err){ console.error(err) }
    }
    load()
    return ()=>{ mounted=false }
  },[id])

  const addNote = async ()=>{
    if(!note.trim()) return
    try {
      const res = await api.post(`/leads/${id}/activities`, { type:'note', text: note })
      setActivities(p=>[res.data, ...p])
      setNote('')
    } catch(err){ console.error(err) }
  }

  if(!lead) return <div className="p-6">Loading lead...</div>

  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{lead.name}</h2>
            <div className="text-sm text-gray-600">{lead.company} • {lead.email}</div>
            <div className="mt-2 text-sm">Owner: {lead.owner?.name}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Status</div>
            <div className="font-medium">{lead.status}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Activity Timeline</h3>
          <div className="mb-4">
            <textarea value={note} onChange={e=>setNote(e.target.value)} className="w-full border p-2 rounded mb-2" rows={3}></textarea>
            <div className="flex gap-2"><button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={addNote}>Add Note</button></div>
          </div>
          <div>{activities.map(a=>(
            <div key={a.id} className="border-t py-3"><div className="text-sm text-gray-600">{new Date(a.createdAt).toLocaleString()}</div><div className="mt-1">{a.type==='note'?a.text:`${a.type} — ${a.summary||''}`}</div></div>
          ))}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Lead Details</h3>
          <div className="text-sm text-gray-700"><strong>Assigned:</strong> {lead.owner?.name}</div>
          <div className="text-sm text-gray-700"><strong>Phone:</strong> {lead.phone}</div>
          <div className="text-sm text-gray-700"><strong>Source:</strong> {lead.source}</div>
        </div>
      </div>
    </div>
  )
}
