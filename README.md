# 🏥 API RESTful - Clínica de Psicopedagogía y Psicología

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

## 📋 Descripción

API RESTful completa desarrollada con **Node.js**, **Express.js** y **MySQL** para la gestión integral de una clínica de psicopedagogía y psicología. 

Sistema diseñado para manejar profesionales, pacientes, sesiones terapéuticas y evaluaciones psicológicas con autenticación JWT y control de roles.

## ✨ Características Principales

- 🔐 **Autenticación JWT** con roles diferenciados (profesional/paciente)
- 📊 **CRUD completo** para todas las entidades del sistema
- ✅ **Validaciones robustas** con express-validator
- 🗄️ **Base de datos MySQL** completamente normalizada
- 🛡️ **Middlewares de seguridad** y control de autorización
- 📡 **API RESTful** con códigos de estado HTTP apropiados
- 🏗️ **Arquitectura MVC** bien estructurada y escalable
- 📈 **Sistema de estadísticas** para profesionales y pacientes
- 🕐 **Gestión de horarios** y disponibilidad de profesionales
- 📋 **Historial clínico** completo por paciente
- 🌐 **Interfaz web moderna** con dashboard interactivo y efectos glassmorphism
- 📱 **Diseño responsive** para todos los dispositivos
- 🎨 **Estética moderna** con gradientes violeta/turquesa y animaciones suaves
- ✨ **Efectos visuales avanzados** con partículas, blur y transiciones

## Estructura del Proyecto
```
├── config/
│   ├── database.js          # Configuración de MySQL
│   └── createTables.sql     # Script de creación de tablas
├── controllers/             # Controladores de la aplicación
├── middlewares/            # Middlewares de autenticación y validación
├── models/                 # Modelos de datos
├── routes/                 # Rutas de la API
├── .env                    # Variables de entorno
├── package.json           # Dependencias del proyecto
├── server.js              # Punto de entrada de la aplicación
└── README.md              # Documentación
```

## 🏗️ Arquitectura del Sistema

### Entidades Principales

| Entidad | Descripción | Relaciones |
|---------|-------------|------------|
| **👥 USUARIOS** | Tabla principal con roles (profesional/paciente) | Base para profesionales y pacientes |
| **👨‍⚕️ PROFESIONALES** | Psicólogos y psicopedagogos con matrícula y especialidad | 1:1 con USUARIOS |
| **👤 PACIENTES** | Información clínica y datos del responsable | 1:1 con USUARIOS |
| **📅 SESIONES** | Citas terapéuticas con estado y tipo | N:1 con PACIENTES y PROFESIONALES |
| **📋 EVALUACIONES** | Informes psicológicos y seguimientos | N:1 con PACIENTES y PROFESIONALES |

### Modelo de Datos

```
USUARIOS (1:1) ──→ PROFESIONALES
    │                    │
    │                    │ (1:N)
    │                    ▼
    │               SESIONES ←── (N:1) ── PACIENTES ←── (1:1) ── USUARIOS
    │                    │                    │
    │                    │ (1:N)              │ (1:N)
    │                    ▼                    ▼
    └─────────────→ EVALUACIONES ←───────────┘
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/iNeenah/Psicopedagogia.git
cd Psicopedagogia
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
```bash
# 1. Crear base de datos en MySQL
# 2. Ejecutar el script completo en MySQL Workbench:
#    config/createDatabase.sql
```

### 4. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=clinica_psicopedagogia
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=24h
```

### 5. Ejecutar la aplicación
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

### 6. Verificar instalación
```bash
# Probar conexión a base de datos
node check-users.js

# Probar API completa
# En PowerShell:
.\test-api.ps1
```

### 7. Acceder a la aplicación
Una vez que el servidor esté corriendo:
- **Interfaz Web**: http://localhost:3000
- **API REST**: http://localhost:3000/api

