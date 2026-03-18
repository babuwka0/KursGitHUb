import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ListBoardGames from "./pages/boardgames/ListBoardGames";
import BoardGameData from "./pages/boardgames/BoardGameData";
import UserBookings from "./pages/bookings/UserBookings";
import CreateBooking from "./pages/bookings/CreateBooking";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminSchedule from "./pages/admin/AdminSchedule";
import Login from "./pages/authorization/Login";
import Register from "./pages/authorization/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<ListBoardGames />} />
          <Route path="/games/:id" element={<BoardGameData />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <UserBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-table"
            element={
              <ProtectedRoute>
                <CreateBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedule"
            element={
              <ProtectedRoute>
                <AdminSchedule />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
