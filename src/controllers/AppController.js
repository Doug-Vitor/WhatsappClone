import {Format} from './../utils/Format'
import {CameraController} from './CameraController'
import {MicrophoneController} from './MicrophoneController'
import { DocumentController } from './DocumentController';
import { Firebase } from '../utils/Firebase';
import { User } from '../models/User';
import { Chat } from '../models/Chat';

export class AppController {
    constructor() {
        this.loadElements();
        Format.elementsPrototype();
        this.initEvents();
        
        this._firebase = new Firebase();
        this.initAuth();
    }

    initAuth() {
        this._firebase.initAuth().then(response => {
            this._user = new User(response.email);
            
            this._user.on('datachange', data => {
                this.updateProfileDatas(data);
                this.initContacts();
            });
            
            this._user.name = response.displayName;
            this._user.email = response.email;
            this._user.photo = response.photoURL;

            this._user.save().then(() => {
                this.elements.appContent.css({
                    display: 'flex'
                });
            }).catch(error => {
                console.error(error);
                alert('Authentication failure');
            });

        }).catch(error => {
            console.error(error);
            alert('Authentication is required');
            this.initAuth();
        })
    }

    updateProfileDatas(data) {
        document.querySelector('title').innerHTML = data.name + ' WhatsApp Clone';
        this.elements.inputNamePanelEditProfile.innerHTML = data.name;

        if (data.photo) {
            let photo = this.elements.imgPanelEditProfile;
            photo.src = data.photo;
            photo.show();

            this.elements.imgDefaultPanelEditProfile.hide();
        
            let photo2= this.elements.myPhoto.querySelector('img');
            photo2.src = data.photo;
            photo2.show();
        }
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
            this.elements.btnSavePanelEditProfile = true;

            this._user.name = this.elements.inputNamePanelEditProfile.innerHTML;
            this._user.save().then(() => {
                this.elements.btnSavePanelEditProfile = false;
            });
        });

        this.elements.formPanelAddContact.on('submit', event => {
            event.preventDefault();

            let datas = new FormData(this.elements.formPanelAddContact);

            let contact = new User(datas.get('email'));
            contact.on('datachange', data => {
                if (data.name) {
                    Chat.create(this._user.email, contact.email).then(chat => {
                        contact.chatId = chat.id;

                        this._user.chatId = chat.id;
                        contact.addContact(this._user);

                        this._user.addContact(contact).then(() => {
                            this.elements.btnClosePanelAddContact.click();
                        });
                    });
                } else {
                    let error = 'User not found';
                    console.error(error);
                    alert(error);
                }
            });
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
            this.elements.containerTakePicture.hide();
            this.elements.containerSendPicture.show();
        });

        this.elements.btnReshootPanelCamera.on('click', () => {
            this.elements.pictureCamera.hide();
            this.elements.videoCamera.show();
            this.elements.btnReshootPanelCamera.hide();
            this.elements.containerTakePicture.show();
            this.elements.containerSendPicture.hide();
        });

        this.elements.btnSendPicture.on('click', () => {
            
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

            this.elements.inputDocument.click();
        });

        this.elements.inputDocument.on('change', () => {
            if (this.elements.inputDocument.files.length) {
                this.elements.panelDocumentPreview.css({
                    height: 'calc(100%)'
                });
                let file = this.elements.inputDocument.files[0];
                this._documentController = new DocumentController(file);

                this._documentController.getPreviewData().then(result => {
                    this.elements.panelDocumentPreview.css({
                        height: 'calc(100%)'
                    });
                    
                    this.elements.imgPanelDocumentPreview.src = result.src;
                    this.elements.infoPanelDocumentPreview.innerHTML = result.info;
                    this.elements.imagePanelDocumentPreview.show();
                    this.elements.filePanelDocumentPreview.hide();
                }).catch(() => {
                    this.elements.panelDocumentPreview.css({
                        height: 'calc(100%)'
                    });
                    this.elements.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                    this.elements.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.elements.imagePanelDocumentPreview.hide();
                    this.elements.filePanelDocumentPreview.show();
                });
            }
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
            
            this._microphoneController = new MicrophoneController();
            this._microphoneController.on('ready', () => {
                this._microphoneController.startRecording();
            });

            this._microphoneController.on('recordtimer', timer => {
                this.elements.recordMicrophoneTimer.innerHTML = Format.toTime(timer);

            });
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

    initContacts() {

        this._user.on('contactschange', docs => {
            let messagesList = this.elements.contactsMessagesList;
            messagesList.innerHTML = '';

            docs.forEach(doc => {
                let contact = doc.data();
                
                let div = document.createElement('div');
                div.className = 'contact-item';
                div.innerHTML = `
                    <div class="dIyEr">
                        <div class="_1WliW" style="height: 49px; width: 49px;">
                            <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                            <div class="_3ZW2E">
                                <span data-icon="default-user" class="">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                        <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                        <g fill="#FFF">
                                            <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="_3j7s9">
                        <div class="_2FBdJ">
                            <div class="_25Ooe">
                                <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
                            </div>
                            <div class="_3Bxar">
                                <span class="_3T2VG">${contact.lastMessageTime}</span>
                            </div>
                        </div>
                        <div class="_1AwDx">
                            <div class="_itDl">
                                <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>

                                <span class="_2_LEW last-message">
                                    <div class="_1VfKB">
                                        <span data-icon="status-dblcheck" class="">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                                <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                                    <div class="_3Bxar">
                                        <span>
                                            <div class="_15G96">
                                                <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                            </div>
                                    </span></div>
                                    </span>
                            </div>
                        </div>
                    </div>
                `;

                if (contact.photo) {
                    let photo = div.querySelector('.photo');
                    photo.src = contact.photo;
                    photo.show();
                }

                div.on('click', () => {
                    this.elements.activeName.innerHTML = contact.name;
                    this.elements.activeStatus.innerHTML = contact.status;

                    if (contact.photo) {
                        let photo = this.elements.activePhoto;
                        photo.src = contact.photo;
                        photo.show();
                    }

                    this.elements.home.hide();
                    this.elements.main.css({
                        display: 'flex'
                    })
                });

                messagesList.appendChild(div);
            });
        });

        this._user.getContacts();
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
        this._microphoneController.stopRecording();
    }
}