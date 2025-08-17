# 🏗️ Arquitectura del Sistema

## Visión General

PsicoClinic es una aplicación web full-stack construida con arquitectura MVC (Model-View-Controller) que proporciona una solución completa para la gestión de clínicas de psicopedagogía y psicología.

## Stack Tecnológico

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web minimalista
- **MySQL**: Base de datos relacional
- **JWT**: Autenticación basada en tokens
- **bcryptjs**: Encriptación de contraseñas
- **express-validator**: Validación de datos

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con glassmorphism
- **JavaScript ES6+**: Lógica del cliente
- **Fetch API**: Comunicación con el backend
- **Chart.js**: Gráficos y visualizaciones

### Herramientas de Desarrollo
- **Nodemon**: Recarga automática en desarrollo
- **Git**: Control de versiones
- **npm**: Gestión de paquetes

## Arquitectura de la Base de Datos

### Modelo Entidad-Relación

```
┌─────────────┐    1:1    ┌──────────────┐
│   USUARIOS  │◄─────────►│ PROFESIONALES│
│             │           │              │
│ - id (PK)   │           │ - id (PK)    │
│ - email     │           │ - usuario_id │
│ - password  │           │ - matricula  │
│ - nombre    │           │ - especialidad│
│ - apellido  │           │ - tarifa     │
│ - telefono  │           └──────────────┘
│ - rol       │                  │
│ - activo    │                  │ 1:N
└─────────────┘                  ▼
       │                 ┌──────────────┐
       │ 1:1             │   SESIONES   │
       ▼                 │              │
┌─────────────┐          │ - id (PK)    │
│  PACIENTES  │          │ - paciente_id│
│             │          │ - profesional│
│ - id (PK)   │◄────────►│ - fecha_hora │
│ - usuario_id│   1:N    │ - tipo       │
│ - fecha_nac │          │ - estado     │
│ - edad      │          │ - costo      │
│ - motivo    │          └──────────────┘
│ - obra_social│                │
└─────────────┘                │ 1:N
       │                       ▼
       │ 1:N            ┌──────────────┐
       └───────────────►│ EVALUACIONES │
                        │              │
                        │ - id (PK)    │
                        │ - paciente_id│
                        │ - profesional│
                        │ - sesion_id  │
                        │ - tipo       │
                        │ - resultados │
                        └──────────────┘
```

### Relaciones Clave

1. **USUARIOS ↔ PROFESIONALES**: Relación 1:1
2. **USUARIOS ↔ PACIENTES**: Relación 1:1
3. **PROFESIONALES ↔ SESIONES**: Relación 1:N
4. **PACIENTES ↔ SESIONES**: Relación 1:N
5. **SESIONES ↔ EVALUACIONES**: Relación 1:N (opcional)

## Arquitectura del Backend

### Estructura de Carpetas

```
backend/
├── config/
│   ├── database.js         # Configuración MySQL
│   ├── init.js            # Inicialización
│   └── createDatabase.sql # Script de BD
├── controllers/
│   ├── authController.js      # Autenticación
│   ├── usuarioController.js   # Gestión usuarios
│   ├── profesionalController.js
│   ├── pacienteController.js
│   ├── sesionController.js
│   └── evaluacionController.js
├── middlewares/
│   ├── auth.js            # Verificación JWT
│   └── validation.js      # Validaciones
├── models/
│   ├── Usuario.js         # Modelo de datos
│   ├── Profesional.js
│   ├── Paciente.js
│   ├── Sesion.js
│   └── Evaluacion.js
├── routes/
│   ├── authRoutes.js      # Rutas de auth
│   ├── usuarioRoutes.js
│   ├── profesionalRoutes.js
│   ├── pacienteRoutes.js
│   ├── sesionRoutes.js
│   └── evaluacionRoutes.js
└── server.js              # Punto de entrada
```

### Flujo de Datos

```
Cliente → Rutas → Middlewares → Controladores → Modelos → Base de Datos
   ↑                                                           ↓
   └─────────────── Respuesta JSON ←─────────────────────────┘
```

### Middlewares

1. **CORS**: Permite peticiones cross-origin
2. **express.json()**: Parsea JSON en requests
3. **express.static()**: Sirve archivos estáticos
4. **verifyToken**: Valida JWT tokens
5. **verifyRole**: Controla permisos por rol
6. **validation**: Valida datos de entrada

## Arquitectura del Frontend

### Estructura de Carpetas

```
frontend/
├── public/
│   ├── index.html         # Página principal
│   ├── styles/
│   │   └── main.css      # Estilos CSS
│   └── js/
│       ├── api.js        # Cliente API
│       ├── auth.js       # Gestión autenticación
│       ├── dashboard.js  # Lógica dashboard
│       ├── animations.js # Efectos visuales
│       └── main.js       # App principal
└── examples/
    └── api-examples.http # Ejemplos de API
```

### Componentes Principales

1. **AuthManager**: Gestión de autenticación y sesiones
2. **API**: Cliente para comunicación con backend
3. **DashboardManager**: Lógica del dashboard
4. **AnimationManager**: Efectos visuales y animaciones
5. **App**: Controlador principal de la aplicación

