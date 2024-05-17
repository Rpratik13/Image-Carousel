const IMAGE_WIDTH = 600;
const TIMEOUT_TICK = 10;
const DEFAULT_SLIDE_TIME = 2000;
const DEFAULT_HOLD_TIME = 2000;

function Carousel(node) {
    const carousel = node;
    const images = [];

    this.currentImageIndex = 0;
    this.holdInterval = undefined;
    this.holdTime = carousel.getAttribute('holdTime') || DEFAULT_HOLD_TIME;
    this.isImageChanging = false;
    this.slideTime = carousel.getAttribute('slideTime') || DEFAULT_SLIDE_TIME;

    const addChangeButtons = (direction) => {
        const button = document.createElement('div');
        button.classList.add('change-btn', `change-btn-${direction}`);

        const image = document.createElement('img');
        image.setAttribute('src', `./images/arrow_${direction}.png`);

        button.appendChild(image);

        button.onclick = ((direction) => () => {
            let nextImageIndex;

            if (direction === 'left') {
                nextImageIndex =
                    this.currentImageIndex === 0
                        ? images.length - 1
                        : this.currentImageIndex - 1;
            } else {
                nextImageIndex =
                    this.currentImageIndex === images.length - 1
                        ? 0
                        : this.currentImageIndex + 1;
            }

            changeImage(nextImageIndex);
        })(direction);

        carousel.appendChild(button);
    };

    const addIndicatorDots = () => {
        const indicatorDotContainer = document.createElement('div');
        indicatorDotContainer.classList.add('indicator-dot-container');

        Array.from(carousel.getElementsByTagName('img')).forEach((_, index) => {
            const indicatorDot = document.createElement('div');
            indicatorDot.classList.add('indicator-dot');

            if (index === this.currentImageIndex) {
                indicatorDot.classList.add('indicator-dot-active');
            }

            indicatorDot.onclick = () => changeImage(index);

            indicatorDotContainer.appendChild(indicatorDot);
        });

        carousel.appendChild(indicatorDotContainer);
    };

    const removeImages = () => {
        Array.from(carousel.getElementsByTagName('img')).forEach(
            (image, index) => {
                if (index === this.currentImageIndex) {
                    image.style.position = 'absolute';
                    image.style.top = '0';
                    image.style.left = '0';
                } else {
                    image.parentNode.removeChild(image);
                }

                images.push(image);
            }
        );
    };

    const changeImage = (index) => {
        if (this.isImageChanging || this.currentImageIndex === index) {
            return;
        }

        clearTimeout(this.holdInterval);

        this.isImageChanging = true;

        const currentImage = images[this.currentImageIndex];
        const imageToAppear = images[index];

        imageToAppear.style.position = 'absolute';
        imageToAppear.style.top = '0';
        imageToAppear.style.left =
            (index > this.currentImageIndex ? '' : '-') + `${IMAGE_WIDTH}px`;

        carousel.appendChild(imageToAppear);

        let percentChanged = 0;
        let percentChangePerTick = TIMEOUT_TICK / this.slideTime;
        let movementPerTick = percentChangePerTick * IMAGE_WIDTH;
        let direction = index > this.currentImageIndex ? -1 : 1;

        const interval = setInterval(() => {
            if (percentChanged === 1) {
                clearInterval(interval);

                currentImage.parentNode.removeChild(currentImage);

                const indicatorDots = Array.from(
                    carousel.getElementsByClassName('indicator-dot')
                );

                indicatorDots[this.currentImageIndex].classList.remove(
                    'indicator-dot-active'
                );
                indicatorDots[index].classList.add('indicator-dot-active');

                this.currentImageIndex = index;

                this.isImageChanging = false;

                this.holdInterval = setTimeout(() => {
                    changeImage((this.currentImageIndex + 1) % images.length);
                }, this.holdTime);

                return;
            }

            const movementPerTickWithDirection = direction * movementPerTick;
            currentImage.style.left = `${
                parseFloat(currentImage.style.left) +
                movementPerTickWithDirection
            }px`;

            const change = `${
                parseFloat(imageToAppear.style.left) +
                movementPerTickWithDirection
            }px`;

            imageToAppear.style.left = change <= 0 ? '0px' : change;

            if (percentChanged + percentChangePerTick > 1) {
                percentChanged = 1;
            } else {
                percentChanged += percentChangePerTick;
            }
        }, TIMEOUT_TICK);
    };

    addIndicatorDots();
    removeImages();

    addChangeButtons('left');
    addChangeButtons('right');

    this.holdInterval = setTimeout(() => {
        changeImage((this.currentImageIndex + 1) % images.length);
    }, this.holdTime);
}

document.addEventListener('DOMContentLoaded', () => {
    const cssTag = document.createElement('link');
    cssTag.setAttribute('rel', 'stylesheet');
    cssTag.setAttribute('type', 'text/css');
    cssTag.setAttribute('href', 'css/style.css');
    document.head.appendChild(cssTag);

    const carousels = Array.from(document.getElementsByClassName('carousel'));

    carousels.forEach((carousel) => {
        new Carousel(carousel);
    });
});
