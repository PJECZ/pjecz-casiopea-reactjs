# Usa una imagen ligera de Node 22
FROM node:22-slim

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install

# Copiar el resto del código
COPY . .

# Definir las variables de entorno para producción
ENV REACT_APP_API_URL_BASE=http://localhost:9080
ENV REACT_APP_API_CACHE_DURATION=300000
ENV REACT_APP_API_TIMEOUT=3000

# Construir la aplicación para producción
RUN npm run build

# Instalar un servidor estático ligero
RUN npm install -g serve

# Cloud Run inyecta la variable PORT, pero definimos un default local
ENV PORT=3000

# Exponer el puerto (meramente informativo)
EXPOSE 3000

# Ejecutar la aplicación
CMD exec serve -s build -l ${PORT}
