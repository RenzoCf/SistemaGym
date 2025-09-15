// src/App.jsx (sin router)
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import RegisterForm from './components/auth/RegisterForm.jsx';
import Dashboard from './components/Dashboard.jsx';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return showRegister ? (
    <RegisterForm onToggleForm={() => setShowRegister(false)} />
  ) : (
    <LoginForm onToggleForm={() => setShowRegister(true)} />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;