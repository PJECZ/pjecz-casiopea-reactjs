# 🏛️ pjecz-casiopea-reactjs

> Frontend del sistema de citas, que utilizará el público en general para agendar sus citas, consultarlas y cancelarlas.

---

## 📋 Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura de Ramas](#estructura-de-ramas)
- [Despliegue](#despliegue)
- [Contacto](#contacto)

---

## 📖 Descripción General
Es el _frontend_ del sistema de citas que se conecta por API-OAuth2 al _backend_. Permite al público en general, registrarse en el sistema, cambiar su contraseña, consultar las citas creadas, crear nuevas citas, cancelar citas antes de un tiempo considerable.

## 🛠️ Tecnologías Utilizadas
* **Lenguaje:** HTML, CSS, JavaScript
* **Framework:** React v19.1.0
* **Otros:** node.js

## ⚙️ Requisitos Previos
Lista de herramientas necesarias para correr el proyecto localmente:
- Git
- Node.js
- Acceso al _backend_ por la API-OAuth2

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio:

```bash
git clone https://github.com/PJECZ/pjecz-casiopea-reactjs.git
cd pjecz-casiopea-reactjs
```

### 2. Configurar variables de entorno:
Copia el archivo de ejemplo y edita las credenciales necesarias (API Keys):
```
cp .env.example .env
```

### 3. Instalar dependencias:
```bash
npm install
```

### 4. Iniciar el servidor de desarrollo:
```bash
npm start
```

## 🌿 Estructura de Ramas

Este proyecto sigue el flujo de trabajo institucional:
- `main`: Rama de producción (Solo código estable).
- `dev`: Rama de integración y pruebas (_Staging_).
- `feature/*`: Ramas temporales para nuevas funcionalidades.

Ver más sobre como contribuir: [CONTRIBUTING](CONTRIBUTING.md)

## 🚢 Despliegue

Después de hacer el _merge_ del PR en la rama `dev`, ir al servidor de _desarrollo_ y ejecutar el _script_

```bash
actualizar-proyecto-casiopea
```

Si detecta cambios, lo descarga de GitHub y hace una nueva construcción del proyecto.

---

## ✉️ Contacto

- **Departamento:** Dirección de Informática - PJECZ
- **Responsables:** Ing. Guillermo Valdés, Ing. Lucía Aranda e Ing. Ricardo Valdés

---

© 2026 Poder Judicial del Estado de Coahuila de Zaragoza.
