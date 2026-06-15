import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/templates/MainLayout';

const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<div>Dashboard Principal (Migración en proceso)</div>} />
      </Routes>
    </MainLayout>
  );
};

export default App;
