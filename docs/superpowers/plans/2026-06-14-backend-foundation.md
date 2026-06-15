# Backend Foundation & Database Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar la base del nuevo backend en TypeScript, integrar Prisma con PostgreSQL y migrar el servicio actual de transcripción de audio (Groq) a la nueva arquitectura modular.

**Architecture:** Se creará la estructura base de Clean Architecture (separación por módulos). Se configurará Express con tipado estricto, Prisma para la conexión a la base de datos y se adaptarán los scripts de inicio para que soporten TypeScript tanto en Linux como en Windows.

**Tech Stack:** Node.js, Express, TypeScript, Prisma, PostgreSQL, Groq API, tsx.

---

### Task 1: Inicializar TypeScript y reestructurar carpetas

**Files:**
- Create: `backend/tsconfig.json`
- Create: `backend/src/app.ts`
- Create: `backend/src/server.ts`
- Modify: `backend/package.json:1-30`

- [ ] **Step 1: Instalar dependencias de TypeScript**

```bash
cd backend
npm install typescript @types/node @types/express @types/cors @types/multer tsx --save-dev
```
Expected: PASS

- [ ] **Step 2: Crear configuración de TypeScript (`tsconfig.json`)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Actualizar `package.json`**

Modificar los scripts para usar `tsx` (funciona nativamente en Windows/Linux):
```json
  "scripts": {
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts",
    "build": "tsc"
  }
```

- [ ] **Step 4: Crear la estructura modular base**

```bash
cd backend
mkdir -p src/config src/modules/processing/controllers src/modules/processing/services src/modules/processing/routes src/shared/middlewares src/shared/utils
```

- [ ] **Step 5: Commit**

```bash
git add backend/package.json backend/package-lock.json backend/tsconfig.json backend/src/
git commit -m "chore(backend): inicializar typescript y estructura de carpetas"
```

### Task 2: Configurar Prisma y PostgreSQL

**Files:**
- Create: `backend/prisma/schema.prisma`
- Modify: `backend/.env`

- [ ] **Step 1: Instalar Prisma y dependencias**

```bash
cd backend
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

- [ ] **Step 2: Definir el esquema base en `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String?
  googleId     String?
  role         Role     @default(USER)
  customApiKey String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  files        FileRecord[]
  processes    ProcessHistory[]
}

model FileRecord {
  id          String   @id @default(uuid())
  userId      String
  fileName    String
  fileUrl     String
  storageType StorageType
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model ProcessHistory {
  id          String   @id @default(uuid())
  userId      String
  processType ProcessType
  status      String
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

enum Role {
  USER
  ADMIN
}

enum StorageType {
  TEMPORARY
  PERMANENT
}

enum ProcessType {
  TRANSCRIPTION
  TTS
  TRANSLATION
  VIDEO
}
```

- [ ] **Step 3: Agregar variable de entorno en `.env` (PostgreSQL local)**

Agregar al final del `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/whisper_saas?schema=public"
```

- [ ] **Step 4: Commit**

```bash
git add backend/prisma/ backend/.env backend/package.json backend/package-lock.json
git commit -m "feat(database): configurar prisma y esquema base para usuarios, archivos e historial"
```

### Task 3: Migrar App y Server de Express a TypeScript

**Files:**
- Create: `backend/src/app.ts`
- Create: `backend/src/server.ts`
- Delete: `backend/src/server.js`

- [ ] **Step 1: Crear `app.ts`**

```typescript
import express, { Application } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SaaS API is running' });
});

// Rutas se agregarán aquí

export default app;
```

- [ ] **Step 2: Crear `server.ts`**

```typescript
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[Server] Corriendo en el puerto ${PORT}`);
});
```

- [ ] **Step 3: Eliminar `server.js` antiguo y probar arranque**

```bash
cd backend
rm src/server.js
npm run dev &
sleep 2
curl http://localhost:3001/health
kill %1
```
Expected: Debe devolver `{"status":"OK","message":"SaaS API is running"}`.

- [ ] **Step 4: Commit**

```bash
git add backend/src/app.ts backend/src/server.ts backend/src/server.js
git commit -m "refactor(backend): migrar inicializacion de express a typescript"
```

### Task 4: Migrar Servicio de Groq (Transcripción)

**Files:**
- Create: `backend/src/modules/processing/services/whisperService.ts`
- Delete: `backend/src/services/whisperService.js`

- [ ] **Step 1: Instalar dependencias para Groq si faltan y crear servicio**

```typescript
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const transcribeAudio = async (filePath: string, apiKey: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('model', 'whisper-large-v3');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API Error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[WhisperService] Error:', error);
    throw error;
  }
};
```

- [ ] **Step 2: Borrar servicio antiguo**

```bash
rm backend/src/services/whisperService.js
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/processing/ backend/src/services/
git commit -m "refactor(processing): migrar servicio de transcripcion a modulo de procesamiento en TS"
```

### Task 5: Adaptar Script de Inicio para Windows

**Files:**
- Modify: `start.sh:1-82`

- [ ] **Step 1: Modificar `start.sh` para usar comandos compatibles**

Reemplazar el contenido de `start.sh` (eliminar dependencias estrictas de POSIX que fallan en Windows/Git Bash, asegurando rutas y comandos genéricos).

```bash
#!/usr/bin/env bash
# Script adaptado para funcionar en Git Bash (Windows) y Linux
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

print_usage() {
  cat <<EOF
Uso: ./start.sh [all|backend|frontend]
EOF
}

run_backend() {
  echo "Iniciando backend..."
  cd "$ROOT_DIR/backend" && npm run dev
}

run_frontend() {
  echo "Iniciando frontend..."
  cd "$ROOT_DIR/frontend" && npm run dev -- --open
}

MODE="${1:-all}"

case "$MODE" in
  all)
    run_backend &
    run_frontend &
    wait
    ;;
  backend) run_backend ;;
  frontend) run_frontend ;;
  *) print_usage; exit 1 ;;
esac
```

- [ ] **Step 2: Commit**

```bash
git add start.sh
git commit -m "fix(scripts): adaptar start.sh para mayor compatibilidad con windows"
```
