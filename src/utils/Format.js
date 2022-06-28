class Format {
    static getCamelCase(text) {
        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];
    }

    static elementsPrototype() {
        Element.prototype.toggle = function() {
            this.style.display = this.style.display == 'block' ? 'none' : 'block';
            return this;
        };

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

        Element.prototype.toggleClass = function(className) {
            this.classList.toggle(className);
            
            return this;
        }
    }
}