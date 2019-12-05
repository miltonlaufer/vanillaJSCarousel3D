/*
By Milton Läufer 
2019
http://www.miltonlaufer.com.ar
https://github.com/miltonlaufer
*/
class Carousel3D {
    shortSpeed = 0.15;
    longSpeed = 1;
    swipeThreshold = 60;
    touchstartX = 0;
    touchendX = 0;
    selected = null;
    hideLeft = null;
    hideRight = null;
    nextRightSecond = null;
    prevLeftSecond = null;
    prev = null;
    next = null;
    images = [];
    buttons = [];

    constructor(obj) {
        this.images = document.querySelectorAll(`#${obj} div`);
        let selectedNum = Math.floor(this.images.length / 2);
        let myNav = document.createElement('nav');
        myNav.className = 'carousel';
        document.getElementById(obj).parentNode.appendChild(myNav);

        for (let z = 0; z < this.images.length; z++) {
            let elem = this.images[z];
            elem.setAttribute('pos', z);
            elem.addEventListener('click', () => {
                this.setTransition(this.longSpeed);
                this.moveToSelected(z);
            });


            let input = document.createElement('input');
            input.type = 'radio';
            input.name = 'carousel-dots';
            input.id = `carousel-item-${z}`;
            myNav.appendChild(input);
            input.addEventListener('click', () => {
                this.setTransition(this.longSpeed);
                this.moveToSelected(z);
            });
            this.buttons.push(input);
            if (z === selectedNum) {
                input.checked = 'checked';
            }
            let label = document.createElement('label');
            label.setAttribute('for', `carousel-item-${z}`);
            myNav.appendChild(label);


        }
        this.moveToSelected(selectedNum);
        for (let z = 0; z < this.images.length; z++) {
            let elem = this.images[z];
            elem.style.left = elem.offsetLeft + 'px';
            this[elem.className] = elem.offsetLeft;
        }
        document.addEventListener('keydown', (e) => {
            switch (e.which) {
                case 37: // left
                    this.setTransition(this.longSpeed);
                    this.moveToSelected('prev');
                    break;
                case 39: // right
                    this.setTransition(this.longSpeed);
                    this.moveToSelected('next');
                    break;
                default:
                    return;
            }
            e.preventDefault();
        });
        document.getElementById(obj).addEventListener('touchstart', (event) => {
            this.touchstartX = event.changedTouches[0].screenX;
        }, false);

        document.getElementById(obj).addEventListener('touchmove', (event) => {
            this.touchendX = event.changedTouches[0].screenX;
            this.moveWithSlide(this.touchstartX - this.touchendX);
        }, false);


    }

    moveToSelected(number) {
        let selectedObj, nextObj, prevObj, prevSecond, nextSecond = null;
        if (number === 'prev') {
            let previous = document.querySelector('.selected').previousElementSibling;
            if (previous) {
                number = parseInt(previous.getAttribute('pos'));
            }
        } else if (number === 'next') {
            let nextOne = document.querySelector('.selected').nextElementSibling;
            if (nextOne) {
                number = parseInt(nextOne.getAttribute('pos'));
            }
        }
        if (typeof number !== 'number') {
            return;
        }

        selectedObj = this.images[number];
        this.buttons[number].checked = 'checked';
        if (selectedObj) {
            nextObj = selectedObj.nextElementSibling;
            prevObj = selectedObj.previousElementSibling;
            selectedObj.className = 'selected';
            if (this.selected !== null) {
                selectedObj.style.left = this.selected + 'px';
            }
        }
        if (prevObj) {
            prevObj.className = 'prev';
            if (this.prev !== null) {
                prevObj.style.left = this.prev + 'px';
            }
            prevSecond = prevObj.previousElementSibling;
        }
        if (nextObj) {
            nextObj.className = 'next';
            if (this.next !== null) {
                nextObj.style.left = this.next + 'px';
            }
            nextSecond = nextObj.nextElementSibling;
        }
        if (nextSecond) {
            nextSecond.className = 'nextRightSecond';
            if (this.nextRightSecond !== null) {
                nextSecond.style.left = this.nextRightSecond + 'px';
            }
            this.getNextSiblings(nextSecond).forEach((elem) => {
                elem.className = 'hideRight';
                elem.style.left = this.hideRight + 'px';
            });
        }
        if (prevSecond) {
            prevSecond.className = 'prevLeftSecond';
            if (this.prevLeftSecond !== null) {
                prevSecond.style.left = this.prevLeftSecond + 'px';
            }
            this.getPrevSiblings(prevSecond).forEach((elem) => {
                elem.className = 'hideLeft';
                elem.style.left = this.hideLeft + 'px';
            });
        }
    }

    getNextSiblings(element) {
        let n = element, ret = [];
        while (n = n.nextElementSibling) {
            ret.push(n)
        }
        return ret;
    }

    getPrevSiblings(element) {
        let n = element, ret = [];
        while (n = n.previousElementSibling) {
            ret.push(n)
        }
        return ret;
    }

    moveWithSlide(x) {
        if (Math.abs(x) > this.swipeThreshold) { // this number is the threshold to active the movement
            this.setTransition(this.shortSpeed);

            if (x > 0) {
                this.moveToSelected('next');
            } else if (x < 0) {
                this.moveToSelected('prev');
            }
            this.touchstartX = this.touchendX;
        }
    }

    setTransition(speed) {
        this.images.forEach((elem) => {
            elem.style.transition = `transform ${speed}s, left ${speed}s, top ${speed}s, opacity ${speed}s, z-index 0s`;
            elem.childNodes[1].style.transition = `width ${speed}s`;
        });
    }
}
