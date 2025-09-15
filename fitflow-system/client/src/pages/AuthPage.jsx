// src/pages/AuthPage.jsx
import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <RegisterForm onToggleForm={toggleForm} />
      )}
    </>
  );
};

export default AuthPage;