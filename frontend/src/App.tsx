import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/templates/MainLayout';
import { AuthLayout } from './components/templates/AuthLayout';
import { ProtectedRoute } from './components/templates/ProtectedRoute';
import { LoginForm } from './components/organisms/LoginForm';
import { RegisterForm } from './components/organisms/RegisterForm';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterForm /></AuthLayout>} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <div>Dashboard Principal (Migración en proceso)</div>
          </MainLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;
