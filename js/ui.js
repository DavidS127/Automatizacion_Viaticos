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
function initLogo3D() {
    const logo = document.getElementById('logo3d');
    if (!logo) return;

    const wrapper = logo.parentElement;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        logo.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 30}deg) scale(1.05)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        logo.style.transform = 'rotateY(0) rotateX(0) scale(1)';
    });
}