import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Browse from "./pages/Browse"
import VenueDetail from "./pages/VenueDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyBookings from "./pages/MyBookings"
import ManagerDashboard from "./pages/ManagerDashboard"
import NotFound from "./pages/NotFound"

function Layout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar key={location.pathname} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<MyBookings />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App