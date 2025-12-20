# pjecz-casiopea-reactjs

Frontend del sistema de citas

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```env
# API URL base
REACT_APP_API_URL_BASE=http://127.0.0.1:8000

# Tiempo de cache para verificación de API (en milisegundos)
# Por defecto: 5 minutos (300000 ms)
REACT_APP_API_CACHE_DURATION=300000

# Timeout para verificación de conectividad (en milisegundos)
# Por defecto: 3 segundos (3000 ms)
REACT_APP_API_TIMEOUT=3000
```

## Instalación

Instalar las dependencias del proyecto:

```bash
npm install
```

## Ejecución en desarrollo

Iniciar el servidor de desarrollo:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`
