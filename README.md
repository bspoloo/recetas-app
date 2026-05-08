# 🍲 Recetas App — Práctica CI/CD con GitHub Actions

Proyecto de práctica para demostrar un pipeline **Integración Continua / Despliegue Continuo**
usando GitHub Actions, Node.js (Express) y React (Vite).

---

## ¿Qué hace el pipeline automáticamente?

Cada vez que haces `git push` a `main`, GitHub Actions ejecuta 3 jobs en paralelo/secuencia:

```
Push a main
    │
    ├── [Job 1] test-backend  → npm test (Jest + Supertest)
    │
    ├── [Job 2] build-frontend → npm run build (Vite)
    │
    └── [Job 3] deploy (solo si los 2 anteriores pasaron)
                └── Dispara el deploy en Render
```

---

## Paso 1 — Preparar repositorio en GitHub

1. Crea una cuenta en [github.com](https://github.com) si no tienes
2. Crea un nuevo repositorio: `recetas-app` (público)
3. Clona el repositorio en tu máquina:

```bash
git clone https://github.com/TU_USUARIO/recetas-app.git
cd recetas-app
```

4. Copia todos los archivos de este proyecto al repositorio
5. Primer commit:

```bash
git add .
git commit -m "feat: proyecto inicial recetas app"
git push origin main
```

---

## Paso 2 — Verificar que el pipeline se ejecuta

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **Actions**
3. Verás el workflow `CI/CD Recetas App` ejecutándose
4. Haz clic para ver los logs de cada job en tiempo real

✅ Si todo está verde, el pipeline funciona.

---

## Paso 3 — Configurar Render (deploy del backend)

1. Crea cuenta gratuita en [render.com](https://render.com)
2. New → **Web Service** → conecta tu repositorio GitHub
3. Configuración:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Una vez desplegado, anota la URL: `https://recetas-backend-XXX.onrender.com`

---

## Paso 4 — Configurar Vercel (deploy del frontend)

1. Crea cuenta gratuita en [vercel.com](https://vercel.com)
2. New Project → conecta tu repositorio GitHub
3. Configuración:
   - **Root directory:** `frontend`
   - **Framework:** Vite
4. En **Environment Variables** agrega:
   - `VITE_API_URL` = `https://recetas-backend-XXX.onrender.com`
5. Deploy

---

## Paso 5 — Configurar Secrets en GitHub

Para que el pipeline pueda hacer deploy automático:

1. En tu repositorio → **Settings → Secrets and variables → Actions**
2. Agrega estos secrets:
   - `VITE_API_URL` = URL de tu backend en Render
   - `RENDER_DEPLOY_HOOK_URL` = (desde Render: Settings → Deploy Hook)

---

## Paso 6 — Demostrar el flujo completo CI/CD

### Hacer un cambio y ver el pipeline en acción:

```bash
# Edita backend/src/recetas.js — agrega una receta nueva:
# { id: 4, nombre: "Tucumanas", ingredientes: ["masa","carne"], tiempo: 60, categoria: "almuerzo" }

git add .
git commit -m "feat: agregar receta tucumanas"
git push origin main
```

Luego ve a la pestaña **Actions** y observa cómo:
1. Los tests se ejecutan automáticamente
2. El build de React se genera
3. El deploy se dispara solo

---

## Paso 7 — Ver qué pasa cuando un test falla (CI fallando)

```bash
# Edita backend/tests/recetas.test.js
# Cambia esta línea para que falle a propósito:
#   expect(res.statusCode).toBe(200);
# Por:
#   expect(res.statusCode).toBe(999); // FALLA A PROPÓSITO

git add .
git commit -m "test: forzar fallo para demostrar CI"
git push origin main
```

Ve a Actions → verás el job en **rojo** y el deploy **no se ejecuta** (porque depende de que los tests pasen).

Este es el valor principal de CI/CD: **el código roto nunca llega a producción.**

---

## Correr localmente

### Backend:
```bash
cd backend
npm install
npm start        # servidor en http://localhost:3001
npm test         # ejecutar tests
```

### Frontend:
```bash
cd frontend
npm install
npm run dev      # app en http://localhost:5173
```

---

## Estructura del proyecto

```
recetas-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          ← Pipeline GitHub Actions
├── backend/
│   ├── src/
│   │   ├── app.js             ← Express + rutas API
│   │   ├── index.js           ← Servidor (entry point)
│   │   └── recetas.js         ← Datos (array de recetas)
│   ├── tests/
│   │   └── recetas.test.js    ← Tests Jest + Supertest
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            ← Componente principal React
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Rutas de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/recetas` | Todas las recetas |
| GET | `/api/recetas/:id` | Una receta por ID |
| GET | `/api/recetas/categoria/:cat` | Filtrar por categoría |
