import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import RouteCreation from './components/RouteCreation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-route" element={<RouteCreation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
