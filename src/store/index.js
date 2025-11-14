import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

// Simple auth slice with demo-login support
export const loginThunk = createAsyncThunk('auth/login', async ({email,password},{rejectWithValue}) => {
  try {
    const res = await api.post('/auth/login',{email,password})
    return res.data
  } catch(err) {
    return rejectWithValue(err.response?.data || {message: err.message})
  }
})

const authSlice = createSlice({
  name:'auth',
  initialState:{ user:null, token: localStorage.getItem('crm_token')||null, loading:false, error:null },
  reducers:{
    logout(state){ state.user=null; state.token=null; try{ localStorage.removeItem('crm_token') }catch(e){} },
    loginSuccess(state, action){ state.token=action.payload.token; state.user=action.payload.user; try{ localStorage.setItem('crm_token', action.payload.token)}catch(e){} }
  },
  extraReducers:(b)=> {
    b.addCase(loginThunk.pending,(s)=>{s.loading=true; s.error=null})
     .addCase(loginThunk.fulfilled,(s,a)=>{ s.loading=false; s.token=a.payload.token; s.user=a.payload.user; try{ localStorage.setItem('crm_token', a.payload.token)}catch(e){} })
     .addCase(loginThunk.rejected,(s,a)=>{ s.loading=false; s.error=a.payload?.message||'Login failed' })
  }
})

const leadsThunk = createAsyncThunk('leads/fetch', async () => {
  const res = await api.get('/leads'); return res.data;
})

const leadsSlice = createSlice({
  name:'leads',
  initialState:{ items:[], loading:false, error:null },
  reducers:{},
  extraReducers:(b)=> {
    b.addCase(leadsThunk.pending,(s)=>{s.loading=true})
     .addCase(leadsThunk.fulfilled,(s,a)=>{s.loading=false; s.items=a.payload})
     .addCase(leadsThunk.rejected,(s,a)=>{s.loading=false; s.error=a.payload?.message||'Failed to load'})
  }
})

const notificationsSlice = createSlice({
  name:'notifications',
  initialState:{items:[]},
  reducers:{
    pushNotification(state,action){ state.items.unshift(action.payload); if(state.items.length>50) state.items.pop() },
    clearNotifications(state){ state.items=[] }
  }
})

const store = configureStore({
  reducer:{
    auth: authSlice.reducer,
    leads: leadsSlice.reducer,
    notifications: notificationsSlice.reducer
  }
})

export const authActions = authSlice.actions
export const leadsActions = leadsSlice.actions
export const notificationsActions = notificationsSlice.actions
export { leadsThunk }         // <-- removed `loginThunk` from here
export default store
