import React from "react";
import { Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./auth/login";
import Navbar from "./components/navbar";
import TechEventsPage from "./pages/TechEvents";
import MyEventsPage from "./pages/myEvents";
import AssignOrganisersPage from "./pages/assignEvent";
import EventView from "./pages/viewEventDetails";

// Route guard for protected routes
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>
      <Routes>
 
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="/" element={<TechEventsPage />} />
          <Route path="/events/:id" element={<EventView />} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/assign-organisers" element={<AssignOrganisersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-center" theme="dark" richColors closeButton />
    </div>
  );
}
