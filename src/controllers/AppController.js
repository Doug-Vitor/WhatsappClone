class AppController {
    constructor() {
        this.loadElements();
        this.elementsPrototype();
    }

    loadElements() {
        this.elements = {}
        document.querySelectorAll('[id]').forEach(element => {
            this.elements[Format.getCamelCase(element.id)] = element;
        });
    }

    elementsPrototype() {
        Element.prototype.toggle = function() {
            this.style.display = this.style.display == 'block' ? 'none' : 'block';
        };

        Element.prototype.on = function(events, fn) {            
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
            });
        }

        Element.prototype.css = function(styles) {
            for (let name in styles) {
                this.style[name] = styles[name];
            }
        }
    }
}