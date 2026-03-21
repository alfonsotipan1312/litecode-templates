import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './features/layout/Layout'
import { Dashboard } from './features/dashboard/Dashboard'
import { PetList } from './features/pets/PetList'
import { PetCreate } from './features/pets/PetCreate'
import { PetDetail } from './features/pets/PetDetail'
import { ClientList } from './features/clients/ClientList'
import { ClientCreate } from './features/clients/ClientCreate'
import { ConsultationList } from './features/consultations/ConsultationList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pets" element={<PetList />} />
          <Route path="pets/new" element={<PetCreate />} />
          <Route path="pets/:id" element={<PetDetail />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/new" element={<ClientCreate />} />
          <Route path="consultations" element={<ConsultationList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
