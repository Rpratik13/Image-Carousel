document.addEventListener('DOMContentLoaded', () => {
    const cssTag = document.createElement('link');
    cssTag.setAttribute('rel', 'stylesheet');
    cssTag.setAttribute('type', 'text/css');
    cssTag.setAttribute('href', 'css/style.css');
    document.head.appendChild(cssTag);

    const constantsScript = document.createElement('script');
    constantsScript.setAttribute('src', './js/constants.js');
    document.head.appendChild(constantsScript);

    const carouselScript = document.createElement('script');
    carouselScript.setAttribute('src', './js/carousel.js');
    document.head.appendChild(carouselScript);
});
