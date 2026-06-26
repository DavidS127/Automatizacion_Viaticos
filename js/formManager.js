function fillForm(d) {

    const s = (id, value) => {

        const el = document.getElementById(id);

        if (el) {
            el.value = value || '';
        }
    };

    s('f_fecha_viaje', d.fecha_viaje);
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

    s('f_km_inicio', d.km_inicio);
    s('f_galones_terpel', d.galones_terpel);
    s('f_galones_efectivo', d.galones_efectivo);


    document.getElementById('gastosBody').innerHTML = '';

    const gastosFijos = [
        "ACPM TERPEL",
        "ACPM EFECTIVO",
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
        "MANTENIMIENTO 1",
        "MANTENIMIENTO 2",
        "MANTENIMIENTO 3",
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
                document.querySelectorAll('#gastosBody tr')[14 + idxEventual];

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

                if (conceptoFila === conceptoIA) {
                    inputs[1].value = g.valor;
                    inputs[2].value = g.nota || '';
                }
            });
    });

    recalc();

    // ── Validar la placa apenas Gemini termina de llenar el formulario ──
    validarPlaca();
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
    // (corregido: antes sumaba strings sin convertir a número)
    let total = 0;
    document.querySelectorAll('#gastosBody tr').forEach(r => {
        total += parseFloat(
            r.querySelectorAll('input')[1].value.replace(/[^0-9.-]/g, '')
        ) || 0;
    });
    // total ya no se muestra en pantalla, pero queda disponible
    // si luego lo necesitas mostrar o usar en alguna validación
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

    console.log(f_galones_terpel)
    return {

        fecha:
            document.getElementById('f_fecha_viaje').value,

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

        km_inicio:        
            document.getElementById('f_km_inicio').value,

        galones_terpel:    
            document.getElementById('f_galones_terpel').value,

        galones_efectivo:  
            document.getElementById('f_galones_efectivo').value,

        gastos,

        totalGastos: tg
    };
}

function validarPlaca() {

    const input = document.getElementById('f_placa');
    const warning = document.getElementById('placaWarning');

    if (!input || !warning) {
        console.warn('validarPlaca: faltan elementos #f_placa o #placaWarning en el HTML');
        return;
    }

    const placa = normalizarPlaca(input.value);

    // Si el campo está vacío, no mostrar nada todavía
    if (!placa) {
        warning.style.display = 'none';
        input.style.borderColor = '';
        input.title = '';
        return;
    }

    const destino = resolverSheetPorPlaca(placa);

    if (destino) {
        warning.style.display = 'none';
        input.style.borderColor = '#2e7d32'; // verde = encontrada
        input.title = `Se enviará a: ${destino.sheetName}`;
    } else {
        warning.style.display = 'block';
        warning.textContent = '⚠️ Placa no registrada en ninguna lista. Verifica que esté bien escrita.';
        input.style.borderColor = '#c62828'; // rojo = no encontrada
        input.title = '';
    }
}