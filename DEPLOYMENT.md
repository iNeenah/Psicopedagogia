# 🚀 Guía de Despliegue

## Despliegue Local

### Prerrequisitos
- Node.js v14+
- MySQL 8.0+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/iNeenah/Psicopedagogia.git
cd Psicopedagogia
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```bash
# Crear base de datos en MySQL
# Ejecutar script: config/createDatabase.sql
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus datos
```

5. **Iniciar aplicación**
```bash
npm run dev
```

## Despliegue en Producción

### Heroku

1. **Preparar aplicación**
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login a Heroku
heroku login

# Crear aplicación
heroku create psicopedagogia-app
```

2. **Configurar base de datos**
```bash
# Agregar addon de MySQL
heroku addons:create jawsdb:kitefin

# Obtener URL de conexión
heroku config:get JAWSDB_URL
```

3. **Configurar variables de entorno**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_clave_secreta_produccion
```

4. **Desplegar**
```bash
git push heroku main
```

### Railway

1. **Conectar repositorio**
- Ve a [Railway](https://railway.app)
- Conecta tu repositorio de GitHub
- Selecciona el proyecto

2. **Configurar variables**
```
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_clave_secreta
DB_HOST=tu_host_mysql
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=clinica_psicopedagogia
```

3. **Desplegar automáticamente**
- Railway desplegará automáticamente en cada push

### Vercel + PlanetScale

1. **Base de datos en PlanetScale**
```bash
# Instalar CLI de PlanetScale
npm install -g @planetscale/cli

# Crear base de datos
pscale database create psicopedagogia

# Obtener string de conexión
pscale connect psicopedagogia main
```

2. **Desplegar en Vercel**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Configurar variables de entorno en dashboard de Vercel
```

## Variables de Entorno Requeridas

```env
# Servidor
PORT=3000
NODE_ENV=production

# Base de datos
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=clinica_psicopedagogia

# JWT
JWT_SECRET=clave_secreta_muy_segura
JWT_EXPIRES_IN=24h
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Verificar base de datos
node check-users.js

# Probar API
node test-api.ps1  # Windows
./test-api.sh      # Linux/Mac

# Actualizar contraseñas
node update-passwords.js
```

## Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar conexión
node check-users.js

# Recrear datos
node reset-data.js
```

### Error de CORS
```javascript
// En server.js, configurar CORS para producción
app.use(cors({
  origin: ['https://tu-dominio.com'],
  credentials: true
}));
```

### Error de Variables de Entorno
```bash
# Verificar que .env existe y tiene todas las variables
cat .env

# Verificar que las variables se cargan
node -e "require('dotenv').config(); console.log(process.env.DB_HOST)"
```

## Monitoreo y Logs

### Heroku
```bash
# Ver logs
heroku logs --tail

# Acceder a consola
heroku run bash
```

### Railway
- Los logs están disponibles en el dashboard
- Métricas automáticas de CPU y memoria

### Vercel
- Logs en tiempo real en el dashboard
- Analytics automáticos

## Backup de Base de Datos

```bash
# Crear backup
mysqldump -u usuario -p clinica_psicopedagogia > backup.sql

# Restaurar backup
mysql -u usuario -p clinica_psicopedagogia < backup.sql
```

## SSL/HTTPS

### Let's Encrypt (para VPS)
```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com
```

### Cloudflare (recomendado)
1. Agregar dominio a Cloudflare
2. Configurar DNS
3. Habilitar SSL/TLS automático
4. Configurar reglas de página para optimización

## Optimizaciones de Producción

### Compresión
```javascript
// En server.js
const compression = require('compression');
app.use(compression());
```

### Cache
```javascript
// Headers de cache para archivos estáticos
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```