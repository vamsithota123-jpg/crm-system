import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { notificationsActions } from '../store'

export default function useSocket() {
  const dispatch = useDispatch()
  useEffect(() => {
    if (typeof window === 'undefined') return
    let socket = null, cancelled=false
    ;(async ()=>{
      try {
        const ioModule = await import('socket.io-client')
        const io = ioModule.default || ioModule
        const token = localStorage.getItem('crm_token')
        socket = io((window.__ENV && window.__ENV.SOCKET_URL) || 'http://localhost:4000', { auth:{ token } })
        socket.on('notification', payload => {
          if (cancelled) return
          try { dispatch(notificationsActions.pushNotification(payload)) } catch(e){}
        })
      } catch(err){
        console.warn('socket not available',err)
      }
    })()
    return ()=>{ cancelled=true; try{ if(socket) socket.disconnect() }catch(e){} }
  },[dispatch])
}
