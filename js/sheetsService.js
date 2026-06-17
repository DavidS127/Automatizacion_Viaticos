function resolverSheetPorPlaca(placaRaw) {

    const placa = normalizarPlaca(placaRaw);

    const enLista1 = PLACAS_SHEET_1
        .map(normalizarPlaca)
        .includes(placa);

    if (enLista1) {
        return { url: SHEET_URL_1, sheetName: 'Excel 1' };
    }

    const enLista2 = PLACAS_SHEET_2
        .map(normalizarPlaca)
        .includes(placa);

    if (enLista2) {
        return { url: SHEET_URL_2, sheetName: 'Excel 2' };
    }

    return null; // Placa no encontrada en ninguna lista
}

async function sendSheets() {

    const d = getPayload();
    const res = document.getElementById('sendResult');

    // 1. Resolver a qué Sheet va según la placa
    const destino = resolverSheetPorPlaca(d.placa);

    if (!destino) {
        res.innerHTML = `
            <div class="alert alert-error">
                ⚠️ La placa <strong>${d.placa || '(vacía)'}</strong>
                no está registrada en ninguna lista (Excel 1 o Excel 2).
                Verifica que la placa esté bien escrita o agrégala en
                <code>config.local.js</code>.
            </div>`;
        return;
    }

    console.log("DATOS ENVIADOS:", d);
    console.log("DESTINO:", destino.sheetName);

    res.innerHTML = `
        <div class="alert alert-info">
            Enviando datos a <strong>${destino.sheetName}</strong>...
        </div>`;

    try {

        await fetch(destino.url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(d)
        });

        res.innerHTML = `
            <div class="alert alert-success">
                ✓ Datos de <strong>${d.conductor}</strong>
                (placa ${d.placa}) enviados correctamente a
                <strong>${destino.sheetName}</strong>.
            </div>`;

    } catch (e) {

        res.innerHTML = `
            <div class="alert alert-error">
                Error: ${e.message}
            </div>`;
    }
}
function normalizarPlaca(placa) {
    return String(placa || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
}