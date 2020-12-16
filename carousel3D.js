/*
By Milton Läufer 
2019
http://www.miltonlaufer.com.ar
https://github.com/miltonlaufer
*/
class Carousel3D {
    constructor(obj, keys = false, nav = true) {
        this.shortSpeed = 0.15;
        this.longSpeed = 1;
        this.swipeThreshold = 60;
        this.touchstartX = 0;
        this.touchendX = 0;
        this.selected = null;
        this.hideLeft = null;
        this.hideRight = null;
        this.nextRightSecond = null;
        this.prevLeftSecond = null;
        this.prev = null;
        this.next = null;
        this.images = [];
        this.buttons = [];
        this.navigation = true;
        this.maxHeight = 0;
        this.obj = null;
        this.objName = "";
        this.keys = false;

        this.init(obj, keys, nav);

        // Until all browser accept the ResizeObserver, this is the only way
        window.onresize = this.bindCallBack(this, this.resizing);
        window.addEventListener("orientationchange", this.bindCallBack(this, this.resizing));
    }

    resizing() {
        this.hideLeft = null;
        this.hideRight = null;
        this.nextRightSecond = null;
        this.prevLeftSecond = null;
        this.selected = null;
        this.prev = null;
        this.next = null;
        this.maxHeight = 0;

        for (let z = 0; z < this.images.length; z++) {
            let elem = this.images[z];
            elem.removeAttribute('class');
            elem.removeAttribute('style');
        }

        this.init(this.objName, this.keys, this.navigation);
    }

    init(obj, keys, nav) {
        this.navigation = nav;
        this.objName = obj;
        this.keys = keys;
        this.images = document.querySelectorAll(`#${obj} > div`);
        this.obj = document.getElementById(obj);

        let selectedNum = Math.floor(this.images.length / 2);

        if (nav) {
            let myNav = document.createElement('nav');
            myNav.className = 'carousel';
            document.getElementById(obj).parentNode.appendChild(myNav);
        }

        for (let z = 0; z < this.images.length; z++) {
            let elem = this.images[z];

            if (elem.offsetHeight > this.maxHeight) {
                this.maxHeight = elem.offsetHeight;
            }

            elem.setAttribute('pos', z);
            elem.addEventListener('click', () => {
                this.setTransition(this.longSpeed);
                this.moveToSelected(z);
            });

            if (nav) {
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
        }
        this.moveToSelected(selectedNum);
        for (let z = 0; z < this.images.length; z++) {
            let elem = this.images[z];
            elem.style.left = elem.offsetLeft + 'px';
            this[elem.className] = elem.offsetLeft;
        }
        if (keys) {
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
        }
        document.getElementById(obj).addEventListener('touchstart', (event) => {
            this.touchstartX = event.changedTouches[0].screenX;
        }, false);

        document.getElementById(obj).addEventListener('touchmove', (event) => {
            this.touchendX = event.changedTouches[0].screenX;
            this.moveWithSlide(this.touchstartX - this.touchendX);
        }, false);

        let objStyle = this.obj.style;
        objStyle.opacity = '1';
        objStyle.height = this.maxHeight + "px";
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

        if (this.navigation) {
            this.buttons[number].checked = 'checked';
        }
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
        this.images.forEach(elem => {
            elem.style.transition = `transform ${speed}s, left ${speed}s, top ${speed}s, opacity ${speed}s, z-index 0s, width 1s, height 1s`;
            if (elem.children[0].tagName === 'IMG') {
                elem.children[0].style.transition = `width ${speed}s, height ${speed}s`;
                elem.children[0].style.border = 'none';
            }
        });
    }

    /**
     * A helper for event binding  https://stackoverflow.com/a/193853
     *
     * @param scope The scope to bound with
     * @param {Function} fn The function that will be bound
     * @returns {function(...[*]=)}
     */
    bindCallBack(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    }
}
