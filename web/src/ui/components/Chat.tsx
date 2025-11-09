import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

export default function Chat({ token }: { token: string | null }) {
  const [messages, setMessages] = useState<{from:'user'|'ava', text:string}[]>([])
  const [text,setText]=useState('')
  const wsRef = useRef<WebSocket|null>(null)

  useEffect(() => {
    // open websocket for streaming responses
    const url = (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.hostname + ':8000/ws'
    wsRef.current = new WebSocket(url)
    wsRef.current.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        if (data.type === 'partial') {
          setMessages((m)=>[...m.filter(x=>x.from!=='ava_stream'), { from:'ava', text: data.text }])
        } else if (data.type === 'final') {
          setMessages((m)=>[...m, { from:'ava', text: data.text }])
        }
      } catch {}
    }
    return ()=> { wsRef.current?.close(); wsRef.current = null }
  }, [])

  async function send(){
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    setMessages(m=>[...m, {from:'user', text}])
    try {
      const r = await axios.post(`${base}/chat/message`, { message: text })
      setMessages(m=>[...m, {from:'ava', text: r.data.reply || JSON.stringify(r.data)}])
    } catch (err:any) {
      setMessages(m=>[...m, {from:'ava', text: 'Error: ' + (err.message || 'unknown')}])
    }
    setText('')
  }

  return (
    <div className="chat">
      <div className="msgs">
        {messages.map((m,i)=><div key={i} className={`msg ${m.from}`}>{m.text}</div>)}
      </div>
      <div className="composer">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask Ava..." />
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}