### Estados de la Aplicación

```javascript
// Estado global de autenticación
{
  isAuthenticated: boolean,
  currentUser: {
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    rol: 'profesional' | 'paciente'
  },
  token: string
}
```

## Patrones de Diseño Utilizados

### 1. MVC (Model-View-Controller)
- **Model**: Clases que manejan datos y lógica de negocio
- **View**: Interfaz de usuario (HTML/CSS/JS)
- **Controller**: Lógica de aplicación y coordinación

### 2. Repository Pattern
- Modelos encapsulan acceso a datos
- Métodos estáticos para operaciones CRUD
- Abstracción de la base de datos

### 3. Middleware Pattern
- Cadena de middlewares para procesamiento de requests
- Separación de responsabilidades
- Reutilización de código

### 4. Observer Pattern
- Event listeners para interacciones de usuario
- Notificaciones toast para feedback
- Actualizaciones reactivas de UI

## Seguridad

### Autenticación
- **JWT Tokens**: Stateless authentication
- **bcrypt**: Hash de contraseñas con salt
- **Expiración**: Tokens con tiempo de vida limitado

### Autorización
- **Role-based**: Permisos basados en roles
- **Resource-level**: Control granular de acceso
- **Ownership**: Usuarios solo acceden a sus datos

### Validación
- **Server-side**: Validación en backend con express-validator
- **Client-side**: Validación en frontend para UX
- **Sanitización**: Limpieza de datos de entrada

### Protección
- **CORS**: Configurado para dominios específicos
- **Rate Limiting**: Prevención de ataques de fuerza bruta
- **SQL Injection**: Uso de prepared statements

## Performance

### Backend
- **Connection Pooling**: Pool de conexiones MySQL
- **Async/Await**: Operaciones no bloqueantes
- **Indexing**: Índices en columnas frecuentemente consultadas
- **Compression**: Compresión gzip de respuestas

### Frontend
- **Lazy Loading**: Carga bajo demanda de datos
- **Caching**: Cache de respuestas API en localStorage
- **Debouncing**: Optimización de búsquedas
- **Minification**: CSS y JS minificados en producción

### Base de Datos
- **Normalization**: Base de datos normalizada (3NF)
- **Indexes**: Índices en claves foráneas y campos de búsqueda
- **Triggers**: Cálculo automático de campos derivados
- **Constraints**: Integridad referencial

## Escalabilidad

### Horizontal Scaling
- **Stateless Design**: Sin estado en servidor
- **Load Balancing**: Múltiples instancias de aplicación
- **Database Sharding**: Particionamiento de datos

### Vertical Scaling
- **Resource Optimization**: Uso eficiente de CPU/memoria
- **Query Optimization**: Consultas SQL optimizadas
- **Caching Layers**: Redis para cache distribuido

### Microservices (Futuro)
- **Service Decomposition**: Separación por dominio
- **API Gateway**: Punto único de entrada
- **Event-Driven**: Comunicación asíncrona

## Monitoreo y Logging

### Logging
```javascript
// Estructura de logs
{
  timestamp: "2024-01-01T10:00:00Z",
  level: "info|warn|error",
  message: "Descripción del evento",
  userId: 123,
  action: "login|create|update|delete",
  resource: "usuario|paciente|sesion",
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

### Métricas
- **Response Time**: Tiempo de respuesta de APIs
- **Error Rate**: Tasa de errores por endpoint
- **Throughput**: Requests por segundo
- **Database Performance**: Tiempo de consultas

## Testing Strategy

### Unit Tests
```javascript
// Ejemplo de test de modelo
describe('Usuario Model', () => {
  test('should create user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      nombre: 'Test',
      apellido: 'User',
      rol: 'profesional'
    };
    
    const user = await Usuario.create(userData);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Should be hashed
  });
});
```

### Integration Tests
```javascript
// Ejemplo de test de API
describe('Auth API', () => {
  test('POST /api/auth/login should return token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'dr.martinez@clinica.com',
        password: 'password'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

### E2E Tests
```javascript
// Ejemplo con Playwright
test('user can login and view dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#email', 'dr.martinez@clinica.com');
  await page.fill('#password', 'password');
  await page.click('#loginBtn');
  
  await expect(page.locator('#pageTitle')).toHaveText('Dashboard');
});
```

## Deployment Architecture

### Development
```
Developer → Git → Local Environment
                      ↓
                 npm run dev
                      ↓
              http://localhost:3000
```

### Production
```
Git Repository → CI/CD Pipeline → Production Server
                      ↓
                 Build & Test
                      ↓
              Deploy to Cloud Platform
                      ↓
              https://psicoclinic.com
```

### Infrastructure
- **Web Server**: Node.js + Express
- **Database**: MySQL 8.0+
- **Reverse Proxy**: Nginx (opcional)
- **SSL**: Let's Encrypt o Cloudflare
- **CDN**: Cloudflare para assets estáticos
- **Monitoring**: Uptime monitoring + Error tracking