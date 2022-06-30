export class Format {
    static getCamelCase(text) {
        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }

    static toTime(duration) {
        let seconds = parseInt((duration / 1000) % 60).toString().padStart(2, '0');
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) return `${hours}:${minutes}:${seconds}`;
        else return `${minutes}:${seconds}`
    }

    static elementsPrototype() {
        Element.prototype.toggle = function() {
            this.style.display = this.style.display == 'block' ? 'none' : 'block';
            return this;
        };

        Element.prototype.show = function() {
            this.style.display = 'block';
            return this;
        }

        Element.prototype.hide = function() {
            this.style.display = 'none';
            return this;
        }

        Element.prototype.on = function(events, fn) {            
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
            });

            return this;
        }

        Element.prototype.css = function(styles) {
            for (let name in styles) {
                this.style[name] = styles[name];
            }

            return this;
        }

        Element.prototype.addClass = function(className) {
            this.classList.add(className);

            return this;
        }

        Element.prototype.removeClass = function(className) {
            this.classList.remove(className);

            return this;
        }        

        Element.prototype.toggleClass = function(className) {
            this.classList.toggle(className);

            return this;
        }

        HTMLFormElement.prototype.getFormValues = function() {
            return new FormData(this);
        }

        HTMLFormElement.prototype.getJsonFormValues = function() {
            let json = {};
            this.getFormValues().forEach((value, key) => {
                json[key] = value;
            });
        }
    }
}