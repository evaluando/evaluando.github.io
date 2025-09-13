// Funciones de utilidad para fechas
const getWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

const getRandomDate = (start, end) => {
    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    while (!getWeekday(date)) {
        date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    return date;
};

// Datos para simulación
const TIPOS_EVALUACION = ['Toxicológico', 'Clínico', 'Entrevista Medica', 'Recepción'];
let citas = [];
let evaluaciones = [];

// Funciones para cada sub-sitio
function showSubsite(subsiteId) {
    document.querySelectorAll('.subsite').forEach(subsite => subsite.classList.remove('active'));
    document.getElementById(subsiteId).classList.add('active');
    
    // Inicializar contenido al cambiar de sub-sitio
    if (subsiteId === 'agenda') {
        generarAgenda();
    } else if (subsiteId === 'estatusEvaluacion') {
        generarEstatusEvaluaciones();
    } else if (subsiteId === 'encuestaSatisfaccion') {
        mostrarEncuestasDisponibles();
    }
}

// Sub-sitio: Agenda
function generarAgenda() {
    citas = [];
    const fechaActual = new Date();
    const dosMesesDespues = new Date();
    dosMesesDespues.setMonth(fechaActual.getMonth() + 2);

    // Citas programadas (Septiembre - Noviembre)
    const citasProgramadasDiv = document.getElementById('citasProgramadas');
    citasProgramadasDiv.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const fechaAleatoria = getRandomDate(fechaActual, dosMesesDespues);
        const tipoAleatorio = TIPOS_EVALUACION[Math.floor(Math.random() * TIPOS_EVALUACION.length)];
        const cita = {
            id: 'p' + Date.now() + i,
            fecha: fechaAleatoria.toLocaleDateString('es-ES'),
            tipo: tipoAleatorio
        };
        citas.push(cita);
        const p = document.createElement('p');
        p.textContent = `${cita.fecha} - ${cita.tipo}`;
        citasProgramadasDiv.appendChild(p);
    }

    // Citas reagendadas (Agosto)
    const citasReagendadasDiv = document.getElementById('citasReagendadas');
    citasReagendadasDiv.innerHTML = '';

    const agostoInicio = new Date(2025, 7, 1);
    const agostoFin = new Date(2025, 7, 31);
    
    for (let i = 0; i < 2; i++) {
        const fechaAleatoria = getRandomDate(agostoInicio, agostoFin);
        const tipoAleatorio = TIPOS_EVALUACION[Math.floor(Math.random() * TIPOS_EVALUACION.length)];
        const cita = {
            id: 'r' + Date.now() + i,
            fecha: fechaAleatoria.toLocaleDateString('es-ES'),
            tipo: tipoAleatorio,
            reagendada: false
        };
        citas.push(cita);
        const p = document.createElement('p');
        p.innerHTML = `
            ${cita.fecha} - ${cita.tipo} 
            <button class="btn-reagendar" onclick="openReagendarModal('${cita.id}')">Reagendar</button>
        `;
        citasReagendadasDiv.appendChild(p);
    }
}

let citaActualId = null;

function openReagendarModal(id) {
    citaActualId = id;
    const cita = citas.find(c => c.id === id);
    if (!cita) return;

    const infoDiv = document.getElementById('reagendarInfo');
    infoDiv.innerHTML = `<p><strong>Fecha original:</strong> ${cita.fecha}<br><strong>Tipo:</strong> ${cita.tipo}</p>`;
    document.getElementById('modalReagendar').style.display = 'block';
}

function reagendarCita() {
    const nuevaFecha = document.getElementById('nuevaFecha').value;
    const justificante = document.getElementById('justificante').value;

    if (!nuevaFecha || !justificante) {
        alert("Por favor, ingrese una nueva fecha y un justificante.");
        return;
    }

    // Lógica para eliminar la cita del listado
    const citaIndex = citas.findIndex(c => c.id === citaActualId);
    if (citaIndex !== -1) {
        citas.splice(citaIndex, 1);
        alert("Cita reagendada con éxito.");
        closeModal('modalReagendar');
        generarAgenda(); // Vuelve a cargar el listado de agenda
    }
}

