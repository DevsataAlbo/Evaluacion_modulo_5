// =====================================================
// PARADIGMA: ORIENTACIÓN A OBJETOS - Clases ES6
// =====================================================

/**
 * Clase Usuario - Representa a un usuario del sistema
 */
class Usuario {
    constructor(nombre, email, password, rol = 'usuario') {
        this.nombre = nombre;
        this.email = email;
        this.password = password; // En producción debería estar hasheada
        this.rol = rol;
        this.fecha_registro = new Date();
    }

    toJSON() {
        return {
            nombre: this.nombre,
            email: this.email,
            password: this.password,
            rol: this.rol,
            fecha_registro: this.fecha_registro
        };
    }

    static fromJSON(json) {
        const usuario = new Usuario(json.nombre, json.email, json.password, json.rol);
        usuario.fecha_registro = new Date(json.fecha_registro);
        return usuario;
    }
}

/**
 * Clase Tarea - Representa una tarea del sistema
 */
class Tarea {
    constructor(titulo, descripcion, prioridad, asignado_a) {
        this.id = Date.now();
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.prioridad = prioridad; // alta, media, baja
        this.estado = 'pendiente'; // pendiente, en-progreso, completada
        this.asignado_a = asignado_a;
        this.fecha_creacion = new Date();
        this.fecha_vencimiento = null;
        this.fecha_completada = null;
        this.etiquetas = [];
    }

    marcarCompletada() {
        this.estado = 'completada';
        this.fecha_completada = new Date();
    }

    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    agregarEtiqueta(etiqueta) {
        if (!this.etiquetas.includes(etiqueta)) {
            this.etiquetas.push(etiqueta);
        }
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            descripcion: this.descripcion,
            prioridad: this.prioridad,
            estado: this.estado,
            asignado_a: this.asignado_a,
            fecha_creacion: this.fecha_creacion.toISOString(),
            fecha_vencimiento: this.fecha_vencimiento ? this.fecha_vencimiento.toISOString() : null,
            fecha_completada: this.fecha_completada ? this.fecha_completada.toISOString() : null,
            etiquetas: this.etiquetas
        };
    }

    static fromJSON(json) {
        const tarea = new Tarea(json.titulo, json.descripcion, json.prioridad, json.asignado_a);
        tarea.id = json.id;
        tarea.estado = json.estado;
        tarea.fecha_creacion = new Date(json.fecha_creacion);
        tarea.fecha_vencimiento = json.fecha_vencimiento ? new Date(json.fecha_vencimiento) : null;
        tarea.fecha_completada = json.fecha_completada ? new Date(json.fecha_completada) : null;
        tarea.etiquetas = json.etiquetas || [];
        return tarea;
    }
}

/**
 * Clase Auth - Gestiona la autenticación de usuarios
 */
class Auth {
    constructor() {
        this.usuarioActual = null;
        this.cargarSesion();
    }

    async registrar(nombre, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const usuarios = this.obtenerUsuarios();

                if (usuarios.find(u => u.email === email)) {
                    reject(new Error('El email ya está registrado'));
                    return;
                }

                const nuevoUsuario = new Usuario(nombre, email, password);
                usuarios.push(nuevoUsuario.toJSON());
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                resolve({ success: true, mensaje: 'Usuario registrado exitosamente' });
            }, 500);
        });
    }

    async iniciarSesion(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const usuarios = this.obtenerUsuarios();
                const usuario = usuarios.find(u => u.email === email && u.password === password);

                if (!usuario) {
                    reject(new Error('Credenciales incorrectas'));
                    return;
                }

                this.usuarioActual = Usuario.fromJSON(usuario);
                localStorage.setItem('sesion', JSON.stringify(usuario));
                resolve({ success: true, usuario: this.usuarioActual });
            }, 500);
        });
    }

    cerrarSesion() {
        this.usuarioActual = null;
        localStorage.removeItem('sesion');
    }

    cargarSesion() {
        const sesion = localStorage.getItem('sesion');
        if (sesion) {
            this.usuarioActual = Usuario.fromJSON(JSON.parse(sesion));
        }
    }

    obtenerUsuarios() {
        const usuarios = localStorage.getItem('usuarios');
        return usuarios ? JSON.parse(usuarios) : [];
    }

    estaAutenticado() {
        return this.usuarioActual !== null;
    }
}

/**
 * Clase GestorTareas - Gestiona todas las tareas del sistema
 */
class GestorTareas {
    constructor() {
        this.tareas = [];
        this.cargarTareas();
    }

