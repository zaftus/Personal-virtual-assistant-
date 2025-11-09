import React, { useState } from 'react'
import axios from 'axios'

export default function Auth({ onLogin }: { onLogin: (t: string)=>void }) {
  const [email,setEmail]=useState(''), [pw,setPw]=useState('')
  async function login(e:React.FormEvent){
    e.preventDefault()
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    const r = await axios.post(`${base}/auth/login`, { email, password: pw })
    onLogin(r.data.token)
  }
  return (
    <form onSubmit={login} className="auth">
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}
