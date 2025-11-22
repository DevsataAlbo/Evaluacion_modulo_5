# TaskFlow - Gestión de Tareas Colaborativa

Aplicación web completa para gestionar tareas de forma colaborativa, implementada con JavaScript moderno usando los paradigmas de Orientación a Objetos, Orientación a Eventos y Programación Asíncrona.

## Instalación

Clona el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd "Modulo 5/Tarea 10"
```

## Ejecutar en local

Abre el archivo `index.html` en tu navegador.

Se recomienda usar Live Server para evitar problemas con CORS al cargar el archivo JSON.

## Paradigmas Implementados

### 1. Orientación a Objetos

**Clases ES6 creadas:**

- **Usuario** (app.js:9-30): Representa usuarios del sistema con autenticación
- **Tarea** (app.js:35-88): Representa tareas con propiedades y métodos
- **Auth** (app.js:93-158): Gestiona autenticación y registro de usuarios
- **GestorTareas** (app.js:163-241): CRUD completo de tareas
- **App** (app.js:249-573): Controlador principal de la aplicación

### 2. Orientación a Eventos

**Event Listeners implementados (app.js:268-291):**

- Submit de formularios (login, registro, tareas)
- Click en botones (nueva tarea, cargar tareas, cerrar sesión)
- Change en filtros (estado, prioridad)
- Input en búsqueda (filtrado en tiempo real)

### 3. Programación Asíncrona

**Async/Await y Promises:**

- **Auth.registrar()** (app.js:101-116): Registro asíncrono con Promise
- **Auth.iniciarSesion()** (app.js:118-133): Login asíncrono con Promise
- **GestorTareas.cargarTareasIniciales()** (app.js:168-183): Fetch con async/await

## Funcionalidades

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión con validación
- Sesión persistente en localStorage
- Cierre de sesión

### Gestión de Tareas (CRUD Completo)
- **Crear** nuevas tareas
- **Leer** y listar todas las tareas
- **Actualizar** tareas existentes
- **Eliminar** tareas

### Asignación de Tareas
- Asignar tareas a usuarios registrados
- Ver tareas asignadas a cada usuario
- Cambiar asignación de tareas

### Estados y Prioridades
- Estados: Pendiente, En Progreso, Completada
- Prioridades: Alta, Media, Baja
- Marcar tareas como completadas
- Cambiar estado de tareas

### Filtros y Búsqueda
- Filtrar por estado
- Filtrar por prioridad
- Búsqueda por texto (título y descripción)
- Filtros en tiempo real

### Estadísticas y Dashboard
- Total de tareas
- Tareas pendientes
- Tareas en progreso
- Tareas completadas
- Barra de progreso general

### Persistencia de Datos
- localStorage para usuarios
- localStorage para tareas
- localStorage para sesión activa

### API Externa Simulada
- Carga de 6 tareas iniciales desde JSON
- Simulación de llamada asíncrona con fetch
- Manejo de errores de red

## Estructura del Proyecto

```
Tarea 10/
├── index.html (Interfaz completa)
├── assets/
│   ├── data/
│   │   └── tareas-iniciales.json (6 tareas de ejemplo)
│   ├── estilos/
│   │   └── style.css (Estilos profesionales)
│   └── scripts/
│       └── app.js (580+ líneas de código)
```

## Estructura del Código (app.js)

```
app.js (580 líneas)
├── Clases ES6 (Líneas 1-241)
│   ├── Usuario
│   ├── Tarea
│   ├── Auth
│   └── GestorTareas
│
└── Clase App (Líneas 249-573)
    ├── Gestión de eventos
    ├── Autenticación
    ├── CRUD de tareas
    ├── Renderizado de UI
    ├── Filtros y búsqueda
    └── Estadísticas
```

## Tecnologías

- JavaScript ES6+
- Programación Orientada a Objetos
- Event-Driven Programming
- Async/Await y Promises
- Fetch API
- localStorage API
- Bootstrap 5.3.0
- CSS3

## Uso de la Aplicación

### Primer uso:

1. Abre `index.html` en tu navegador
2. Click en "Regístrate aquí"
3. Completa el formulario de registro
4. Inicia sesión con tus credenciales

### Gestión de tareas:

1. Click en "Cargar Tareas desde API" para cargar 6 tareas de ejemplo
2. Click en "Nueva Tarea" para crear una tarea
3. Usa los filtros para organizar las tareas
4. Click en "Editar" para modificar una tarea
5. Click en "Completar" para marcar como completada
6. Click en "Eliminar" para borrar una tarea

## Credenciales de Prueba

No hay usuarios por defecto. Debes registrar tu propio usuario al iniciar la aplicación por primera vez.

## Características Técnicas

- ✅ Código modular y bien estructurado
- ✅ Separación de responsabilidades (clases)
- ✅ Uso adecuado del DOM
- ✅ Event delegation
- ✅ Manejo de errores robusto
- ✅ Validación de formularios
- ✅ UI/UX profesional
- ✅ Responsive design
- ✅ Persistencia de datos
- ✅ Sin dependencias externas (solo Bootstrap para UI)
