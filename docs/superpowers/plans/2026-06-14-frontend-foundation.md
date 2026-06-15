# Frontend Foundation & Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactorizar el frontend actual para utilizar TypeScript, aplicar Atomic Design, configurar variables de entorno para la API y eliminar la dependencia del proxy local.

**Architecture:** Se estructurará el frontend en `src/components` (Atomic Design), `src/modules` (arquitectura modular), y se implementará React Router DOM y Zustand. Se configurará Vite para usar variables de entorno globales.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Zustand, React Router DOM, Axios.

---

### Task 1: Inicializar TypeScript y Dependencias en Frontend

**Files:**
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.node.json`
- Modify: `frontend/package.json:1-25`

- [ ] **Step 1: Instalar TypeScript y herramientas necesarias**

```bash
cd frontend
npm install typescript @types/react @types/react-dom @types/node react-router-dom zustand axios --save
npm install tailwindcss postcss autoprefixer --save-dev
```
Expected: PASS

- [ ] **Step 2: Crear configuración de TypeScript (`tsconfig.json`)**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Crear `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Renombrar archivos base**

```bash
cd frontend
mv src/main.jsx src/main.tsx
mv src/App.jsx src/App.tsx
mv vite.config.js vite.config.ts
```

- [ ] **Step 5: Commit**

```bash
git add frontend/
git commit -m "chore(frontend): configurar typescript y dependencias core"
```

### Task 2: Configurar Vite, Variables de Entorno y Proxy

**Files:**
- Modify: `frontend/vite.config.ts:1-16`
- Create: `frontend/.env`
- Create: `frontend/.env.example`

- [ ] **Step 1: Eliminar Proxy y actualizar `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy ha sido eliminado para conexión directa vía variables de entorno
  },
});
```

- [ ] **Step 2: Crear `.env` y `.env.example`**

```env
# URL base del backend
VITE_API_URL=http://localhost:3001
```

- [ ] **Step 3: Crear cliente Axios centralizado (`src/config/api.ts`)**

```bash
mkdir -p frontend/src/config
```

Crear `frontend/src/config/api.ts`:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

- [ ] **Step 4: Commit**

```bash
git add frontend/vite.config.ts frontend/.env.example frontend/src/config/
git commit -m "feat(frontend): eliminar proxy y configurar variable de entorno global VITE_API_URL"
```

### Task 3: Estructurar Atomic Design y Módulos

**Files:**
- Modify: estructura de carpetas en `frontend/src`

- [ ] **Step 1: Crear la estructura de carpetas**

```bash
cd frontend
mkdir -p src/components/atoms src/components/molecules src/components/organisms src/components/templates
mkdir -p src/modules/auth src/modules/dashboard src/modules/processing src/modules/admin
mkdir -p src/store src/hooks
```

- [ ] **Step 2: Crear el layout base (`src/components/templates/MainLayout.tsx`)**

```typescript
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
```

- [ ] **Step 3: Configurar Tailwind CSS básico si no estaba**

```bash
cd frontend
npx tailwindcss init -p
```

Modificar `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ frontend/src/modules/ frontend/tailwind.config.js frontend/postcss.config.js
git commit -m "chore(frontend): aplicar atomic design y configurar tailwindcss"
```

### Task 4: Configurar React Router y Estado Global

**Files:**
- Modify: `frontend/src/main.tsx`
- Create: `frontend/src/store/userStore.ts`

- [ ] **Step 1: Crear `userStore.ts` con Zustand**

```typescript
import { create } from 'zustand';

interface UserState {
  user: any | null;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

- [ ] **Step 2: Actualizar `main.tsx` para incorporar Router**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

- [ ] **Step 3: Actualizar `App.tsx` para usar el Layout y las Rutas**

```typescript
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
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/main.tsx frontend/src/App.tsx frontend/src/store/
git commit -m "feat(frontend): integrar react-router-dom, zustand y layout principal"
```
