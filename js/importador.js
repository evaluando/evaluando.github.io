// Función para cambiar entre sub-sitios
function showSubsite(subsiteId) {
    // 1. Oculta todos los sub-sitios
    const subsites = document.querySelectorAll('.subsite');
    subsites.forEach(subsite => {
        subsite.classList.remove('active');
    });

    // 2. Muestra solo el sub-sitio seleccionado
    const selectedSubsite = document.getElementById(subsiteId);
    if (selectedSubsite) {
        selectedSubsite.classList.add('active');
    }

    // 3. Limpia los mensajes de éxito
    document.getElementById('tickMedMessage').textContent = '';
    document.getElementById('erpMessage').textContent = '';
}

// Lógica de importación para ambos archivos
document.getElementById('uploadTickMed').addEventListener('change', (event) => {
    handleFileUpload(event, 'tickMedData', 'tickMedMessage');
});

document.getElementById('uploadERP').addEventListener('change', (event) => {
    handleFileUpload(event, 'erpData', 'erpMessage');
});

function handleFileUpload(event, dataKey, messageId) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        localStorage.setItem(dataKey, content);
        document.getElementById(messageId).textContent = "El archivo se ha subido con éxito.";
        document.getElementById(messageId).style.color = "green";
    };
    reader.readAsText(file);
}

// Función para mostrar los datos en una nueva ventana emergente
function verExpediente(dataKey, tipo) {
    const data = localStorage.getItem(dataKey);

    if (!data) {
        alert('Sin datos para mostrar. Por favor, suba un archivo primero.');
        return;
    }

    // Encabezados de los documentos
    const headersTickMed = [
        "TickMed_ID_de_evaluado_TickMed", "TickMed_nombre", "TickMed_teléfono", "TickMed_curp", "TickMed_rfc",
        "TickMed_CUIP", "TickMed_Dependencia_adscrita", "TickMed_Cargo", "TickMed_fecha_de_evaluación",
        "TickMed_Medicamentos_consumidos", "TickMed_Riesgo", "TickMed_Química_sanguinea",
        "TickMed_Biometria_hemática", "TickMed_Examen_general_de_orina", "TickMed_Cocaina",
        "TickMed_Marihuana", "TickMed_Anfetaminas/metanfetaminas", "TickMed_Benzodiacepinas",
        "TickMed_Barbitúricos", "TickMed_pH", "TickMed_Gravedad_específica", "TickMed_Creatinina",
        "TickMed_Nitritos", "TickMed_Oxidantes", "TickMed_Glutaraldehidos"
    ];

    const headersERP = [
        "ERP_ID_de_evaluado_ERP", "ERP_nombre", "ERP_teléfono", "ERP_curp", "ERP_rfc", "ERP_CUIP",
        "ERP_Dependencia_adscrita", "ERP_Cargo", "ERP_fecha_de_evaluación", "ERP_Fecha", "ERP_Hora",
        "ERP_Area_de_evaluación", "ERP_Entrevista_psicológica", "ERP_Examen_psicométrico",
        "ERP_Examen_Toxicológico", "ERP_Examen_Clínico", "ERP_Entrevista_médica",
        "ERP_Entorno_socioeconómico", "ERP_Poligrafía", "ERP_Notas_de_evaluación"
    ];

    const headers = tipo === 'TickMed' ? headersTickMed : headersERP;
    
    // Crear el contenido de la tabla
    const rows = data.split('\n').filter(row => row.trim() !== '');
    let tableHtml = '<table><thead><tr>';
    
    headers.forEach(header => {
        tableHtml += `<th>${header}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',').map(cell => cell.trim());
        if (columns.length === headers.length) {
            tableHtml += '<tr>';
            columns.forEach(column => {
                tableHtml += `<td>${column}</td>`;
            });
            tableHtml += '</tr>';
        }
    }
    tableHtml += '</tbody></table>';

    // Abrir una nueva ventana y escribir el contenido
    const popup = window.open('', '_blank', 'width=1000,height=600,scrollbars=yes,resizable=yes');
    popup.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <title>Expediente ${tipo}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
                th { background-color: #f2f2f2; font-weight: bold; }
                button {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 5px;
                    background-color: #0D3A63;
                    color: white;
                    cursor: pointer;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <h3>Datos del Expediente ${tipo}</h3>
            <button onclick="window.close()">Cerrar</button>
            ${tableHtml}
        </body>
        </html>
    `);
    popup.document.close();
}

// Iniciar la página mostrando el primer sub-sitio
document.addEventListener('DOMContentLoaded', () => {
    showSubsite('importarTickMed');
});