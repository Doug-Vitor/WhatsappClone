import {Format} from './../utils/Format'
import {CameraController} from './CameraController'

export class AppController {
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

            this._cameraController = new CameraController(this.elements.videoCamera);
        });

        this.elements.btnTakePicture.on('click', () => {
            let dataUrl = this._cameraController.takePicture();
            
            this.elements.pictureCamera.src = dataUrl;
            this.elements.pictureCamera.show();
            this.elements.videoCamera.hide();
            this.elements.btnReshootPanelCamera.show();
            this.elements.btnTakePicture.hide();
            this.elements.containerSendPicture.show();
        });

        this.elements.btnReshootPanelCamera.on('click', () => {
            this.elements.pictureCamera.hide();
            this.elements.videoCamera.show();
            this.elements.btnReshootPanelCamera.hide();
            this.elements.containerTakePicture.show();
            this.elements.containerSendPicture.hide();
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
            this._cameraController.stopRecord();
        });

        this.elements.btnSendDocument.on('click', () => {
        });

        this.elements.btnAttachContact.on('click', () => {
            this.elements.modalContacts.show();
        });

        this.elements.btnCloseModalContacts.on('click', () => {
            this.elements.modalContacts.hide();
        });

        this.elements.btnSendMicrophone.on('click', () => {
            this.elements.recordMicrophone.show();
            this.elements.btnSendMicrophone.hide();
            
            this.startAudioTimer();
        });

        this.elements.btnCancelMicrophone.on('click', () => {
            this.closeMicrophoneArea();
        });

        this.elements.btnFinishMicrophone.on('click', () => {
            this.closeMicrophoneArea();
        });

        this.elements.inputText.on('keyup', () => {
            if (this.elements.inputText.innerHTML.length) {
                this.elements.inputPlaceholder.hide();
                this.elements.btnSendMicrophone.hide();
                this.elements.btnSend.show();
            } else {
                this.elements.inputPlaceholder.show();
                this.elements.btnSendMicrophone.show();
                this.elements.btnSend.hide();
            }
        });

        this.elements.inputText.on('keypress', event => {
            if (event.key === 'Enter' && !event.ctrlKey) {
                event.preventDefault();
                this.elements.btnSend.click();
            }
        });

        this.elements.btnEmojis.on('click', () => {
            this.elements.panelEmojis.toggleClass('open');
        });

        this.elements.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
            emoji.on('click', () => {
                let img = this.elements.imgEmojiDefault.cloneNode();
                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(className => {
                    img.classList.add(className);
                })

                this.insertEmoji(img);
                this.elements.inputText.dispatchEvent(new Event('keyup'));
            });
        });
        this.elements.btnSend.on('click', () => {
        });
    }

    closeMainPanels() {
        this.elements.panelMessagesContainer.hide();
        this.elements.panelDocumentPreview.removeClass('open');
        this.elements.panelCamera.removeClass('open');
    }

    closeLeftPanels() {
        this.elements.panelAddContact.hide();
        this.elements.panelEditProfile.hide();
    }

    insertEmoji(emoji) {
        let cursor = window.getSelection();
        if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {
            this.elements.inputText.focus();
            cursor = window.getSelection();
        }

        let range = document.createRange();
        range = cursor.getRangeAt(0);
        range.deleteContents();

        let fragment = document.createDocumentFragment();
        fragment.appendChild(emoji);
        
        range.insertNode(fragment);
        range.setStartAfter(emoji);
    }

    closeAttachedMenu(event) {
        document.removeEventListener('click', this.closeAttachedMenu);
        this.elements.menuAttach.removeClass('open');
    }

    closeMicrophoneArea() {
        this.elements.recordMicrophone.hide();
        this.elements.btnSendMicrophone.show();
        clearInterval(this._recordAudioInterval);
    }

    startAudioTimer() {
        let start = Date.now();
        this._recordAudioInterval = setInterval(() => {
            this.elements.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start);
        }, 100);
    }
}