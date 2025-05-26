function navigateTo(page) {
    window.location.href = page;
}

window.addEventListener('load', () => {
    const overlay = document.getElementById('overlay');
    // Inicia el desvanecimiento
    overlay.style.opacity = '0';

    // Después de la transición, oculta el overlay completamente
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 2000); // 2000 ms = 2 s, igual que la duración de la transición
});
