/**
 * Normaliza una placa para comparar sin importar espacios,
 * guiones o mayúsculas/minúsculas.
 */
function normalizarPlaca(placa) {
    return String(placa || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
}

/**
 * Determina a qué URL de Google Sheets corresponde una placa.
 * Devuelve { url, sheetName, num } o null si no se encuentra.
 */
function resolverSheetPorPlaca(placaRaw) {

    const placa = normalizarPlaca(placaRaw);

    const enLista1 = PLACAS_SHEET_1
        .map(normalizarPlaca)
        .includes(placa);

    if (enLista1) {
        return { url: SHEET_URL_1, sheetName: 'Flota Group', num: '1' };
    }

    const enLista2 = PLACAS_SHEET_2
        .map(normalizarPlaca)
        .includes(placa);

    if (enLista2) {
        return { url: SHEET_URL_2, sheetName: 'Flota Miguel', num: '2' };
    }

    return null;
}

/**
 * Se llama al entrar al Paso 3 (desde goStep(3) en ui.js, o
 * directamente desde el botón "Continuar"). Preselecciona el
 * <select> según la placa, pero deja que el usuario lo cambie.
 */
function preseleccionarSheet() {

    const select = document.getElementById('f_sheetDestino');
    const hint = document.getElementById('sheetAutoHint');

    if (!select) return;

    const placa = document.getElementById('f_placa').value;
    const destino = resolverSheetPorPlaca(placa);

    if (destino) {
        select.value = destino.num;
        hint.style.display = 'block';
        hint.textContent = `✓ Detectado automáticamente por la placa: ${destino.sheetName}`;
    } else {
        select.value = '';
        hint.style.display = 'block';
        hint.style.color = '#c62828';
        hint.textContent = '⚠️ No se detectó automáticamente. Selecciona a quien pertenece manualmente.';
    }
}

/**
 * Si el usuario cambia el selector a mano, actualizamos el hint
 * para que sepa que ya no está en modo automático.
 */
function onCambioSheetManual() {

    const select = document.getElementById('f_sheetDestino');
    const hint = document.getElementById('sheetAutoHint');

    if (!select.value) {
        hint.style.display = 'none';
        return;
    }

    hint.style.display = 'block';
    hint.style.color = '#0d47a1';
    hint.textContent = `Seleccionado manualmente: ${select.value}`;
}

async function sendSheets() {

    const d = getPayload();
    const res = document.getElementById('sendResult');

    const select = document.getElementById('f_sheetDestino');
    const seleccion = select.value;

    if (!seleccion) {
        res.innerHTML = `
            <div class="alert alert-error">
                ⚠️ Debes seleccionar a qué Excel enviar (Flota Group o Flota Miguel).
            </div>`;
        return;
    }

    const url = seleccion === '1' ? SHEET_URL_1 : SHEET_URL_2;
    const sheetName = seleccion === '1' ? 'Flota Group' : 'Flota Miguel';

    console.log("DATOS ENVIADOS:", d);
    console.log("DESTINO:", sheetName);

    res.innerHTML = `
        <div class="alert alert-info">
            Enviando datos a <strong>${sheetName}</strong>...
        </div>`;

    try {

        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(d)
        });

        res.innerHTML = `
            <div class="alert alert-success">
                ✓ Datos de <strong>${d.conductor}</strong>
                (placa ${d.placa}) enviados correctamente a
                <strong>${sheetName}</strong>.
            </div>`;

    } catch (e) {

        res.innerHTML = `
            <div class="alert alert-error">
                Error: ${e.message}
            </div>`;
    }
}