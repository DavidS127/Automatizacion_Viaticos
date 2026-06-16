async function sendSheets() {

    const url =
        document
            .getElementById('sheetsUrl')
            .value
            .trim();

    if (!url) {

        alert(
            'Ingresa la URL del Web App.'
        );

        return;
    }

    const res =
        document.getElementById(
            'sendResult'
        );

    const d = getPayload();
    console.log("DATOS ENVIADOS:");
    console.log(d);

    res.innerHTML =
        `<div class="alert alert-info">
            Enviando datos...
        </div>`;

    try {

        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify(d)
        });

        res.innerHTML =
            `<div class="alert alert-success">
                ✓ Datos de
                <strong>${d.conductor}</strong>
                enviados correctamente.
            </div>`;

    } catch (e) {

        res.innerHTML =
            `<div class="alert alert-error">
                Error:
                ${e.message}
            </div>`;
    }
}