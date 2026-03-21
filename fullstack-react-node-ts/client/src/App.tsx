import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [apiMessage, setApiMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: { status: string; timestamp: string }) =>
        setApiMessage(`Backend OK - ${data.timestamp}`)
      )
      .catch(() => setApiMessage('Error al conectar con el backend'))
  }, [])

  return (
    <>
      <h1>Fullstack React + Node.js (TypeScript)</h1>
      <p>Frontend y backend 100% TypeScript.</p>
      <p className="api-status">{apiMessage ?? 'Conectando...'}</p>
    </>
  )
}

export default App
