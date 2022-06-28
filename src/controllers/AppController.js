class AppController {
    constructor() {
        this.loadElements();
        Format.elementsPrototype();
        this.initEvents();
    }

    loadElements() {
        this.elements = {}
        document.querySelectorAll('[id]').forEach(element => {
            this.elements[Format.getCamelCase(element.id)] = element;
        });
    }

    initEvents() {
        /*let elementsToToggle = [this.elements.myPhoto, this.elements.btnNewContact, this.elements.btnClosePanelEditProfile];

        elementsToToggle.forEach(element => {
            element.on('click', function() {
                this.toggleClass('open');
            });
        });*/

        this.elements.myPhoto.on('click', () => {
            this.closeLeftPanels();
            this.elements.panelEditProfile.show();
            setTimeout(() => {
                this.elements.panelEditProfile.toggleClass('open');
            }, 300);
        });

        this.elements.btnNewContact.on('click', () => {
            this.closeLeftPanels();
            this.elements.panelAddContact.show();
            setTimeout(() => {
                this.elements.panelAddContact.toggleClass('open');
            }, 300);
        });

        this.elements.btnClosePanelEditProfile.on('click', () => {
            this.closeLeftPanels();
            this.elements.panelEditProfile.show();
            this.elements.panelEditProfile.toggleClass('open');
        });

        this.elements.btnClosePanelAddContact.on('click', () => {
            this.elements.panelAddContact.toggleClass('open');
        });
    }

    closeLeftPanels() {
        this.elements.panelAddContact.hide();
        this.elements.panelEditProfile.hide();
    }
}