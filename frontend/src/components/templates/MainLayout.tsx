import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow p-4 text-xl font-bold">
        SaaS Platform
      </header>
      <main className="p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};
