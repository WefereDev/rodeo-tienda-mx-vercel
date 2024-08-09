class Carousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }

  render() {
    const hasControls = this.hasAttribute('controls');
    this.images = Array.from(this.querySelectorAll('li'));

    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            position: relative;
            overflow: hidden;
          }
  
          ul {
            display: flex;
            transition: transform 0.5s ease;
            width: 100%;
            margin: 0;
            padding: 0;
          }
  
          ::slotted(li) {
            flex: 0 0 100%;
            list-style: none;
          }
  
          .controls {
            position: absolute;
            display: flex;
            justify-content: space-between;
            width: 100%;
            top: 0;
            bottom: 0;
            z-index: 1; 
          }
  
          img {
            object-fit: cover;
          }
  
          .indicators {
            position: absolute;
            left: 0;
            bottom: 0;
          }
  
          .controls button, .indicators span {
            font-size: inherit;
            background-color: transparent;
            border: none;
            padding: 1rem;
            cursor: pointer;
          }
        </style>
        <ul>
          <slot></slot>
        </ul>
        ${
          hasControls && this.images && this.images.length >= 2
            ? `
              <div class="controls">
                <slot name="controls">
                  <button id="prev">Prev</button>
                  <button id="next">Next</button>
                </slot>
              </div>
              `
            : ''
        }
        <div class="indicators">
          <span id="indicator" aria-label="1 of 1">1/1</span>
        </div>
      `;
  }

  connectedCallback() {
    this.images = Array.from(this.querySelectorAll('li'));
    this.currentIndex = 0;
    this.carouselContainer = this.shadowRoot.querySelector('ul');

    if (this.hasAttribute('controls') && this.images.length >= 2) {
      this.shadowRoot
        .getElementById('prev')
        .addEventListener('click', () => this.prevImage());
      this.shadowRoot
        .getElementById('next')
        .addEventListener('click', () => this.nextImage());
    }

    this.updateIndicator();
    this.addTouchListeners();
  }

  showImage(index) {
    const offset = -index * 100;
    this.carouselContainer.style.transform = `translateX(${offset}%)`;
    this.updateIndicator();
  }

  prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.showImage(this.currentIndex);
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.showImage(this.currentIndex);
  }

  updateIndicator() {
    const indicator = this.shadowRoot.getElementById('indicator');
    indicator.textContent = `${this.currentIndex + 1}/${this.images.length}`;
    indicator.setAttribute(
      'aria-label',
      `${this.currentIndex + 1} of ${this.images.length}`,
    );
  }

  addTouchListeners() {
    let startX = 0;
    let endX = 0;

    const touchStartHandler = (event) => {
      startX = event.touches[0].clientX;
    };

    const touchMoveHandler = (event) => {
      endX = event.touches[0].clientX;
    };

    const touchEndHandler = () => {
      const diffX = startX - endX;
      if (diffX > 50) {
        this.nextImage();
      } else if (diffX < -50) {
        this.prevImage();
      }
    };

    this.addEventListener('touchstart', touchStartHandler);
    this.addEventListener('touchmove', touchMoveHandler);
    this.addEventListener('touchend', touchEndHandler);
  }
}

customElements.define('sz-carousel', Carousel);

class CarouseItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          li {
          flex: 0 0 100%;
          }
        </style>
        <li>
          <slot></slot>
        </li>
      `;
  }
}

customElements.define('carousel-item', CarouseItem);

class CarouselControls extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('carousel-controls', CarouselControls);
