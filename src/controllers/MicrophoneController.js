import { readInt8 } from 'pdfjs-dist';
import {MethodsExtensions} from './../utils/MethodsExtensions'

export class MicrophoneController extends MethodsExtensions { 
    constructor() {
        super();

        this._mediaRecorder;
        this._available = false;
        this._mimeType = 'audio/webm';

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {
            this._available = true;

            this._stream = stream;

            this.trigger('ready', this._stream);
        }).catch(error => {
            console.error(error);
        });
    }
    
    isAvailabe() {
        return this._available;
    }

    startRecording() {
        if (this._available) {
            this._mediaRecorder = new MediaRecorder(this._stream, {mimeType:this._mimeType});
            
            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', event => {
                if (event.data.size > 0) this._recordedChunks.push(event.data)
            });

            this._mediaRecorder.addEventListener('stop', event => {
                let blob = new Blob(this._recordedChunks, {
                    type: this._mimeType
                });

                let audioContext = new AudioContext();
                let reader = new FileReader();

                reader.onload = () => {
                    audioContext.decodeAudioData(reader.result).then(decode => {
                        let file = new File([blob], `audio${Date.now()}.webm`, {
                            type: this._mimeType,
                            lastModified: Date.now()
                        });

                        this.trigger('recorded', file, decode);
                    })
                }

                reader.readAsArrayBuffer(blob);
                this.stopRecording();
            });

            this._mediaRecorder.start();
            this.startTimer();
        }
    }

    stopRecording() {
        if (this._available) {
            this._mediaRecorder.stop();
            this.stopTimer();

            this._stream.getTracks().forEach(track => {
                track.stop();
            })
        }
    }

    startTimer() {
        let start = Date.now();
        this._recordAudioInterval = setInterval(timer => {
            this.trigger('recordtimer', Date.now() - start)
        }, 100);
    }

    stopTimer() {
        clearInterval(this._recordAudioInterval);
    }
}