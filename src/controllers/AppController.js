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

        this.elements.photoContainerEditProfile.on('click', () => {
            this.elements.inputProfilePhoto.click();
        });

        this.elements.inputNamePanelEditProfile.on('keypress', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.elements.btnSavePanelEditProfile.click();
            }
        });

        this.elements.btnSavePanelEditProfile.on('click', () => {
        });

        this.elements.formPanelAddContact.on('submit', event => {
            event.preventDefault();

            let datas = this.elements.formPanelAddContact.getJsonFormValues();
        })

        this.elements.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {
            item.on('click', () => {
                this.elements.home.hide();
                this.elements.main.css({
                    display: 'flex'
                });
            });
        })

        this.elements.btnAttach.on('click', event => {
            event.stopPropagation();
            this.elements.menuAttach.addClass('open');
            document.addEventListener('click', this.closeAttachedMenu.bind(this));
        })

        this.elements.btnAttachPhoto.on('click', () => {
            this.elements.inputPhoto.click();
        });

        this.elements.inputPhoto.on('change', () => {
            [...this.elements.inputPhoto.files].forEach(photo => {
            });
        });

        this.elements.btnAttachCamera.on('click', () => {
            this.closeMainPanels();
            this.elements.panelCamera.addClass('open');
            this.elements.panelCamera.css({
                height: 'calc(100%)'
            });
        });

        this.elements.btnTakePicture.on('click', () => {
        });

        this.elements.btnClosePanelCamera.on('click', () => {
            this.closeMainPanels();
            this.elements.panelMessagesContainer.show();

        });

        this.elements.btnAttachDocument.on('click', () => {
            this.closeMainPanels();
            this.elements.panelDocumentPreview.addClass('open');
            this.elements.panelDocumentPreview.css({
                height: 'calc(100%)'
            });
        });

        this.elements.btnClosePanelDocumentPreview.on('click', () => {
            this.closeMainPanels();
            this.elements.panelMessagesContainer.show();
        });

        this.elements.btnSendDocument.on('click', () => {
        });

        this.elements.btnAttachContact.on('click', () => {
            this.elements.modalContacts.show();
        });

        this.elements.btnCloseModalContacts.on('click', () => {
            this.elements.modalContacts.hide();
        });
    }

    closeLeftPanels() {
        this.elements.panelAddContact.hide();
        this.elements.panelEditProfile.hide();
    }

    closeMainPanels() {
        this.elements.panelMessagesContainer.hide();
        this.elements.panelDocumentPreview.removeClass('open');
        this.elements.panelCamera.removeClass('open');
    }

    closeAttachedMenu(event) {
        document.removeEventListener('click', this.closeAttachedMenu);
        this.elements.menuAttach.removeClass('open');
    }
}