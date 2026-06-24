# 🥖 API Panadería — Sistema de Pedidos

API RESTful para la gestión de pedidos de una panadería, desarrollada como Trabajo Práctico Integrador Final de la carrera Back End con Node.js. Permite administrar clientes, productos, pedidos y usuarios, con autenticación, control de roles y generación de órdenes de producción.

El proyecto incluye un **backend** (API REST con Node + Express + MongoDB) y un **frontend** (React + Vite) que consume la API.

---

## 🌐 Demo en línea

- **Aplicación (frontend):** https://backend-final-plum.vercel.app
- **API (backend):** https://backend-final-66bk.onrender.com

> ⚠️ La API está alojada en el plan gratuito de Render, que suspende el servicio tras un período de inactividad. La primera petición puede tardar entre 30 y 50 segundos en responder mientras el servidor se reactiva. Las siguientes son inmediatas.

**Usuario de prueba (administrador):**
- Usuario: `admin`
- Contraseña: `cambiar123`

---

## 🛠️ Tecnologías utilizadas

**Backend**
- Node.js + Express
- MongoDB + Mongoose (base de datos en la nube con MongoDB Atlas)
- bcryptjs (hasheo de contraseñas)
- jsonwebtoken (autenticación con JWT)
- express-validator (validación de datos)
- express-rate-limit (limitación de peticiones)
- helmet y cors (seguridad)

**Frontend**
- React + Vite
- React Router
- Axios
- Tailwind CSS
- jsPDF (generación de órdenes de producción en PDF)

---

## 📁 Estructura del proyecto

```
backend-final/
├── backend/                 # API REST (Node + Express)
│   ├── src/
│   │   ├── config/          # Conexión a MongoDB
│   │   ├── models/          # Modelos Mongoose
│   │   ├── controllers/     # Lógica de cada entidad
│   │   ├── routes/          # Rutas de la API
│   │   ├── middlewares/     # Auth, validación, rate limit
│   │   ├── validations/     # Reglas de validación
│   │   ├── utils/           # Generación de tokens
│   │   ├── seed.js          # Crea el usuario administrador inicial
│   │   └── server.js        # Punto de entrada
│   └── API-Panaderia.postman_collection.json   # Colección de Postman
└── src/                     # Frontend (React + Vite)
```

---

## 🗄️ Entidades

- **Usuario** — nombre, username, password (hasheada), rol (`admin` / `vendedor`)
- **Cliente** — nombre, teléfono, dirección
- **Producto** — nombre, unidad (kg / unidad)
- **Pedido** — cliente, fecha de entrega, observaciones, y un listado de ítems (producto, unidad y cantidad)

---

## 🚪 Endpoints

Todas las rutas (excepto el login) requieren un token JWT en el header:
`Authorization: Bearer <token>`

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión y obtener el token |

### Clientes
| Método | Ruta | Descripción | Permiso |
|--------|------|-------------|---------|
| GET | `/api/clientes` | Listar todos | Logueado |
| GET | `/api/clientes/:id` | Obtener uno | Logueado |
| POST | `/api/clientes` | Crear | Logueado |
| PUT | `/api/clientes/:id` | Actualizar | Logueado |
| DELETE | `/api/clientes/:id` | Eliminar | Admin |

### Productos
| Método | Ruta | Descripción | Permiso |
|--------|------|-------------|---------|
| GET | `/api/productos` | Listar todos | Logueado |
| GET | `/api/productos/:id` | Obtener uno | Logueado |
| POST | `/api/productos` | Crear | Logueado |
| PUT | `/api/productos/:id` | Actualizar | Logueado |
| DELETE | `/api/productos/:id` | Eliminar | Admin |

### Pedidos
| Método | Ruta | Descripción | Permiso |
|--------|------|-------------|---------|
| GET | `/api/pedidos` | Listar todos | Logueado |
| GET | `/api/pedidos/:id` | Obtener uno | Logueado |
| POST | `/api/pedidos` | Crear | Logueado |
| PUT | `/api/pedidos/:id` | Actualizar | Logueado |
| DELETE | `/api/pedidos/:id` | Eliminar | Admin |

### Usuarios (solo administrador)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Listar todos |
| GET | `/api/usuarios/:id` | Obtener uno |
| POST | `/api/usuarios` | Crear |
| PUT | `/api/usuarios/:id` | Actualizar |
| DELETE | `/api/usuarios/:id` | Eliminar |

---

## 🔐 Seguridad

- **Contraseñas hasheadas** con bcrypt (nunca se almacenan en texto plano).
- **Autenticación con JWT**: el login devuelve un token que protege el resto de las rutas.
- **Roles**: `admin` (acceso total) y `vendedor` (no puede eliminar ni gestionar usuarios).
- **Validación de datos** de entrada con express-validator.
- **Rate limiting**: límite general de peticiones y un límite más estricto en el login para prevenir ataques de fuerza bruta.

---

## ⚙️ Instalación y ejecución local

### Requisitos previos
- Node.js instalado
- Una base de datos en MongoDB Atlas (o MongoDB local)

### 1. Clonar el repositorio
```bash
git clone https://github.com/agustinasc/backend-final.git
cd backend-final
```

### 2. Backend
```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de `backend/` con:
```
PORT=4000
MONGO_URI=tu_string_de_conexion_de_mongodb
JWT_SECRET=tu_clave_secreta
```

Crear el usuario administrador inicial (una sola vez):
```bash
node src/seed.js
```

Iniciar el servidor:
```bash
npm run dev
```
La API queda disponible en `http://localhost:4000`.

### 3. Frontend
Desde la raíz del proyecto, en otra terminal:
```bash
npm install
npm run dev
```
La aplicación queda disponible en `http://localhost:5173`.

> Para desarrollo local, el frontend apunta por defecto a `http://localhost:4000/api`. En producción se configura mediante la variable de entorno `VITE_API_URL`.

---

## 🧪 Pruebas con Postman

El repositorio incluye la colección de Postman con todas las peticiones de la API, lista para importar:

`backend/API-Panaderia.postman_collection.json`

La colección usa dos variables:
- `base_url` — la dirección de la API.
- `token` — se completa automáticamente al hacer login.

---

## ✨ Funcionalidades destacadas

- Gestión completa (CRUD) de clientes, productos, pedidos y usuarios.
- Sistema de login con roles diferenciados (administrador y vendedor).
- Carga de pedidos con varios productos, eligiendo la unidad (kg, unidad o lata) en cada ítem.
- Filtrado de pedidos por fecha de entrega.
- Generación de **órdenes de producción en PDF**, con el consolidado de producción del día y el detalle por cliente.

---

## 👩‍💻 Autora

**AgustinaSC**
Trabajo Práctico Integrador Final — Carrera Back End con Node.js

© 2026 AgustinaSC
