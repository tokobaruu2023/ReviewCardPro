import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReviewCard from "./pages/ReviewCard";
import ThankYou from "./pages/ThankYou";
import NotActive from "./pages/NotActive";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard/*"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route path="/r/:cardCode" element={<ReviewCard />} />

      <Route path="/thank-you" element={<ThankYou />} />

      <Route path="/inactive" element={<NotActive />} />
    </Routes>
  );
}

export default App;