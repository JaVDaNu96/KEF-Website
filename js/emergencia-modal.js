/* ==========================================================================
   Modal de emergencia — Sismo del 10 de agosto de 2026 (Chocó / Pacífico)
   --------------------------------------------------------------------------
   Campaña temporal. Para retirarla: borrar este archivo,
   css/emergencia-modal.css y el bloque <div class="kef-emergencia"> de
   index.html.

   Si se lanza una campaña nueva, cambiar CLAVE_ALMACENAMIENTO para que
   vuelva a mostrarse a quienes ya cerraron la anterior.
   ========================================================================== */

const CLAVE_ALMACENAMIENTO = 'kef:emergencia-sismo-2026-08';

const SELECTOR_ENFOCABLES = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * localStorage puede lanzar en modo privado o con cookies bloqueadas.
 * Ante la duda, mostramos el modal: es preferible a fallar en silencio.
 */
function yaFueCerrado() {
    try {
        return window.localStorage.getItem(CLAVE_ALMACENAMIENTO) === 'cerrado';
    } catch (error) {
        return false;
    }
}

function recordarCierre() {
    try {
        window.localStorage.setItem(CLAVE_ALMACENAMIENTO, 'cerrado');
    } catch (error) {
        /* Sin persistencia: el modal reaparecerá. No es motivo para romper nada. */
    }
}

function iniciarModalEmergencia() {
    const modal = document.getElementById('kef-emergencia');
    if (!modal || yaFueCerrado()) {
        return;
    }

    const dialogo = modal.querySelector('.kef-emergencia__dialog');
    const elementoPrevio = document.activeElement;
    let anchoBarra = 0;

    function enfocables() {
        return Array.from(dialogo.querySelectorAll(SELECTOR_ENFOCABLES))
            .filter((el) => el.offsetParent !== null);
    }

    function atraparFoco(evento) {
        if (evento.key !== 'Tab') {
            return;
        }
        const lista = enfocables();
        if (lista.length === 0) {
            return;
        }
        const primero = lista[0];
        const ultimo = lista[lista.length - 1];

        if (evento.shiftKey && document.activeElement === primero) {
            evento.preventDefault();
            ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
            evento.preventDefault();
            primero.focus();
        }
    }

    function alPresionarTecla(evento) {
        if (evento.key === 'Escape') {
            evento.preventDefault();
            cerrar();
            return;
        }
        atraparFoco(evento);
    }

    function abrir() {
        // Compensa la barra de scroll para que el fondo no salte al bloquearse.
        anchoBarra = window.innerWidth - document.documentElement.clientWidth;
        if (anchoBarra > 0) {
            document.body.style.paddingRight = `${anchoBarra}px`;
        }
        document.body.classList.add('kef-emergencia-abierto');

        modal.hidden = false;
        document.addEventListener('keydown', alPresionarTecla);

        const primero = enfocables()[0];
        if (primero) {
            primero.focus();
        }
    }

    function cerrar() {
        modal.hidden = true;
        document.removeEventListener('keydown', alPresionarTecla);

        document.body.classList.remove('kef-emergencia-abierto');
        document.body.style.paddingRight = '';

        recordarCierre();

        // Devuelve el foco a donde estaba antes de abrir.
        if (elementoPrevio && typeof elementoPrevio.focus === 'function') {
            elementoPrevio.focus();
        }
    }

    modal.querySelectorAll('[data-kef-cerrar]').forEach((boton) => {
        boton.addEventListener('click', cerrar);
    });

    // Ir a Instagram cuenta como atendido: no vuelve a aparecer.
    const cta = modal.querySelector('.kef-emergencia__cta');
    if (cta) {
        cta.addEventListener('click', recordarCierre);
    }

    abrir();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarModalEmergencia);
} else {
    iniciarModalEmergencia();
}
