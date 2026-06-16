function toggleKey() {
    const inp = document.getElementById('apiKey');

    inp.type =
        inp.type === 'password'
            ? 'text'
            : 'password';
}

function goStep(n) {

    [1,2,3].forEach(i => {

        document
            .getElementById('step' + i)
            .classList.remove('visible');

        const sb =
            document.getElementById('sb' + i);

        sb.classList.remove('active','done');

        if(i < n)
            sb.classList.add('done');
        else if(i === n)
            sb.classList.add('active');
    });

    document
        .getElementById('step' + n)
        .classList.add('visible');
}

function toggleScript() {

    const b =
        document.getElementById('scriptBlock');

    b.style.display =
        b.style.display === 'none'
            ? 'block'
            : 'none';
}