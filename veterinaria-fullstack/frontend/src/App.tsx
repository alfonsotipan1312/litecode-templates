import { Routes, Route } from 'react-router-dom'
import { Layout } from './shared/components/Layout'
import { Dashboard } from './features/dashboard/pages/Dashboard'
import { PetList } from './features/pets/pages/PetList'
import { PetForm } from './features/pets/pages/PetForm'
import { PetDetail } from './features/pets/pages/PetDetail'
import { ClientList } from './features/clients/pages/ClientList'
import { ClientForm } from './features/clients/pages/ClientForm'
import { MedicalHistory } from './features/consultations/pages/MedicalHistory'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pets" element={<PetList />} />
        <Route path="/pets/new" element={<PetForm />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientForm />} />
        <Route path="/consultations" element={<MedicalHistory />} />
      </Routes>
    </Layout>
  )
}

export default App
