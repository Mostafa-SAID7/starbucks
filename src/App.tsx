import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import GenericPage from './pages/GenericPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          
          {/* Informational Pages */}
          <Route path="delivery" element={<GenericPage />} />
          <Route path="about-us" element={<GenericPage />} />
          <Route path="privacy-statement" element={<GenericPage />} />
          <Route path="terms-of-use" element={<GenericPage />} />
          <Route path="our-coffees" element={<GenericPage />} />
          <Route path="contact-us" element={<GenericPage />} />
          <Route path="cookie-notice" element={<GenericPage />} />
          <Route path="social-impact-sustainability" element={<GenericPage />} />
          <Route path="starbucks-middle-east" element={<GenericPage />} />
          <Route path="starbucks-for-the-record" element={<GenericPage />} />
          <Route path="community-impact-starbucks" element={<GenericPage />} />
          <Route path="new-era-same-icons" element={<GenericPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
