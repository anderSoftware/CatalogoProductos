# Sistema de Gestión de Productos

## Descripción General

Esta aplicación es un sistema de gestión de productos que permite a los administradores manejar un catálogo de productos mientras que los usuarios pueden visualizarlos y descargar sus fichas técnicas. La plataforma está desarrollada con Node.js, Express y MongoDB, ofreciendo una solución completa para la gestión de inventario y distribución de información técnica.

## Funcionalidades Principales

### Gestión de Usuarios
- **Sistema de Autenticación**: Registro e inicio de sesión de usuarios y administradores
- **Roles Diferenciados**: Separación clara entre usuarios regulares y administradores
- **Gestión de Sesiones**: Mantenimiento de sesiones con MongoDB como almacén

### Gestión de Productos
- **CRUD Completo**: Creación, lectura, actualización y desactivación lógica de productos
- **Gestión de Imágenes**: Carga y almacenamiento de imágenes de productos
- **Código Automático**: Generación automática de códigos secuenciales para productos

### Fichas Técnicas
- **Generación de PDF**: Creación automática de fichas técnicas en formato PDF
- **Captura de Leads**: Recolección de emails de usuarios interesados en un producto
- **Acceso Condicional**: Descarga directa para usuarios registrados, captura de email para visitantes

## Arquitectura del Sistema

### Backend
- **Express.js**: Framework para el servidor web
- **MongoDB**: Base de datos NoSQL para almacenamiento de datos
- **Mongoose**: ODM para modelado de datos
- **Multer**: Middleware para manejo de archivos (imágenes)
- **PDFKit**: Biblioteca para generación de documentos PDF
- **Bcrypt**: Encriptación segura de contraseñas
- **Express-session**: Gestión de sesiones de usuario

### Frontend
- **EJS**: Motor de plantillas para generar vistas HTML
- **JavaScript Vanilla**: Interactividad del lado del cliente
- **Fetch API**: Comunicación asíncrona con el servidor

## Modelos de Datos

### Usuario (`User`)
- **Atributos**: Nombre completo, email, contraseña (encriptada)
- **Funcionalidades**: Validación de contraseñas, encriptación automática

### Administrador (`Admin`)
- **Atributos**: Nombre completo, email, contraseña (encriptada)
- **Funcionalidades**: Validación de contraseñas, acceso al panel de administración

### Producto (`Product`)
- **Atributos**: Código (autogenerado), nombre, descripción, stock, precio, imagen, estado
- **Funcionalidades**: Generación automática de códigos secuenciales, marcas de tiempo

### Formulario de Ficha Técnica (`FichaTecnicaForm`)
- **Atributos**: Email (único)
- **Funcionalidades**: Registro de leads interesados en productos

## Flujos Principales

### Panel de Administración
1. El administrador inicia sesión
2. Accede al dashboard (`/dashboard`)
3. Puede crear, editar o desactivar productos
4. Las imágenes se almacenan en `/public/uploads/products/`

### Experiencia de Usuario
1. El usuario visita la página principal (`/`)
2. Visualiza el catálogo de productos activos
3. Al solicitar una ficha técnica:
   - Si está autenticado: descarga directa del PDF
   - Si es visitante: se le solicita su email antes de la descarga

### Generación de Fichas Técnicas
1. Se solicita la descarga mediante `/download-pdf/:id`
2. El sistema genera un PDF con PDFKit
3. El documento incluye:
   - Título y nombre del producto
   - Tabla con características detalladas
   - Información de fechas de creación/actualización

## Seguridad

- **Autenticación**: Verificación de credenciales mediante bcrypt
- **Middleware de Protección**: Rutas administrativas protegidas con `isAuthenticated`
- **Almacenamiento Seguro**: Contraseñas encriptadas con bcrypt
- **Validaciones**: Verificación de datos antes de procesamiento

## Instalación y Configuración

### Requisitos Previos
- Node.js y npm
- MongoDB
- Variables de entorno:
  - `MONGODB_URI`: URI de conexión a MongoDB
  - `SESSION_SECRET`: Clave secreta para sesiones
  - `PORT`: Puerto del servidor (por defecto 3000)

### Archivos Principales
- `app.js`: Punto de entrada de la aplicación
- `routes/`: Definición de rutas (mainRoutes.js, authRoutes.js)
- `models/`: Esquemas de datos
- `public/`: Archivos estáticos (CSS, JS, imágenes)
- `views/`: Plantillas EJS

## Características Destacadas

1. **Desactivación Lógica**: Los productos no se eliminan físicamente de la base de datos, sino que se marcan como inactivos
2. **Generación Automática de Códigos**: Sistema incremental para códigos de productos
3. **Interfaz Modal**: Para captura de emails de visitantes no registrados
4. **Sesiones Persistentes**: Almacenadas en MongoDB para mantener al usuario conectado
5. **Diseño Responsivo**: Adaptable a diferentes dispositivos

## Extensibilidad

El sistema está diseñado para ser fácilmente ampliado con:
- Categorías de productos
- Estadísticas de descargas
- Sistema de notificaciones
- Módulo de seguimiento de leads
- Integración con sistemas de email marketing

## Ejecución

El sistema está diseñado para ser fácilmente ejecutado con el siguiente comando:
- node app.js
