document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const btnFinalizar = document.getElementById('btnFinalizar');
    const btnRegresar = document.getElementById('btnRegresar');
    const modal = document.getElementById('modalAdvertencia');
    const modalTitle = document.getElementById('modalAdvertenciaTitle');
    const modalText = document.getElementById('modalAdvertenciaText');
    const modalButtons = document.getElementById('modalAdvertenciaButtons');

    // Función para mostrar un modal
    function showModal(title, text, buttonsHtml) {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modalButtons.innerHTML = buttonsHtml;
        modal.style.display = 'block';
    }

    // Función para cerrar un modal
    window.closeModal = function(id) {
        document.getElementById(id).style.display = 'none';
    };

    // Lógica para el botón "Regresar"
    btnRegresar.addEventListener('click', () => {
        const inputs = form.querySelectorAll('input');
        let hasData = false;
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                hasData = true;
            }
        });

        if (hasData) {
            const buttonsHtml = `
                <button class="modal-button" onclick="window.location.href='index.html'">Confirmar</button>
                <button class="modal-button" onclick="closeModal('modalAdvertencia')">Cancelar</button>
            `;
            showModal('Precaución', 'Se borrarán los datos del registro si no se guardan.', buttonsHtml);
        } else {
            // Si no hay datos, regresa directamente sin advertencia
            window.location.href = 'index.html';
        }
    });

    // Lógica para el botón "Finalizar Registro"
    btnFinalizar.addEventListener('click', () => {
        let allFieldsFilled = true;
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (value.trim() === '') {
                allFieldsFilled = false;
            }
            data[key] = value;
        }

        if (!allFieldsFilled) {
            const buttonsHtml = `<button class="modal-button" onclick="closeModal('modalAdvertencia')">Cerrar</button>`;
            showModal('Advertencia', 'No se está cumpliendo con el formulario, favor de verificar y volverlo a intentar.', buttonsHtml);
        } else {
            const buttonsHtml = `
                <button class="modal-button" id="btnConfirmarGuardar">Confirmar</button> 
                <button class="modal-button" onclick="closeModal('modalAdvertencia')">Cancelar</button>
            `;
            showModal('La información es correcta', '', buttonsHtml);
            
            // Evento para el botón de confirmar dentro del modal
            document.getElementById('btnConfirmarGuardar').addEventListener('click', () => {
                saveDataToFile(data);
                closeModal('modalAdvertencia');
            });
        }
    });

    // Función para "guardar" los datos en un archivo de texto
    function saveDataToFile(data) {
        const dataString = JSON.stringify(data, null, 2);
        
        // Crea un "Blob" (objeto de datos binarios) con el contenido del formulario
        const blob = new Blob([dataString], { type: 'text/plain' });
        
        // Crea un enlace temporal para descargar el archivo
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'registro_usuario.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // NOTA: Para un entorno real, esta operación debe ser gestionada por un servidor.
        // El código anterior solo permite la descarga del archivo en el navegador del usuario.
        // Para guardarlo en el servidor, se necesita una tecnología backend (ej. PHP, Node.js).
	// <button class="modal-button" id="btnConfirmarGuardar" onclick="window.location.href='index.html'">Confirmar</button>
    }
});