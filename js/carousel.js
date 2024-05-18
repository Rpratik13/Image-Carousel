class Carousel {
    constructor(node) {
        this.carousel = node;
        this.images = [];

        this.currentImageIndex = 0;
        this.holdInterval = undefined;
        this.holdTime =
            this.carousel.getAttribute('holdTime') || DEFAULT_HOLD_TIME;
        this.isImageChanging = false;
        this.slideTime =
            this.carousel.getAttribute('slideTime') || DEFAULT_SLIDE_TIME;

        this.holdInterval = setTimeout(() => {
            this.changeImage((this.currentImageIndex + 1) % this.images.length);
        }, this.holdTime);
    }

    addChangeButtons(direction) {
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
                        ? this.images.length - 1
                        : this.currentImageIndex - 1;
            } else {
                nextImageIndex =
                    this.currentImageIndex === this.images.length - 1
                        ? 0
                        : this.currentImageIndex + 1;
            }

            this.changeImage(nextImageIndex);
        })(direction);

        this.carousel.appendChild(button);
    }

    addIndicatorDots() {
        const indicatorDotContainer = document.createElement('div');
        indicatorDotContainer.classList.add('indicator-dot-container');

        Array.from(this.carousel.getElementsByTagName('img')).forEach(
            (_, index) => {
                const indicatorDot = document.createElement('div');
                indicatorDot.classList.add('indicator-dot');

                if (index === this.currentImageIndex) {
                    indicatorDot.classList.add('indicator-dot-active');
                }

                indicatorDot.onclick = () => this.changeImage(index);

                indicatorDotContainer.appendChild(indicatorDot);
            }
        );

        this.carousel.appendChild(indicatorDotContainer);
    }

    removeImages() {
        Array.from(this.carousel.getElementsByTagName('img')).forEach(
            (image, index) => {
                if (index === this.currentImageIndex) {
                    image.style.position = 'absolute';
                    image.style.top = '0';
                    image.style.left = '0';
                } else {
                    image.parentNode.removeChild(image);
                }

                this.images.push(image);
            }
        );
    }

    changeImage(index) {
        if (this.isImageChanging || this.currentImageIndex === index) {
            return;
        }

        clearTimeout(this.holdInterval);

        this.isImageChanging = true;

        const currentImage = this.images[this.currentImageIndex];
        const imageToAppear = this.images[index];

        imageToAppear.style.position = 'absolute';
        imageToAppear.style.top = '0';
        imageToAppear.style.left =
            (index > this.currentImageIndex ? '' : '-') + `${IMAGE_WIDTH}px`;

        this.carousel.appendChild(imageToAppear);

        let percentChanged = 0;
        let percentChangePerTick = TIMEOUT_TICK / this.slideTime;
        let movementPerTick = percentChangePerTick * IMAGE_WIDTH;
        let direction = index > this.currentImageIndex ? -1 : 1;

        const interval = setInterval(() => {
            if (percentChanged === 1) {
                clearInterval(interval);

                currentImage.parentNode.removeChild(currentImage);

                const indicatorDots = Array.from(
                    this.carousel.getElementsByClassName('indicator-dot')
                );

                indicatorDots[this.currentImageIndex].classList.remove(
                    'indicator-dot-active'
                );
                indicatorDots[index].classList.add('indicator-dot-active');

                this.currentImageIndex = index;

                this.isImageChanging = false;

                this.holdInterval = setTimeout(() => {
                    this.changeImage(
                        (this.currentImageIndex + 1) % this.images.length
                    );
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
    }
}

const carousels = Array.from(document.getElementsByClassName('carousel'));

carousels.forEach((carousel) => {
    const newCarousel = new Carousel(carousel);

    newCarousel.addIndicatorDots();
    newCarousel.removeImages();

    newCarousel.addChangeButtons('left');
    newCarousel.addChangeButtons('right');
});
