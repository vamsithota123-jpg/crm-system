import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Dashboard(){
  const [metrics,setMetrics]=useState({})
  const [chartData,setChartData]=useState([])
  const [recharts,setRecharts]=useState(null)
  const [apiError,setApiError]=useState(null)

  useEffect(()=>{
    let mounted=true
    ;(async ()=>{
      try {
        const mod = await import('recharts')
        if(!mounted) return
        setRecharts({
          ResponsiveContainer: mod.ResponsiveContainer,
          LineChart: mod.LineChart,
          Line: mod.Line,
          XAxis: mod.XAxis,
          YAxis: mod.YAxis,
          Tooltip: mod.Tooltip,
          CartesianGrid: mod.CartesianGrid,
        })
      } catch(err) {
        console.warn('recharts not available',err)
        if(mounted) setRecharts(false)
      }
    })()
    return ()=>{ mounted=false }
  },[])

  useEffect(()=>{
    let mounted=true
    const fetch = async ()=> {
      try {
        const res = await api.get('/analytics/overview')
        if(!mounted) return
        setMetrics(res.data.metrics||{})
        setChartData(res.data.chart||[])
        setApiError(null)
      } catch(err) {
        console.error('dashboard load err', err)
        if(!mounted) return
        setApiError(err.response?.data?.message || err.message || 'Failed to load analytics')
      }
    }
    fetch()
    return ()=>{ mounted=false }
  },[])

  const renderFallbackChart = ()=> {
    const points = (chartData && chartData.length) ? chartData.map((d,i)=>({x:i,y:Number(d.value||0)})) : []
    const width=600,height=200,padding=20
    const maxY = Math.max(1,...points.map(p=>p.y))
    const path = points.map((p,i)=>{
      const x = padding + (i / Math.max(1, points.length-1)) * (width - padding*2)
      const y = height - padding - (p.y / maxY) * (height - padding*2)
      return `${i===0?'M':'L'} ${x} ${y}`
    }).join(' ')
    return (
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="220" className="border rounded">
        <rect width="100%" height="100%" fill="#ffffff" />
        <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" />
        {points.map((p,i)=>{
          const x = padding + (i / Math.max(1, points.length-1)) * (width - padding*2)
          const y = height - padding - (p.y / maxY) * (height - padding*2)
          return <circle key={i} cx={x} cy={y} r={3} />
        })}
      </svg>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {apiError && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded">Error loading analytics: {apiError}</div>}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow"><div className="text-sm text-gray-500">Total Leads</div><div className="text-2xl font-bold">{metrics.totalLeads ?? '—'}</div></div>
        <div className="p-4 bg-white rounded shadow"><div className="text-sm text-gray-500">Open Opportunities</div><div className="text-2xl font-bold">{metrics.openOpp ?? '—'}</div></div>
        <div className="p-4 bg-white rounded shadow"><div className="text-sm text-gray-500">My Activities</div><div className="text-2xl font-bold">{metrics.myActivities ?? '—'}</div></div>
      </div>

      <div className="bg-white p-4 rounded shadow h-72">
        <h3 className="mb-2 font-medium">Leads / Month</h3>
        {recharts === null && <div className="p-6 text-sm text-gray-500">Loading chart library...</div>}
        {recharts === false && <div><div className="text-sm text-gray-600 mb-2">Charting library not available — showing fallback visualization.</div>{renderFallbackChart()}</div>}
        {recharts && (
          <recharts.ResponsiveContainer width="100%" height={220}>
            <recharts.LineChart data={chartData}>
              <recharts.CartesianGrid strokeDasharray="3 3" />
              <recharts.XAxis dataKey="month" />
              <recharts.YAxis />
              <recharts.Tooltip />
              <recharts.Line type="monotone" dataKey="value" strokeWidth={2} />
            </recharts.LineChart>
          </recharts.ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
