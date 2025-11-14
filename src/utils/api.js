import axios from 'axios'
const API_BASE = (typeof window !== 'undefined' && window.__ENV && window.__ENV.API_BASE) || 'http://localhost:4000/api/v1'
const api = axios.create({ baseURL: API_BASE })
api.interceptors.request.use(cfg => {
  try {
    const token = localStorage.getItem('crm_token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  } catch(e){}
  return cfg
})
export default api
