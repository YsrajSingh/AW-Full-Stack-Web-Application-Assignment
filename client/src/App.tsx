import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { Layout } from "./components/Layout"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ForgotPassword } from "./pages/ForgotPassword"
import { ResetPassword } from "./pages/ResetPassword"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App