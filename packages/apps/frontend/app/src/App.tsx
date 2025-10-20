import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import RouteCreation from './components/RouteCreation'
import SearchResults from './components/SearchResults'
import { RouteCreationSuccess } from './components/RouteCreationSuccess'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/create-route" element={<RouteCreation />} />
        <Route path="/route-created" element={<RouteCreationSuccess />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
