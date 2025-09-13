// Función para mostrar el sub-sitio seleccionado
function showSubsite(subsiteId) {
    const subsites = document.querySelectorAll('.subsite');
    subsites.forEach(subsite => {
        subsite.classList.remove('active');
    });
    document.getElementById(subsiteId).classList.add('active');
}

// Datos de los evaluadores y áreas
const evaluadores = [
    { nombre: 'Ana', apellido: 'García' },
    { nombre: 'Pedro', apellido: 'López' },
    { nombre: 'Sofía', apellido: 'Martínez' },
    { nombre: 'Javier', apellido: 'Pérez' },
    { nombre: 'Isabel', apellido: 'Rodríguez' },
    { nombre: 'Daniel', apellido: 'Sánchez' },
    { nombre: 'Laura', apellido: 'Fernández' },
    { nombre: 'Carlos', apellido: 'Gómez' }
];

const areas = ['Toxicológico', 'Clínico', 'Entrevista Medica', 'Recepción'];
const asignaciones = [];

// Función para generar un código de evaluador
function generarCodigo(nombre, apellido) {
    const primerasDosApellidos = apellido.substring(0, 2).toUpperCase();
    const primerasTresNombres = nombre.substring(0, 3).toUpperCase();
    const numeroAleatorio = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const caracteresEspeciales = '!@#$%^&*()_+=-{}[]|:;"<>,.?/';
    const caracterEspecial = caracteresEspeciales.charAt(Math.floor(Math.random() * caracteresEspeciales.length));
    return `${primerasDosApellidos}${primerasTresNombres}${numeroAleatorio}${caracterEspecial}`;
}

// Función para inicializar la página de "Asignar Evaluador"
function inicializarAsignarEvaluador() {
    const listaEvaluadoresUl = document.getElementById('listaEvaluadores');
    const selectEvaluador = document.getElementById('selectEvaluador');

    // Limpiar listas previas
    listaEvaluadoresUl.innerHTML = '';
    selectEvaluador.innerHTML = '<option value="">Seleccione un evaluador</option>';

    evaluadores.forEach(evaluador => {
        const codigo = generarCodigo(evaluador.nombre, evaluador.apellido);
        const li = document.createElement('li');
        li.textContent = `${evaluador.nombre} ${evaluador.apellido} - Código: ${codigo}`;
        listaEvaluadoresUl.appendChild(li);

        const option = document.createElement('option');
        option.value = `${evaluador.nombre} ${evaluador.apellido}`;
        option.textContent = `${evaluador.nombre} ${evaluador.apellido}`;
        selectEvaluador.appendChild(option);
    });
}

// Función para asignar un evaluador a un área
function asignarEvaluadorArea() {
    const evaluadorSeleccionado = document.getElementById('selectEvaluador').value;
    const areaSeleccionada = document.getElementById('selectArea').value;
    const mensaje = document.getElementById('asignacionMensaje');

    if (evaluadorSeleccionado && areaSeleccionada) {
        const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        asignaciones.push({
            evaluador: evaluadorSeleccionado,
            area: areaSeleccionada,
            fecha: fecha
        });
        mensaje.textContent = `Asignación exitosa: ${evaluadorSeleccionado} a ${areaSeleccionada}.`;
        mensaje.style.color = 'green';
        generarReporte(); // Actualiza el reporte al asignar
    } else {
        mensaje.textContent = 'Por favor, seleccione un evaluador y un área.';
        mensaje.style.color = 'red';
    }
}

// Función para generar el reporte de asignaciones
function generarReporte() {
    const reporteUl = document.getElementById('reporteAsignaciones');
    reporteUl.innerHTML = '';
    
    if (asignaciones.length === 0) {
        reporteUl.innerHTML = '<li>No hay asignaciones registradas.</li>';
        return;
    }

    const reportePorMes = {};
    asignaciones.forEach(asig => {
        const mes = asig.fecha.split(' ')[1]; // Extrae el nombre del mes
        if (!reportePorMes[mes]) {
            reportePorMes[mes] = [];
        }
        reportePorMes[mes].push(asig);
    });

    for (const mes in reportePorMes) {
        const liMes = document.createElement('li');
        liMes.innerHTML = `<strong>${mes.toUpperCase()}</strong>`;
        const ulDia = document.createElement('ul');
        ulDia.style.listStyleType = 'none';

        const asignacionesDelMes = reportePorMes[mes];
        const asignacionesPorDia = {};
        asignacionesDelMes.forEach(asig => {
            const dia = asig.fecha.split(' ')[0];
            if (!asignacionesPorDia[dia]) {
                asignacionesPorDia[dia] = [];
            }
            asignacionesPorDia[dia].push(asig);
        });

        for (const dia in asignacionesPorDia) {
            const liDia = document.createElement('li');
            liDia.textContent = `Fecha: ${dia}`;
            const ulDetalle = document.createElement('ul');
            ulDetalle.style.listStyleType = 'disc';
            ulDetalle.style.marginLeft = '20px';
            asignacionesPorDia[dia].forEach(asig => {
                const liDetalle = document.createElement('li');
                liDetalle.textContent = `Evaluador: ${asig.evaluador}, Área: ${asig.area}`;
                ulDetalle.appendChild(liDetalle);
            });
            liDia.appendChild(ulDetalle);
            ulDia.appendChild(liDia);
        }
        liMes.appendChild(ulDia);
        reporteUl.appendChild(liMes);
    }
}

// Evento que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSubsite('adminUsuarios'); // Mostrar el primer sub-sitio por defecto
    inicializarAsignarEvaluador();
});