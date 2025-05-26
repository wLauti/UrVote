const clickAudio = document.getElementById('click-sound');
const introAudio = document.getElementById('intro-sound');
const overlay = document.querySelector('.overlay');
const blackScreen = document.querySelector('.black-screen');
const whiteScreen = document.querySelector('.white-screen');
const blinkText = document.querySelector('.blink-text');
let alreadyPlayed = false;

window.addEventListener('load', () => {
    setTimeout(() => {
        introAudio.play();
    }, 4000);

    setTimeout(() => {
        document.body.classList.add('white-background');
        blackScreen.remove();
        whiteScreen.remove();
    }, 4000);
});

document.addEventListener('keydown', () => {
    if (alreadyPlayed == false) {
    clickAudio.play();
    overlay.classList.add('show');
    blinkText.style.display = 'none';
    alreadyPlayed = true;

    setTimeout(() => {
        window.location.href = 'AtMenu.html';
    }, 3500);
}
});

document.addEventListener("click", function() {
    if (alreadyPlayed == false) {
        clickAudio.play();
        overlay.classList.add('show');
        blinkText.style.display = 'none';
        alreadyPlayed = true;
    
        setTimeout(() => {
            window.location.href = 'AtMenu.html';
        }, 3500);
    }
});