    async cargarTareasIniciales() {
        try {
            const response = await fetch('assets/data/tareas-iniciales.json');
            if (!response.ok) throw new Error('Error al cargar tareas iniciales');

            const data = await response.json();
            const tareasExistentes = this.tareas.length;

            data.tareas.forEach(tareaData => {
                if (!this.tareas.find(t => t.id === tareaData.id)) {
                    this.tareas.push(Tarea.fromJSON(tareaData));
                }
            });

            this.guardarTareas();
            return { success: true, nuevas: this.tareas.length - tareasExistentes };
        } catch (error) {
            console.error('Error al cargar tareas iniciales:', error);
            throw error;
        }
    }

    crear(tarea) {
        this.tareas.push(tarea);
        this.guardarTareas();
        return tarea;
    }

    editar(id, datosActualizados) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            Object.assign(tarea, datosActualizados);
            this.guardarTareas();
            return true;
        }
        return false;
    }

    eliminar(id) {
        const index = this.tareas.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tareas.splice(index, 1);
            this.guardarTareas();
            return true;
        }
        return false;
    }

    obtenerPorId(id) {
        return this.tareas.find(t => t.id === id);
    }

    obtenerTodas() {
        return [...this.tareas];
    }

    obtenerPorUsuario(email) {
        return this.tareas.filter(t => t.asignado_a === email);
    }

    obtenerEstadisticas() {
        return {
            total: this.tareas.length,
            pendientes: this.tareas.filter(t => t.estado === 'pendiente').length,
            enProgreso: this.tareas.filter(t => t.estado === 'en-progreso').length,
            completadas: this.tareas.filter(t => t.estado === 'completada').length,
            alta: this.tareas.filter(t => t.prioridad === 'alta').length,
            media: this.tareas.filter(t => t.prioridad === 'media').length,
            baja: this.tareas.filter(t => t.prioridad === 'baja').length
        };
    }

    guardarTareas() {
        const tareasJSON = this.tareas.map(t => t.toJSON());
        localStorage.setItem('tareas', JSON.stringify(tareasJSON));
    }

    cargarTareas() {
        const tareas = localStorage.getItem('tareas');
        if (tareas) {
            this.tareas = JSON.parse(tareas).map(t => Tarea.fromJSON(t));
        }
    }
}

// =====================================================
// PARADIGMA: ORIENTACIÓN A EVENTOS - Gestión de la UI
// =====================================================

class App {
    constructor() {
        this.auth = new Auth();
        this.gestorTareas = new GestorTareas();
        this.tareaEditando = null;

        this.init();
    }

    init() {
        if (this.auth.estaAutenticado()) {
            this.mostrarDashboard();
        } else {
            this.mostrarLogin();
        }

        this.configurarEventos();
    }

    configurarEventos() {
        // Eventos de autenticación
        const formLogin = document.getElementById('form-login');
        const formRegistro = document.getElementById('form-registro');

        if (formLogin) {
            formLogin.addEventListener('submit', (e) => this.manejarLogin(e));
        }

        if (formRegistro) {
            formRegistro.addEventListener('submit', (e) => this.manejarRegistro(e));
        }

        // Botones de navegación
        document.getElementById('btn-mostrar-registro')?.addEventListener('click', () => this.mostrarFormularioRegistro());
        document.getElementById('btn-mostrar-login')?.addEventListener('click', () => this.mostrarFormularioLogin());
        document.getElementById('btn-cerrar-sesion')?.addEventListener('click', () => this.cerrarSesion());

        // Eventos de tareas
        document.getElementById('btn-nueva-tarea')?.addEventListener('click', () => this.mostrarModalTarea());
        document.getElementById('btn-cargar-tareas')?.addEventListener('click', () => this.cargarTareasIniciales());
        document.getElementById('form-tarea')?.addEventListener('submit', (e) => this.guardarTarea(e));

        // Filtros
        document.getElementById('filtro-estado')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filtro-prioridad')?.addEventListener('change', () => this.aplicarFiltros());
        document.getElementById('filtro-buscar')?.addEventListener('input', () => this.aplicarFiltros());
    }

