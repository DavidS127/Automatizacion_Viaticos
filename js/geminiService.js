async function extractData() {

    const key =
        document
            .getElementById('apiKey')
            .value
            .trim();

    if (!key) {
        alert('Ingresa tu API Key de Gemini.');
        return;
    }

    if (!fb64) {
        alert('Sube primero el formulario.');
        return;
    }

    goStep(2);

    document.getElementById('alertBox')
        .innerHTML =
        `<div class="loading">
            <div class="spinner"></div>
            <p>
                Analizando formulario con Gemini...
            </p>
        </div>`;

    const prompt = `
Eres un experto en formularios de legalización de viáticos de empresas de transporte colombianas.

Extrae TODOS los datos visibles del formulario y devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:

{
"fecha":"",
"placa":"",
"conductor":"",
"cedula":"",
"empresa":"",
"origen":"",
"destino":"",
"mnf":"",
"anticipo1":"",
"flete":"",
"saldo":"",
"km_origen":"",
"km_recorrido":"",
"gal_origen":"",
"acpm_valor":"",
"gastos":[
{
"concepto":"",
"valor":"",
"nota":""
}
}

Reglas:

- Sin markdown
- Sin explicación
- Solo JSON válido
- Valores monetarios sin puntos
- Si no existe un dato usar ""
`;

    const mime =
        fmime.startsWith('image/')
            ? fmime
            : 'image/jpeg';

    const isPdf =
        fmime === 'application/pdf';

    const models = [
        'gemini-2.5-flash'
    ];

    let lastErr = '';

    for (const model of models) {

        try {

            const body = {

                contents: [{
                    parts: [

                        isPdf
                            ? {
                                inline_data: {
                                    mime_type:
                                        'application/pdf',
                                    data: fb64
                                }
                            }
                            : {
                                inline_data: {
                                    mime_type: mime,
                                    data: fb64
                                }
                            },

                        {
                            text: prompt
                        }
                    ]
                }],

                generationConfig: {
                    temperature: 0.1
                }
            };

            const resp =
                await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body:
                            JSON.stringify(body)
                    }
                );

            const result =
                await resp.json();

            console.log(result);

            if (!resp.ok) {

                lastErr =
                    result.error?.message
                    || `Error ${resp.status}`;

                continue;
            }

            let text =
                result.candidates?.[0]
                    ?.content?.parts?.[0]
                    ?.text || '';

            text =
                text
                    .replace(/```json/g,'')
                    .replace(/```/g,'')
                    .trim();

            const data =
                JSON.parse(text);

            fillForm(data);

            document
                .getElementById(
                    'alertBox'
                ).innerHTML =
                `<div class="alert alert-success">
                    ✓ Datos extraídos con
                    <strong>${model}</strong>
                </div>`;

            return;

        } catch (err) {

            lastErr = err.message;
        }
    }

    document
        .getElementById('alertBox')
        .innerHTML =
        `<div class="alert alert-error">
            ❌ Error:
            ${lastErr}
        </div>`;
}