// Sub-sitio: Estatus de Evaluaciones
function generarEstatusEvaluaciones() {
    evaluaciones = [];
    const evaluacionesDiv = document.getElementById('evaluacionesEstatus');
    evaluacionesDiv.innerHTML = '';

    const estatusList = ['En proceso', 'Retenido', 'Terminado'];
    const estatusColores = {
        'En proceso': 'status-en-proceso',
        'Retenido': 'status-retenido',
        'Terminado': 'status-terminado'
    };
    
    const enero2025 = new Date(2025, 0, 1);
    const agosto2025 = new Date(2025, 7, 31);
    
    for (let i = 0; i < 8; i++) {
        const fechaAleatoria = getRandomDate(enero2025, agosto2025);
        const tipoAleatorio = TIPOS_EVALUACION[Math.floor(Math.random() * TIPOS_EVALUACION.length)];
        const estatusAleatorio = estatusList[Math.floor(Math.random() * estatusList.length)];
        
        const evaluacion = {
            id: Date.now() + i,
            fecha: fechaAleatoria.toLocaleDateString('es-ES'),
            tipo: tipoAleatorio,
            estatus: estatusAleatorio,
            encuestaCompleta: false
        };
        evaluaciones.push(evaluacion);
        
        const p = document.createElement('p');
        p.innerHTML = `
            ${evaluacion.fecha} - ${evaluacion.tipo} - <span class="status ${estatusColores[evaluacion.estatus]}">${evaluacion.estatus}</span>
        `;
        evaluacionesDiv.appendChild(p);
    }
}

// Sub-sitio: Encuesta de Satisfacción
function mostrarEncuestasDisponibles() {
    const evaluacionesDiv = document.getElementById('evaluacionesEncuesta');
    evaluacionesDiv.innerHTML = '';
    document.getElementById('encuestaFormulario').style.display = 'none';
    document.getElementById('encuestaListado').style.display = 'block';

    const pendientes = evaluaciones.filter(e => e.estatus !== 'Retenido' && !e.encuestaCompleta);
    
    if (pendientes.length === 0) {
        evaluacionesDiv.innerHTML = '<p>No hay evaluaciones disponibles para realizar la encuesta.</p>';
        return;
    }

    pendientes.forEach(evaluacion => {
        const p = document.createElement('p');
        p.innerHTML = `
            ${evaluacion.fecha} - ${evaluacion.tipo} - <span class="status status-en-proceso">${evaluacion.estatus}</span>
            <a href="#" onclick="iniciarEncuesta('${evaluacion.id}')">Realizar Encuesta</a>
        `;
        evaluacionesDiv.appendChild(p);
    });
}

let encuestaActualId = null;

function iniciarEncuesta(id) {
    encuestaActualId = id;
    const evaluacion = evaluaciones.find(e => e.id == id);
    if (!evaluacion) return;

    document.getElementById('encuestaTitulo').textContent = `${evaluacion.fecha} - ${evaluacion.tipo}`;
    document.getElementById('encuestaListado').style.display = 'none';
    document.getElementById('encuestaFormulario').style.display = 'block';
}

function finalizarEncuesta(event) {
    event.preventDefault();
    const evaluacionIndex = evaluaciones.findIndex(e => e.id == encuestaActualId);
    if (evaluacionIndex !== -1) {
        evaluaciones[evaluacionIndex].encuestaCompleta = true;
    }
    
    alert('Encuesta finalizada. ¡Gracias!');
    document.getElementById('formEncuesta').reset();
    showSubsite('encuestaSatisfaccion'); // Regresar a la lista
}

// Evento de inicio
document.addEventListener('DOMContentLoaded', () => {
    showSubsite('agenda');
    document.getElementById('formEncuesta').addEventListener('submit', finalizarEncuesta);
});

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}