function loadFile(f) {

    fmime = f.type;

    const r = new FileReader();

    r.onload = ev => {

        fb64 =
            ev.target.result.split(',')[1];

        const pc =
            document.getElementById(
                'previewContainer'
            );

        if (fmime.startsWith('image/')) {

            pc.innerHTML =
                `<img src="${ev.target.result}"
                 class="preview-img"/>`;

        } else {

            pc.innerHTML =
                `<div style="margin-top:12px;
                            padding:12px;
                            background:#f5f5f5;
                            border-radius:8px;
                            font-size:13px;
                            color:#555">
                    📄 PDF cargado:
                    <strong>${f.name}</strong>
                </div>`;
        }

        document
            .getElementById('uploadZone')
            .style.borderColor = '#2e7d32';
    };

    r.readAsDataURL(f);
}

function initializeUploadZone() {

    const uz =
        document.getElementById(
            'uploadZone'
        );

    const fi =
        document.getElementById(
            'fileInput'
        );

    uz.addEventListener('dragover', e => {
        e.preventDefault();
        uz.classList.add('drag');
    });

    uz.addEventListener('dragleave', () => {
        uz.classList.remove('drag');
    });

    uz.addEventListener('drop', e => {

        e.preventDefault();

        uz.classList.remove('drag');

        if (e.dataTransfer.files[0]) {
            loadFile(e.dataTransfer.files[0]);
        }
    });

    fi.addEventListener('change', () => {

        if (fi.files[0]) {
            loadFile(fi.files[0]);
        }
    });
}