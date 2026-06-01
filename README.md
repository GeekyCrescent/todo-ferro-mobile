# Todo App — Aplicación móvil

Aplicación móvil de gestión de tareas organizadas por **listas**, construida con
Expo (React Native). Permite crear listas, agregar tareas con prioridad, fecha
límite y categorías, buscarlas y consultarlas desde cualquier dispositivo gracias
a un backend desplegado en la nube.

## Descripción

- **Listas de tareas**: organiza tus pendientes en listas con color (Escuela,
  Casa, Trabajo…).
- **Tareas**: cada tarea tiene título, descripción, prioridad (alta/media/baja),
  fecha límite y categorías. CRUD completo (crear, editar, completar, borrar).
- **Autenticación** con Firebase Authentication (email/contraseña) y sesión
  persistente.
- **Búsqueda** por listas y tareas.
- **Perfil** con datos del usuario, estadísticas y cierre de sesión.

## Tecnologías

**Móvil**
- [Expo](https://expo.dev) / React Native (Expo Router para navegación)
- TypeScript
- NativeWind + gluestack-ui (estilos)
- Axios (instancia personalizada + interceptors)
- Firebase Authentication (login + persistencia con AsyncStorage)
- react-native-svg (anillos de progreso)

**Backend** (repo aparte, `todo-backend`)
- Quarkus (Java 21), Hibernate ORM + Panache
- MySQL (Google Cloud SQL)
- Firebase Admin SDK (verificación de JWT)
- Desplegado en **Google Cloud Run**

## Arquitectura

```
app/                # Pantallas (Expo Router)
  login.tsx         # Login
  (tabs)/
    index.tsx       # Home: listas
    explore.tsx     # Búsqueda
    profile.tsx     # Perfil / About / Logout
  list/[id].tsx     # Detalle de lista (sus tareas)
  modal.tsx         # Crear / editar tarea
  list-modal.tsx    # Crear / editar lista
components/glass/    # Componentes reutilizables (cards, chips, botones, formularios)
hooks/               # useTodos, useLists
lib/                 # api (axios), auth, firebase, endpoints, helpers
theme/               # Tokens de diseño
```

## Requisitos previos

- Node.js 18+
- [pnpm](https://pnpm.io) (o npm)
- App **Expo Go** en tu teléfono, o un emulador Android/iOS

## Instalación

```bash
git clone <url-del-repo>
cd todo-mobile
pnpm install   # o: npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz de `todo-mobile`:

```bash
# URL del backend (Cloud Run)
EXPO_PUBLIC_API_URL=https://todo-backend-7sluyuniza-uc.a.run.app

# Configuración de Firebase (proyecto medsync-1)
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=medsync-1.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=medsync-1
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=medsync-1.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

> Las variables `EXPO_PUBLIC_*` se incluyen en el bundle al compilar. Si cambias
> el `.env`, reinicia con `npx expo start --clear`.

## Cómo ejecutar

```bash
npx expo start --clear
```

Luego:
- **Teléfono**: escanea el QR con Expo Go.
- **Web**: presiona `w`.
- **Android/iOS emulador**: presiona `a` / `i`.

El backend ya está desplegado y público, así que no necesitas correr nada local
para usar la app.

## Links deployados

- **Backend (API)**: https://todo-backend-7sluyuniza-uc.a.run.app
  - Health rápido: `GET /list` → `401` (vivo, requiere token)
- **App móvil**: se ejecuta vía Expo Go (no requiere build público).

## Usuarios de prueba

| Email | Contraseña |
|-------|------------|
| `ferro.prod@gmail.com` | `Test1234!` |

También puedes registrar un usuario nuevo: en la pantalla de login, entra a
**"Probar API"** → botón **"Register"** con un correo nuevo (lo crea en Firebase
y en la base de datos).

## Endpoints principales del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/user` | Registrar usuario (público) |
| GET | `/list` | Mis listas (con conteo de tareas) |
| POST/PUT/DELETE | `/list`, `/list/{id}` | CRUD de listas |
| GET | `/list/{id}/todos` | Tareas de una lista |
| GET | `/todo/my-todos` | Todas mis tareas |
| POST/PUT/DELETE | `/todo`, `/todo/{id}` | CRUD de tareas |
| PATCH | `/todo/{id}/toggle` | Completar/descompletar |
| GET/POST | `/category` | Categorías |

Todas (salvo `POST /user`) requieren `Authorization: Bearer <idToken de Firebase>`.
