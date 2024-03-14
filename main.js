import renderStars from "./canvas.js";
renderStars()

const name = document.querySelector('.name');
const letters = name.textContent.split('');

name.textContent = '';

letters.forEach((letter, i) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.translate = `0px -${i * 100}px`;
    // span.style.opacity = "0"
    name.appendChild(span);

    setTimeout(() => {
        // span.style.opacity = "1"
        span.style.translate = `0px 0px`;
    }, i * 100);
});
