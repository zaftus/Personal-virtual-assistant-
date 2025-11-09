import React, { useState } from 'react'
import Chat from './components/Chat'
import Auth from './components/Auth'

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Ava</h2>
        <Auth onLogin={(t) => setToken(t)} />
      </aside>
      <main className="main">
        <Chat token={token} />
      </main>
    </div>
  )
}
