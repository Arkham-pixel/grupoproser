# 🚀 Plataforma PROSER - Documentación Completa

## 📋 Índice General

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Funcionalidades Principales](#funcionalidades-principales)
4. [Gestión de Usuarios](#gestión-de-usuarios)
5. [Reportes y Casos](#reportes-y-casos)
6. [Sistema de Emails](#sistema-de-emails)
7. [Gestión de Sesiones](#gestión-de-sesiones)
8. [Configuración Técnica](#configuración-técnica)
9. [Despliegue y Producción](#despliegue-y-producción)
10. [Mantenimiento](#mantenimiento)

---

## 🎯 Descripción General

### **Propósito**
Plataforma web para gestión integral de casos de seguros, siniestros y riesgos para PROSER Puertos. Permite el seguimiento completo de casos desde su creación hasta su resolución final.

### **Características Principales**
- ✅ **Gestión de Casos Complex**: Manejo completo de siniestros complejos
- ✅ **Gestión de Riesgos**: Administración de casos de riesgo
- ✅ **Sistema de Responsables**: Asignación y seguimiento de casos
- ✅ **Reportes Avanzados**: Múltiples tipos de reportes con filtros
- ✅ **Sistema de Emails**: Notificaciones automáticas
- ✅ **Gestión de Usuarios**: Roles y permisos
- ✅ **Sesiones Seguras**: Control de acceso y timeout automático

---

## 🏗️ Arquitectura del Sistema

### **Frontend (React + Vite)**
```
frontend/
├── src/
│   ├── components/           # Componentes React
│   │   ├── SubcomponenteCompex/     # Formularios Complex
│   │   ├── SubcomponenteCuenta/     # Gestión de cuentas
│   │   ├── SubcomponenteRiesgo/     # Gestión de riesgos
│   │   ├── SubcomponenteMaquinaria/ # Reportes de maquinaria
│   │   └── ReportePol/              # Reportes de pólizas
│   ├── services/            # Servicios API
│   ├── context/             # Contextos React
│   ├── hooks/               # Hooks personalizados
│   └── config/              # Configuraciones
```

### **Backend (Node.js + Express)**
```
backend/
├── controllers/             # Lógica de negocio
├── models/                  # Modelos MongoDB
├── routes/                  # Rutas API
├── middleware/              # Middlewares
├── services/                # Servicios (email, etc.)
└── db/                     # Configuración de base de datos
```

### **Base de Datos (MongoDB)**
- **Colecciones Principales**:
  - `securUsers`: Usuarios del sistema
  - `siniestros`: Casos de siniestros
  - `casosRiesgo`: Casos de riesgo
  - `estados`: Estados de casos
  - `aseguradoras`: Información de aseguradoras
  - `responsables`: Responsables de casos

---

## ⚙️ Funcionalidades Principales

### **1. Gestión de Casos Complex**

#### **Características:**
- ✅ **Creación de Casos**: Formulario completo con todos los campos necesarios
- ✅ **Edición de Casos**: Modificación de casos existentes
- ✅ **Seguimiento**: Historial completo de cambios
- ✅ **Adjuntos**: Carga de documentos y archivos
- ✅ **Estados**: Control de estados del caso
- ✅ **Responsables**: Asignación de responsables

#### **Campos del Formulario:**
- **Datos Generales**: Número de ajuste, siniestro, póliza
- **Información del Asegurado**: Datos personales y de contacto
- **Detalles del Siniestro**: Descripción, causa, ubicación
- **Valores y Prestaciones**: Montos, reservas, indemnizaciones
- **Fechas Importantes**: Asignación, inspección, informes
- **Observaciones**: Comentarios y seguimiento
- **Adjuntos**: Documentos y archivos relacionados

### **2. Gestión de Riesgos**

#### **Características:**
- ✅ **Casos de Riesgo**: Creación y gestión de casos de riesgo
- ✅ **Áreas y Equipos**: Gestión de áreas afectadas y equipos
- ✅ **Clasificación**: Categorización de riesgos
- ✅ **Seguimiento**: Control de avances y estados
- ✅ **Reportes**: Generación de reportes específicos

#### **Funcionalidades Específicas:**
- **Activación de Riesgo**: Proceso de activación de casos
- **Datos Precargados**: Información automática del sistema
- **Facturación**: Gestión de facturación de casos
- **Seguimiento**: Control de avances y pendientes

### **3. Sistema de Responsables**

#### **Características:**
- ✅ **Asignación Automática**: Asignación de casos a responsables
- ✅ **Filtrado por Responsable**: Visualización de casos asignados
- ✅ **Notificaciones**: Emails automáticos al asignar casos
- ✅ **Seguimiento**: Control de carga de trabajo

#### **Funcionalidades:**
- **Reporte de Responsables**: Vista específica de casos asignados
- **Filtros Avanzados**: Por fecha, estado, aseguradora
- **Exportación**: Generación de reportes en Excel
- **Edición Directa**: Modificación de casos desde el reporte

---

## 👥 Gestión de Usuarios

### **Sistema de Roles**

#### **1. Usuario Normal (`usuario`)**
- ✅ **Acceso Limitado**: Solo casos asignados
- ✅ **Reporte de Responsables**: Vista de casos propios
- ✅ **Edición de Perfil**: Modificación de datos personales
- ✅ **Cambio de Contraseña**: Gestión de credenciales

#### **2. Soporte (`soporte`)**
- ✅ **Acceso Ampliado**: Todos los reportes
- ✅ **Gestión de Usuarios**: Administración de cuentas
- ✅ **Prueba de Emails**: Testing de funcionalidad de emails
- ✅ **Configuración de Sesión**: Ajustes de timeout

#### **3. Administrador (`admin`)**
- ✅ **Acceso Total**: Todas las funcionalidades
- ✅ **Gestión Completa**: Creación, edición, eliminación de usuarios
- ✅ **Configuración del Sistema**: Ajustes globales
- ✅ **Reportes Administrativos**: Estadísticas y métricas

### **Funcionalidades de Usuario**

#### **Autenticación:**
- ✅ **Login Seguro**: Autenticación con JWT
- ✅ **2FA**: Autenticación de dos factores
- ✅ **Sesiones**: Control de sesiones activas
- ✅ **Logout**: Cierre seguro de sesión

#### **Gestión de Perfil:**
- ✅ **Editar Cuenta**: Modificación de datos personales
- ✅ **Cambiar Contraseña**: Actualización de credenciales
- ✅ **Eliminar Cuenta**: Eliminación de cuenta (solo admin)
- ✅ **Editar Perfil de Usuario**: Administración de otros usuarios

---

## 📊 Reportes y Casos

### **1. Reporte Complex**

#### **Características:**
- ✅ **Vista General**: Todos los casos complex
- ✅ **Filtros Avanzados**: Por fecha, estado, responsable, aseguradora
- ✅ **Paginación Inteligente**: Sin paginación cuando hay filtro de responsable
- ✅ **Exportación Excel**: Generación de reportes
- ✅ **Edición Directa**: Modificación desde el reporte
- ✅ **Historial de Documentos**: Seguimiento de archivos

#### **Filtros Disponibles:**
- **Fecha**: Rango de fechas de asignación
- **Estado**: Estado actual del caso
- **Responsable**: Persona asignada al caso
- **Aseguradora**: Compañía de seguros
- **Intermediario**: Intermediario del caso

### **2. Reporte de Responsables**

#### **Características:**
- ✅ **Vista Personalizada**: Solo casos asignados al usuario
- ✅ **Sin Paginación**: Todos los casos en una vista
- ✅ **Filtros Específicos**: Por fecha, estado, aseguradora
- ✅ **Exportación**: Reportes en Excel
- ✅ **Edición Directa**: Modificación de casos

#### **Funcionalidades Específicas:**
- **Filtrado Automático**: Solo muestra casos del usuario
- **Ordenamiento**: Del más nuevo al más antiguo
- **Acciones Rápidas**: Editar y eliminar casos
- **Información Detallada**: Todos los campos relevantes

### **3. Reporte de Riesgos**

#### **Características:**
- ✅ **Casos de Riesgo**: Vista específica de riesgos
- ✅ **Filtros Avanzados**: Por responsable, estado, fecha
- ✅ **Paginación Inteligente**: Sin paginación con filtro de responsable
- ✅ **Exportación**: Reportes en Excel
- ✅ **Edición Directa**: Modificación de casos

#### **Campos Específicos:**
- **Clasificación de Riesgo**: Tipo de riesgo
- **Áreas Afectadas**: Zonas impactadas
- **Equipos**: Equipos involucrados
- **Estado del Riesgo**: Estado actual
- **Seguimiento**: Avances y pendientes

### **4. Reportes Especializados**

#### **Reporte de Maquinaria:**
- ✅ **Descripción de Bienes**: Detalles de maquinaria
- ✅ **Estado General**: Condición de equipos
- ✅ **Protección**: Medidas de protección
- ✅ **Registro Fotográfico**: Imágenes de equipos
- ✅ **Recomendaciones**: Observaciones y sugerencias

#### **Reporte de Pólizas:**
- ✅ **Datos del Asegurado**: Información personal
- ✅ **Datos Generales**: Información de la póliza
- ✅ **Detalle de Inspección**: Resultados de inspección
- ✅ **Documentos Adjuntos**: Archivos relacionados
- ✅ **Firmas**: Firmas digitales

---

## 📧 Sistema de Emails

### **Configuración**

#### **Servicio de Email:**
- ✅ **Nodemailer**: Servicio de envío de emails
- ✅ **Configuración SMTP**: Servidor de correo configurado
- ✅ **Plantillas**: Emails con formato profesional
- ✅ **Variables Dinámicas**: Información personalizada

#### **Tipos de Emails:**

#### **1. Asignación de Casos**
- ✅ **Destinatarios**: Responsable, creador del caso, emails específicos
- ✅ **Contenido**: Información del caso, responsable, fechas
- ✅ **Emails Específicos**: 
  - `etapia@proserpuertos.com.co`
  - `aatapia@proserpuertos.com.co`
  - `itapia9@proserpuertos.com.co`

#### **2. Email a Funcionario de Aseguradora**
- ✅ **Destinatario**: Funcionario de la aseguradora
- ✅ **Contenido**: Nombre, email y teléfono del responsable
- ✅ **Información Básica**: Datos del caso

#### **3. Prueba de Email**
- ✅ **Acceso**: Solo usuarios con rol "soporte"
- ✅ **Funcionalidad**: Testing del sistema de emails
- ✅ **Configuración**: Ajustes de servidor SMTP

### **Configuración de Variables de Entorno:**
```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación
JWT_SECRET=secreto_super_seguro
```

---

## 🔐 Gestión de Sesiones

### **Sistema de Timeout Automático**

#### **Configuración:**
- ✅ **Duración de Sesión**: 30 minutos por defecto
- ✅ **Advertencia**: 5 minutos antes del timeout
- ✅ **Detección de Inactividad**: Mouse, teclado, scroll, touch
- ✅ **Reinicio Automático**: Al detectar actividad

#### **Funcionalidades:**

#### **1. Detección de Inactividad**
- ✅ **Eventos Monitoreados**: 
  - Movimiento del mouse
  - Pulsaciones de teclado
  - Scroll de página
  - Eventos táctiles
  - Cambio de foco de ventana

#### **2. Sistema de Advertencias**
- ✅ **Modal de Advertencia**: 5 minutos antes del timeout
- ✅ **Botones de Acción**: Continuar sesión o cerrar
- ✅ **Diseño Responsivo**: Adaptable a diferentes pantallas

#### **3. Cierre Automático**
- ✅ **Timeout**: Cierre automático después de 30 minutos
- ✅ **Limpieza**: Eliminación de datos de sesión
- ✅ **Redirección**: Vuelta al login

#### **4. Configuración de Sesión**
- ✅ **Acceso**: Solo admin y soporte
- ✅ **Ajustes**: Duración de sesión y advertencia
- ✅ **Persistencia**: Configuración guardada

### **Componentes de Sesión:**

#### **SessionManager.js**
```javascript
// Gestión principal de sesiones
- init(): Inicialización del sistema
- resetTimer(): Reinicio del timer
- showWarning(): Mostrar advertencia
- logout(): Cerrar sesión
- showNotification(): Mostrar notificaciones
```

#### **SessionIndicator.jsx**
```javascript
// Indicador visual de sesión
- Tiempo restante visible
- Estado de la sesión
- Acceso rápido a configuración
```

#### **SessionSettings.jsx**
```javascript
// Configuración de sesión
- Duración de sesión
- Tiempo de advertencia
- Guardado de configuración
```

---

## ⚙️ Configuración Técnica

### **Frontend (React + Vite)**

#### **Dependencias Principales:**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.0",
  "xlsx": "^0.18.5",
  "tailwindcss": "^3.2.0"
}
```

#### **Configuración de Vite:**
```javascript
// vite.config.js
export default {
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

### **Backend (Node.js + Express)**

#### **Dependencias Principales:**
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "nodemailer": "^6.9.1",
  "cors": "^2.8.5",
  "multer": "^1.4.5"
}
```

#### **Configuración de Base de Datos:**
```javascript
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

### **Variables de Entorno (.env)**
```env
# Base de Datos
MONGODB_URI=mongodb://localhost:27017/proser

# JWT
JWT_SECRET=secreto_super_seguro

# Email
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación

# Servidor
PORT=5000
NODE_ENV=production
```

---

## 🚀 Despliegue y Producción

### **Configuración de PM2**

#### **ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: 'backend-proser',
      script: './backend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'frontend-proser',
      script: 'serve',
      args: '-s build -l 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### **Configuración de Nginx**

#### **nginx_config.conf:**
```nginx
server {
    listen 80;
    server_name aplicacion.grupoproser.com.co;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name aplicacion.grupoproser.com.co;
    
    ssl_certificate /etc/letsencrypt/live/aplicacion.grupoproser.com.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aplicacion.grupoproser.com.co/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **SSL con Let's Encrypt**
```bash
# Instalación de Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtención de certificado
sudo certbot --nginx -d aplicacion.grupoproser.com.co

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔧 Mantenimiento

### **Comandos Útiles**

#### **Gestión de PM2:**
```bash
# Ver procesos
pm2 list

# Reiniciar procesos
pm2 restart all

# Ver logs
pm2 logs

# Monitoreo
pm2 monit
```

#### **Gestión de Nginx:**
```bash
# Verificar configuración
sudo nginx -t

# Recargar configuración
sudo systemctl reload nginx

# Ver estado
sudo systemctl status nginx
```

#### **Gestión de Base de Datos:**
```bash
# Conectar a MongoDB
mongo

# Ver bases de datos
show dbs

# Usar base de datos
use proser

# Ver colecciones
show collections
```

### **Backups**

#### **Base de Datos:**
```bash
# Backup completo
mongodump --db proser --out /backup/$(date +%Y%m%d)

# Restaurar backup
mongorestore --db proser /backup/20250115/proser/
```

#### **Archivos:**
```bash
# Backup de archivos
tar -czf backup_$(date +%Y%m%d).tar.gz /var/www/proser/

# Restaurar archivos
tar -xzf backup_20250115.tar.gz -C /var/www/
```

### **Monitoreo**

#### **Logs del Sistema:**
```bash
# Logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs de PM2
pm2 logs

# Logs del sistema
sudo journalctl -u nginx -f
```

#### **Métricas de Rendimiento:**
- **CPU**: Monitoreo de uso de procesador
- **Memoria**: Uso de RAM
- **Disco**: Espacio disponible
- **Red**: Ancho de banda utilizado

---

## 📈 Estadísticas y Métricas

### **Uso del Sistema**
- **Usuarios Activos**: ~50 usuarios
- **Casos Mensuales**: ~200 casos
- **Emails Enviados**: ~500 emails/mes
- **Archivos Subidos**: ~1000 archivos/mes

### **Rendimiento**
- **Tiempo de Carga**: < 3 segundos
- **Disponibilidad**: 99.9%
- **Tamaño de Base de Datos**: ~2GB
- **Backup Diario**: Automático

---

## 🔒 Seguridad

### **Medidas Implementadas**
- ✅ **HTTPS**: Conexión segura con SSL
- ✅ **JWT**: Tokens de autenticación seguros
- ✅ **Bcrypt**: Encriptación de contraseñas
- ✅ **CORS**: Control de acceso entre dominios
- ✅ **Validación**: Validación de datos de entrada
- ✅ **Sanitización**: Limpieza de datos
- ✅ **Rate Limiting**: Limitación de requests
- ✅ **Logs de Seguridad**: Registro de actividades

### **Políticas de Seguridad**
- **Contraseñas**: Mínimo 8 caracteres, mayúsculas, números
- **Sesiones**: Timeout automático de 30 minutos
- **Acceso**: Solo usuarios autorizados
- **Backups**: Diarios y encriptados
- **Actualizaciones**: Regulares de dependencias

---

## 📞 Soporte Técnico

### **Contactos**
- **Desarrollo**: Equipo de desarrollo interno
- **Soporte**: Administradores del sistema
- **Emergencias**: Contacto directo con administradores

### **Procedimientos**
1. **Reporte de Problemas**: Formulario interno
2. **Escalación**: Según severidad del problema
3. **Resolución**: Tiempo máximo 24 horas
4. **Seguimiento**: Confirmación de resolución

---

## 🎯 Roadmap Futuro

### **Próximas Funcionalidades**
- 🔄 **Dashboard Analítico**: Métricas y estadísticas
- 🔄 **API Pública**: Integración con sistemas externos
- 🔄 **App Móvil**: Aplicación móvil nativa
- 🔄 **Chat en Tiempo Real**: Comunicación instantánea
- 🔄 **Inteligencia Artificial**: Predicción de casos
- 🔄 **Integración con CRM**: Conexión con sistemas CRM

### **Mejoras Técnicas**
- 🔄 **Microservicios**: Arquitectura distribuida
- 🔄 **Cache Redis**: Mejora de rendimiento
- 🔄 **CDN**: Distribución de contenido
- 🔄 **Docker**: Containerización completa
- 🔄 **CI/CD**: Pipeline de despliegue automático

---

## 📝 Notas Finales

### **Información Técnica**
- **Versión Actual**: 2.0.0
- **Última Actualización**: Mayo 2025
- **Lenguajes**: JavaScript (Node.js), React
- **Base de Datos**: MongoDB
- **Servidor Web**: Nginx
- **SSL**: Let's Encrypt

### **Créditos**
- **Desarrollo**: Oscar Javier Atencia Oliva
- **Diseño**: Equipo de UX/UI (Oscar Javier Atencia Oliva)
- **Infraestructura**: Administradores de sistemas (Oscar Javier Atencia Oliva)
- **Soporte**: Equipo técnico(Oscar Javier Atencia Oliva)
- **Creador de todo el proyecto** : Oscar Javier Atencia Oliva
---

*Documentación actualizada al 15 de Enero de 2025*
*Versión del documento: 2.0.0* 