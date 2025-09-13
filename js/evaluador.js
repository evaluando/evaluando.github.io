const TAREAS_ASIGNADAS = ['Toxicológico', 'Clínico', 'Entrevista Medica', 'Recepción'];
const SEMANA_ACTUAL = 37;
const ASIGNACIONES_EVALUADOR = [];
let currentEvaluado = null;

// Función para mostrar el sub-sitio seleccionado
function showSubsite(subsiteId) {
    document.querySelectorAll('.subsite').forEach(subsite => {
        subsite.classList.remove('active');
    });
    document.getElementById(subsiteId).classList.add('active');

    // Inicializar sub-sitios al ser seleccionados
    if (subsiteId === 'tareasAsignadas') {
        generarTareasAsignadas();
    } else if (subsiteId === 'busquedaRegistros') {
        mostrarRegistros();
        document.getElementById('listaRegistros').style.display = 'block';
        document.getElementById('detalleRegistro').style.display = 'none';
    }
}

// Función para generar las tareas asignadas
function generarTareasAsignadas() {
    const listaTareas = document.getElementById('listaTareas');
    listaTareas.innerHTML = '';

    const ul = document.createElement('ul');
    const tareasAleatorias = TAREAS_ASIGNADAS.sort(() => 0.5 - Math.random());

    for (let i = 0; i < tareasAleatorias.length; i++) {
        const tarea = tareasAleatorias[i];
        const semanasIntervalo = Math.floor(Math.random() * 2) + 3; // 3 o 4 semanas
        const semanaInicio = SEMANA_ACTUAL + i * 4;
        const semanaFin = semanaInicio + semanasIntervalo;

        const p = document.createElement('p');
        p.textContent = `Semana ${semanaInicio} - Semana ${semanaFin}: ${tarea}`;
        ul.appendChild(p);
    }
    listaTareas.appendChild(ul);
}

// Sub-sitio: Registro de Evaluados

// Función para mostrar modal de limpiar
function limpiarFormulario() {
    document.getElementById('modalLimpiar').style.display = 'block';
}

// Función para cerrar modal
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Función para confirmar la limpieza del formulario
function confirmarLimpiar() {
    document.getElementById('evaluadoForm').reset();
    closeModal('modalLimpiar');
}

// Función para guardar el registro
function guardarRegistro() {
    const form = document.getElementById('evaluadoForm');


    const formData = new FormData(form);
    const registro = {};
    formData.forEach((value, key) => {
        registro[key] = value;
    });

    registro.id = Date.now();
    registro.resultado = 'No definido'; // Resultado inicial

    const registros = JSON.parse(localStorage.getItem('registrosEvaluados')) || [];
    registros.push(registro);
    localStorage.setItem('registrosEvaluados', JSON.stringify(registros));
    
    alert('Registro guardado exitosamente.');
    form.reset();
}

// Sub-sitio: Búsqueda de Registros

// Función para mostrar la lista de registros
function mostrarRegistros() {
    const registros = JSON.parse(localStorage.getItem('registrosEvaluados')) || [];
    const registrosList = document.getElementById('registrosList');
    registrosList.innerHTML = '';
    
    if (registros.length === 0) {
        registrosList.innerHTML = '<li>No hay registros para mostrar.</li>';
        return;
    }

    registros.forEach(registro => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" onclick="verDetalleRegistro(${registro.id})">
                ${registro.fechaEvaluacion} - ${registro.tipoEvaluacion} - ${registro.nombreEvaluado} - <strong>${registro.resultado}</strong>
            </a>
        `;
        registrosList.appendChild(li);
    });
}

// Función para ver el detalle de un registro
function verDetalleRegistro(id) {
    const registros = JSON.parse(localStorage.getItem('registrosEvaluados')) || [];
    currentEvaluado = registros.find(reg => reg.id === id);

    if (!currentEvaluado) return;

    document.getElementById('listaRegistros').style.display = 'none';
    document.getElementById('detalleRegistro').style.display = 'block';
    
    document.getElementById('infoRegistro').innerHTML = `
        <p><strong>Fecha:</strong> ${currentEvaluado.fechaEvaluacion}</p>
        <p><strong>Nombre:</strong> ${currentEvaluado.nombreEvaluado}</p>
        <p><strong>Correo:</strong> ${currentEvaluado.correoEvaluado}</p>
        <p><strong>Teléfono:</strong> ${currentEvaluado.telefonoEvaluado}</p>
        <p><strong>RFC:</strong> ${currentEvaluado.rfcEvaluado}</p>
        <p><strong>CURP:</strong> ${currentEvaluado.curpEvaluado}</p>
        <p><strong>Dependencia:</strong> ${currentEvaluado.dependenciaEvaluado}</p>
        <p><strong>CUIP:</strong> ${currentEvaluado.cuipEvaluado}</p>
        <p><strong>Tipo de Evaluación:</strong> ${currentEvaluado.tipoEvaluacion}</p>
    `;

    document.getElementById('resultadoEvaluacion').value = currentEvaluado.resultado || 'No aprobado';
    document.getElementById('notasEvaluacionEdit').value = currentEvaluado.notasEvaluacion || '';
}

// Función para guardar los cambios y regresar
function guardarCambiosRegistro() {
    if (!currentEvaluado) return;
    
    const resultado = document.getElementById('resultadoEvaluacion').value;
    const notas = document.getElementById('notasEvaluacionEdit').value;

    currentEvaluado.resultado = resultado;
    currentEvaluado.notasEvaluacion = notas;

    const registros = JSON.parse(localStorage.getItem('registrosEvaluados')) || [];
    const index = registros.findIndex(reg => reg.id === currentEvaluado.id);
    if (index !== -1) {
        registros[index] = currentEvaluado;
        localStorage.setItem('registrosEvaluados', JSON.stringify(registros));
    }

    alert('Cambios guardados exitosamente.');
    showSubsite('busquedaRegistros');
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    showSubsite('tareasAsignadas');
});