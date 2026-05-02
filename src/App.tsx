import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import GenericPage from './pages/GenericPage'
import NotFound from './pages/NotFound'
import pagesData from './data/pages.json'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="delivery" element={<GenericPage {...pagesData['delivery']} />} />
          <Route path="about-us" element={<GenericPage {...pagesData['about-us']} />} />
          <Route path="privacy-statement" element={<GenericPage {...pagesData['privacy-statement']} />} />
          <Route path="terms-of-use" element={<GenericPage {...pagesData['terms-of-use']} />} />
          <Route path="our-coffees" element={<GenericPage {...pagesData['our-coffees']} />} />
          <Route path="contact-us" element={<GenericPage {...pagesData['contact-us']} />} />
          <Route path="cookie-notice" element={<GenericPage {...pagesData['cookie-notice']} />} />
          <Route path="social-impact-sustainability" element={<GenericPage {...pagesData['social-impact-sustainability']} />} />
          <Route path="starbucks-middle-east" element={<GenericPage {...pagesData['starbucks-middle-east']} />} />
          <Route path="starbucks-for-the-record" element={<GenericPage {...pagesData['starbucks-for-the-record']} />} />
          <Route path="community-impact-starbucks" element={<GenericPage {...pagesData['community-impact-starbucks']} />} />
          <Route path="new-era-same-icons" element={<GenericPage {...pagesData['new-era-same-icons']} />} />
          <Route path="*" element={<NotFound />} />
          {/* Add more routes here as we build them */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
