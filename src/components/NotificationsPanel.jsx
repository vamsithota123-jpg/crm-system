import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { notificationsActions } from '../store'

export default function NotificationsPanel(){
  const items = useSelector(s=>s.notifications.items)
  const dispatch = useDispatch()
  return (
    <div className="fixed right-4 bottom-4 w-96 max-w-full">
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <strong>Notifications</strong>
          <button className="text-sm text-gray-500" onClick={()=>dispatch(notificationsActions.clearNotifications())}>Clear</button>
        </div>
        <div className="max-h-80 overflow-auto">
          {items.length===0 ? <div className="p-3 text-sm text-gray-500">No notifications</div> : items.map((n,i)=>(
            <div key={i} className="p-3 border-b">
              <div className="text-sm text-gray-600">{new Date(n.ts||Date.now()).toLocaleString()}</div>
              <div className="mt-1">{n.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