    async manejarLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            this.mostrarLoading(true);
            await this.auth.iniciarSesion(email, password);
            this.mostrarLoading(false);
            this.mostrarDashboard();
        } catch (error) {
            this.mostrarLoading(false);
            this.mostrarNotificacion(error.message, 'danger');
        }
    }

    async manejarRegistro(e) {
        e.preventDefault();
        const nombre = document.getElementById('registro-nombre').value;
        const email = document.getElementById('registro-email').value;
        const password = document.getElementById('registro-password').value;

        try {
            this.mostrarLoading(true);
            await this.auth.registrar(nombre, email, password);
            this.mostrarLoading(false);
            this.mostrarNotificacion('Usuario registrado exitosamente. Ahora puedes iniciar sesión.', 'success');
            this.mostrarFormularioLogin();
        } catch (error) {
            this.mostrarLoading(false);
            this.mostrarNotificacion(error.message, 'danger');
        }
    }

    cerrarSesion() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            this.auth.cerrarSesion();
            this.mostrarLogin();
        }
    }

    async cargarTareasIniciales() {
        try {
            this.mostrarLoading(true, 'Cargando tareas desde API...');
            const resultado = await this.gestorTareas.cargarTareasIniciales();
            this.mostrarLoading(false);
            this.mostrarNotificacion(`${resultado.nuevas} tareas cargadas desde la API`, 'success');
            this.renderizarTareas();
            this.actualizarEstadisticas();
        } catch (error) {
            this.mostrarLoading(false);
            this.mostrarNotificacion('Error al cargar tareas desde la API', 'danger');
        }
    }

    mostrarLogin() {
        document.getElementById('vista-auth').style.display = 'block';
        document.getElementById('vista-dashboard').style.display = 'none';
        this.mostrarFormularioLogin();
    }

    mostrarFormularioLogin() {
        document.getElementById('formulario-login').style.display = 'block';
        document.getElementById('formulario-registro').style.display = 'none';
    }

    mostrarFormularioRegistro() {
        document.getElementById('formulario-login').style.display = 'none';
        document.getElementById('formulario-registro').style.display = 'block';
    }

    mostrarDashboard() {
        document.getElementById('vista-auth').style.display = 'none';
        document.getElementById('vista-dashboard').style.display = 'block';
        document.getElementById('nombre-usuario').textContent = this.auth.usuarioActual.nombre;
        this.renderizarTareas();
        this.actualizarEstadisticas();
        this.cargarUsuariosEnSelect();
    }

    renderizarTareas(tareas = null) {
        const listaTareas = tareas || this.gestorTareas.obtenerTodas();
        const container = document.getElementById('lista-tareas');
        container.innerHTML = '';

        if (listaTareas.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No hay tareas para mostrar</p></div>';
            return;
        }

        listaTareas.forEach(tarea => {
            const card = this.crearTarjetaTarea(tarea);
            container.appendChild(card);
        });
    }

    crearTarjetaTarea(tarea) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-3';

        const badgePrioridad = {
            'alta': 'danger',
            'media': 'warning',
            'baja': 'info'
        }[tarea.prioridad];

        const badgeEstado = {
            'pendiente': 'secondary',
            'en-progreso': 'primary',
            'completada': 'success'
        }[tarea.estado];

        col.innerHTML = `
            <div class="card h-100 tarea-card">
                <div class="card-header d-flex justify-content-between">
                    <span class="badge bg-${badgePrioridad}">${tarea.prioridad.toUpperCase()}</span>
                    <span class="badge bg-${badgeEstado}">${tarea.estado.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${tarea.titulo}</h5>
                    <p class="card-text text-muted">${tarea.descripcion}</p>
                    <div class="mt-2">
                        <small class="text-muted">Asignado a: <strong>${tarea.asignado_a}</strong></small>
                    </div>
                    ${tarea.etiquetas.length > 0 ? `
                        <div class="mt-2">
                            ${tarea.etiquetas.map(e => `<span class="badge bg-light text-dark">${e}</span>`).join(' ')}
                        </div>
                    ` : ''}
                </div>
                <div class="card-footer">
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-primary" onclick="app.editarTarea(${tarea.id})">Editar</button>
                        <button class="btn btn-sm btn-${tarea.estado === 'completada' ? 'secondary' : 'success'}"
                                onclick="app.cambiarEstadoTarea(${tarea.id})"
                                ${tarea.estado === 'completada' ? 'disabled' : ''}>
                            ${tarea.estado === 'completada' ? 'Completada' : 'Completar'}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.eliminarTarea(${tarea.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    mostrarModalTarea(tarea = null) {
        this.tareaEditando = tarea;
        const modal = new bootstrap.Modal(document.getElementById('modalTarea'));
        const titulo = document.getElementById('modal-tarea-titulo');
        const form = document.getElementById('form-tarea');

        if (tarea) {
            titulo.textContent = 'Editar Tarea';
            document.getElementById('tarea-titulo').value = tarea.titulo;
            document.getElementById('tarea-descripcion').value = tarea.descripcion;
            document.getElementById('tarea-prioridad').value = tarea.prioridad;
            document.getElementById('tarea-estado').value = tarea.estado;
            document.getElementById('tarea-asignado').value = tarea.asignado_a;
        } else {
            titulo.textContent = 'Nueva Tarea';
            form.reset();
        }

        modal.show();
    }

    guardarTarea(e) {
        e.preventDefault();

        const datos = {
            titulo: document.getElementById('tarea-titulo').value,
            descripcion: document.getElementById('tarea-descripcion').value,
            prioridad: document.getElementById('tarea-prioridad').value,
            estado: document.getElementById('tarea-estado').value,
            asignado_a: document.getElementById('tarea-asignado').value
        };

        if (this.tareaEditando) {
            this.gestorTareas.editar(this.tareaEditando.id, datos);
            this.mostrarNotificacion('Tarea actualizada exitosamente', 'success');
        } else {
            const nuevaTarea = new Tarea(datos.titulo, datos.descripcion, datos.prioridad, datos.asignado_a);
            nuevaTarea.estado = datos.estado;
            this.gestorTareas.crear(nuevaTarea);
            this.mostrarNotificacion('Tarea creada exitosamente', 'success');
        }

        bootstrap.Modal.getInstance(document.getElementById('modalTarea')).hide();
        this.renderizarTareas();
        this.actualizarEstadisticas();
    }

    editarTarea(id) {
        const tarea = this.gestorTareas.obtenerPorId(id);
        if (tarea) {
            this.mostrarModalTarea(tarea);
        }
    }

    cambiarEstadoTarea(id) {
        const tarea = this.gestorTareas.obtenerPorId(id);
        if (tarea && tarea.estado !== 'completada') {
            tarea.marcarCompletada();
            this.gestorTareas.guardarTareas();
            this.mostrarNotificacion('Tarea marcada como completada', 'success');
            this.renderizarTareas();
            this.actualizarEstadisticas();
        }
    }

    eliminarTarea(id) {
        if (confirm('¿Estás seguro que deseas eliminar esta tarea?')) {
            this.gestorTareas.eliminar(id);
            this.mostrarNotificacion('Tarea eliminada exitosamente', 'success');
            this.renderizarTareas();
            this.actualizarEstadisticas();
        }
    }

    aplicarFiltros() {
        const estado = document.getElementById('filtro-estado').value;
        const prioridad = document.getElementById('filtro-prioridad').value;
        const busqueda = document.getElementById('filtro-buscar').value.toLowerCase();

        let tareas = this.gestorTareas.obtenerTodas();

        if (estado !== 'todas') {
            tareas = tareas.filter(t => t.estado === estado);
        }

        if (prioridad !== 'todas') {
            tareas = tareas.filter(t => t.prioridad === prioridad);
        }

        if (busqueda) {
            tareas = tareas.filter(t =>
                t.titulo.toLowerCase().includes(busqueda) ||
                t.descripcion.toLowerCase().includes(busqueda)
            );
        }

        this.renderizarTareas(tareas);
    }

    actualizarEstadisticas() {
        const stats = this.gestorTareas.obtenerEstadisticas();

        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-pendientes').textContent = stats.pendientes;
        document.getElementById('stat-progreso').textContent = stats.enProgreso;
        document.getElementById('stat-completadas').textContent = stats.completadas;

        // Actualizar barra de progreso
        const porcentaje = stats.total > 0 ? (stats.completadas / stats.total) * 100 : 0;
        const barraProgreso = document.getElementById('barra-progreso');
        barraProgreso.style.width = `${porcentaje}%`;
        barraProgreso.textContent = `${porcentaje.toFixed(0)}%`;
    }

    cargarUsuariosEnSelect() {
        const select = document.getElementById('tarea-asignado');
        const usuarios = this.auth.obtenerUsuarios();

        select.innerHTML = '';
        usuarios.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.email;
            option.textContent = `${usuario.nombre} (${usuario.email})`;
            select.appendChild(option);
        });
    }

    mostrarLoading(mostrar, mensaje = 'Procesando...') {
        const overlay = document.getElementById('loading-overlay');
        if (mostrar) {
            overlay.querySelector('p').textContent = mensaje;
            overlay.style.display = 'flex';
        } else {
            overlay.style.display = 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const container = document.getElementById('notificaciones');
        const notif = document.createElement('div');
        notif.className = `alert alert-${tipo} alert-dismissible fade show`;
        notif.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        container.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 5000);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});
