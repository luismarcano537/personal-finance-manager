import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthenticatedLayout from '../layouts/AuthenticatedLayout'
import Categories from '../pages/Categories'
import Dashboard from '../pages/Dashboard'
import LandingPage from '../pages/LandingPage'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Transactions from '../pages/Transactions'
import ProtectedRoute from './ProtectedRoute'

type AuthRouteProps = {
  children: ReactNode
}

function PublicRoute({ children }: AuthRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
        <p className="text-sm font-medium text-slate-300">Carregando...</p>
      </main>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Categories />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Transactions />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
