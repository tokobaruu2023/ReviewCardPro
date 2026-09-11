import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ThankYou from "./pages/ThankYou";

// Komponen pelindung rute admin
function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("isLoggedIn");
  return isAuth ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      {/* Route publik untuk scan NFC/QR */}
      <Route path="/card/:cardCode" element={<ThankYou />} />
      
      {/* Route Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Route Dashboard dengan Sidebar & Proteksi Login */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/:menu" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Redirect default ke login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;