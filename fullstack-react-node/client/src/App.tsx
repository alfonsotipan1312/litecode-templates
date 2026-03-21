import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [apiMessage, setApiMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setApiMessage(`Backend OK - ${data.timestamp}`))
      .catch(() => setApiMessage('Error al conectar con el backend'))
  }, [])

  return (
    <>
      <h1>Fullstack React + Node.js</h1>
      <p>Frontend (Vite + React + TypeScript) conectado al backend (Express).</p>
      <p className="api-status">{apiMessage ?? 'Conectando...'}</p>
    </>
  )
}

export default App
