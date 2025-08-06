module.exports = {
  apps: [
    {
      name: 'grupo-proser-backend',
      script: './backend/server.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        MONGO_URI: 'mongodb+srv://webmaster:pOsxJIyGI07HpW8c@cluster0.p85rti4.mongodb.net/GrupoProser?retryWrites=true&w=majority',
        SECONDARY_DB_URI: 'mongodb+srv://webmaster:pOsxJIyGI07HpW8c@cluster0.p85rti4.mongodb.net/GrupoProserSecundario?retryWrites=true&w=majority',
        EMAIL_USER: 'danalyst@proserpuertos.com.co',
        EMAIL_PASS: 'tu_password_aqui',
        JWT_SECRET: 'tu_secreto_jwt_super_seguro',
        EMAIL_SERVICE: 'gmail',
        CORS_ORIGIN: 'http://localhost:5173'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGO_URI: 'mongodb+srv://webmaster:pOsxJIyGI07HpW8c@cluster0.p85rti4.mongodb.net/GrupoProser?retryWrites=true&w=majority',
        SECONDARY_DB_URI: 'mongodb+srv://webmaster:pOsxJIyGI07HpW8c@cluster0.p85rti4.mongodb.net/GrupoProserSecundario?retryWrites=true&w=majority',
        EMAIL_USER: 'danalyst@proserpuertos.com.co',
        EMAIL_PASS: 'tu_password_aqui',
        JWT_SECRET: 'tu_secreto_jwt_super_seguro',
        EMAIL_SERVICE: 'gmail',
        CORS_ORIGIN: 'http://localhost:5173'
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    },
    {
      name: 'grupo-proser-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './frontend/dist',
        PM2_SERVE_PORT: 5173,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true
    }
  ]
};