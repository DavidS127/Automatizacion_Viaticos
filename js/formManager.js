function fillForm(d) {

    const s = (id, value) => {

        const el = document.getElementById(id);

        if (el) {
            el.value = value || '';
        }
    };

    s('f_fecha', d.fecha);
    s('f_placa', d.placa);
    s('f_conductor', d.conductor);
    s('f_cedula', d.cedula);
    s('f_empresa', d.empresa);
    s('f_origen', d.origen);
    s('f_destino', d.destino);
    s('f_mnf', d.mnf);

    s('f_anticipo1', d.anticipo1);
    s('f_flete', d.flete);
    s('f_saldo', d.saldo);

    s('f_km_origen', d.km_origen);
    s('f_km_rec', d.km_recorrido);
    s('f_galones', d.gal_origen);
    s('f_acpm', d.acpm_valor);

    document.getElementById('gastosBody').innerHTML = '';

    const gastosFijos = [
        "ACPM ORIGEN",
        "ACPM RECORRIDO",
        "PEAJES",
        "UREA",
        "PARQUEADERO",
        "CARGUE M/CIA",
        "CARROZADA",
        "DESCARGUE M/CIA",
        "DESCARROZADA",
        "COMISION 1",
        "COMISION 2",
        "LAVADO",
        "GASTOS EVENTUALES 1",
        "GASTOS EVENTUALES 2",
        "GASTOS EVENTUALES 3"
    ];

    gastosFijos.forEach(nombre => {
        addRow(nombre, "", "");
    });

let idxEventual = 1;

(d.gastos || []).forEach(g => {

    const conceptoIA =
        (g.concepto || "")
        .toUpperCase()
        .trim();

    if (conceptoIA.includes("EVENTUAL")) {

        const fila =
            document.querySelectorAll('#gastosBody tr')[11 + idxEventual];

        if (fila) {

            const inputs = fila.querySelectorAll('input');

            inputs[1].value = g.valor;
            inputs[2].value = g.nota || '';

            idxEventual++;
        }

        return;
    }

    document
        .querySelectorAll('#gastosBody tr')
        .forEach(row => {

            const inputs = row.querySelectorAll('input');

            const conceptoFila =
                inputs[0]
                .value
                .toUpperCase()
                .trim();

            if (
                conceptoFila === conceptoIA
            ) {

                inputs[1].value = g.valor;
                inputs[2].value = g.nota || '';
            }
        });
});

    recalc();
}

function addRow(c = '', v = '', n = '') {

    const tb =
        document.getElementById('gastosBody');

    const tr =
        document.createElement('tr');

    tr.innerHTML = `
        <td>
            <input
                value="${c}"
                placeholder="Concepto"
                oninput="recalc()">
        </td>

        <td>
            <input
                value="${v}"
                placeholder="0"
                style="text-align:right"
                oninput="recalc()">
        </td>

        <td>
            <input
                value="${n}"
                placeholder="Descripción">
        </td>

        <td>
            <button
                class="btn"
                style="padding:3px 8px;font-size:12px;color:#c62828;border-color:#eee"
                onclick="this.closest('tr').remove();recalc()">
                ✕
            </button>
        </td>
    `;

    tb.appendChild(tr);

    recalc();
}

function recalc() {
    let total = 0;
    document.querySelectorAll('#gastosBody tr').forEach(r => {
        total += r.querySelectorAll('input')[1].value;
    });
}

function getPayload() {

    const rows =
        document.querySelectorAll(
            '#gastosBody tr'
        );

    const gastos = [];

    let tg = 0;

    rows.forEach(r => {

        const ins =
            r.querySelectorAll('input');

        const v =
            parseFloat(
                ins[1].value.replace(
                    /[^0-9.-]/g,
                    ''
                )
            ) || 0;

        if (ins[0].value || v) {

            gastos.push({
                concepto: ins[0].value,
                valor: v,
                nota: ins[2].value
            });

            tg += v;
        }
    });

    const ant =
        parseFloat(
            document
                .getElementById('f_anticipo1')
                .value
                .replace(/[^0-9.-]/g,'')
        ) || 0;

    return {

        fecha:
            document.getElementById('f_fecha').value,

        placa:
            document.getElementById('f_placa').value,

        conductor:
            document.getElementById('f_conductor').value,

        cedula:
            document.getElementById('f_cedula').value,

        empresa:
            document.getElementById('f_empresa').value,

        origen:
            document.getElementById('f_origen').value,

        destino:
            document.getElementById('f_destino').value,

        mnf:
            document.getElementById('f_mnf').value,

        anticipo1: ant,

        flete:
            document.getElementById('f_flete').value,

        km_origen:
            document.getElementById('f_km_origen').value,

        km_recorrido:
            document.getElementById('f_km_rec').value,

        galones:
            document.getElementById('f_galones').value,

        acpm_valor:
            document.getElementById('f_acpm').value,

        gastos
    };
}