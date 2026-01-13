import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import Tutorial from './components/Tutorial'

const Home = () => (
  <>
    <Hero />
    <Features />
  </>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorial" element={<Tutorial />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