#### Cuentas de demostración:
- **Profesional**: `dr.martinez@clinica.com` / `password`
- **Profesional**: `dra.lopez@clinica.com` / `password`  
- **Paciente**: `maria.gonzalez@email.com` / `password`

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario
- `POST /api/auth/change-password` - Cambiar contraseña
- `GET /api/auth/verify` - Verificar token

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/search` - Buscar usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Desactivar usuario

### Profesionales
- `POST /api/profesionales` - Crear profesional
- `GET /api/profesionales` - Obtener todos los profesionales
- `GET /api/profesionales/:id` - Obtener profesional por ID
- `GET /api/profesionales/user/:userId` - Obtener profesional por usuario ID
- `GET /api/profesionales/:id/horarios` - Obtener horarios del profesional
- `GET /api/profesionales/:id/estadisticas` - Obtener estadísticas
- `PUT /api/profesionales/:id` - Actualizar profesional
- `DELETE /api/profesionales/:id` - Desactivar profesional

### Pacientes
- `POST /api/pacientes` - Crear paciente
- `GET /api/pacientes` - Obtener todos los pacientes
- `GET /api/pacientes/:id` - Obtener paciente por ID
- `GET /api/pacientes/user/:userId` - Obtener paciente por usuario ID
- `GET /api/pacientes/:id/historial` - Obtener historial del paciente
- `GET /api/pacientes/:id/estadisticas` - Obtener estadísticas
- `PUT /api/pacientes/:id` - Actualizar paciente
- `DELETE /api/pacientes/:id` - Desactivar paciente

### Sesiones
- `POST /api/sesiones` - Crear sesión
- `GET /api/sesiones` - Obtener todas las sesiones
- `GET /api/sesiones/proximas` - Obtener sesiones próximas
- `GET /api/sesiones/disponibilidad` - Verificar disponibilidad
- `GET /api/sesiones/estadisticas` - Obtener estadísticas
- `GET /api/sesiones/:id` - Obtener sesión por ID
- `PUT /api/sesiones/:id` - Actualizar sesión
- `DELETE /api/sesiones/:id` - Eliminar sesión

### Evaluaciones
- `POST /api/evaluaciones` - Crear evaluación
- `GET /api/evaluaciones` - Obtener todas las evaluaciones
- `GET /api/evaluaciones/estadisticas` - Obtener estadísticas
- `GET /api/evaluaciones/paciente/:pacienteId` - Evaluaciones por paciente
- `GET /api/evaluaciones/profesional/:profesionalId` - Evaluaciones por profesional
- `GET /api/evaluaciones/:id` - Obtener evaluación por ID
- `PUT /api/evaluaciones/:id` - Actualizar evaluación
- `DELETE /api/evaluaciones/:id` - Eliminar evaluación

## Autenticación y Autorización

### JWT Token
Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

### Roles y Permisos
- **Profesionales**: Pueden gestionar sus pacientes, sesiones y evaluaciones
- **Pacientes**: Solo pueden ver sus propios datos y historial

## Validaciones

### Registro de Usuario
- Email válido y único
- Contraseña mínimo 6 caracteres
- Nombre y apellido entre 2-50 caracteres
- Rol debe ser 'profesional' o 'paciente'

### Profesionales
- Matrícula única de 3-20 caracteres
- Especialidad: 'psicologo', 'psicopedagogo' o 'ambos'
- Años de experiencia: 0-50
- Tarifa debe ser número positivo

### Pacientes
- Fecha de nacimiento válida
- Motivo de consulta: 10-500 caracteres

### Sesiones
- IDs de paciente y profesional válidos
- Fecha y hora en formato ISO8601
- Tipo de sesión válido
- Duración entre 15-180 minutos

### Evaluaciones
- Tipo de evaluación válido
- Resultados mínimo 10 caracteres
- Áreas evaluadas válidas

## Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `500` - Internal Server Error

## Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.martinez@clinica.com",
    "password": "123456",
    "nombre": "Carlos",
    "apellido": "Martínez",
    "telefono": "1234567890",
    "rol": "profesional"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.martinez@clinica.com",
    "password": "123456"
  }'
```

### Crear Sesión
```bash
curl -X POST http://localhost:3000/api/sesiones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "paciente_id": 1,
    "profesional_id": 1,
    "fecha_hora": "2024-02-15T10:00:00",
    "tipo_sesion": "evaluacion",
    "duracion_minutos": 60,
    "costo": 5000
  }'
```

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos
- **mysql2** - Driver de MySQL
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 🌐 Interfaz Web Moderna

La aplicación incluye una **interfaz web de última generación** con:

### 🎨 **Diseño Visual Avanzado**
- **Glassmorphism**: Efectos de cristal con `backdrop-filter` y transparencias
- **Gradientes modernos**: Paleta violeta/turquesa con transiciones suaves
- **Animaciones fluidas**: Efectos de hover, transiciones y partículas animadas
- **Bordes redondeados**: Diseño orgánico con esquinas suaves (16px-24px)

### ✨ **Efectos Interactivos**
- **Partículas animadas** en el fondo del login
- **Efectos ripple** en botones al hacer clic
- **Hover effects** con elevación y sombras dinámicas
- **Animaciones escalonadas** para carga de elementos

### 📱 **Experiencia de Usuario**
- **Responsive design** optimizado para todos los dispositivos
- **Dashboard interactivo** con estadísticas en tiempo real
- **Navegación intuitiva** con sidebar glassmorphism
- **Notificaciones toast** con diseño moderno
- **Carga rápida** con lazy loading y optimizaciones

### 🔐 **Autenticación Elegante**
- **Login glassmorphism** con fondo de partículas
- **Cuentas de demostración** con un solo clic
- **Validación en tiempo real** con feedback visual
- **Estados de carga** con spinners animados

## 📸 Capturas de Pantalla

### Login con Efectos de Partículas
![Login Screen](docs/login-screen.png)

### Dashboard Glassmorphism
![Dashboard](docs/dashboard.png)

### Gestión de Profesionales
![Professionals](docs/professionals.png)

## Licencia

Este proyecto está bajo la Licencia MIT.