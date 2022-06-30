class CameraController {
    constructor(videoElement) {
        this._videoEl = videoElement;

        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {
            this._videoEl.src = URL.createObjectURL(stream)
            this._videoEl.play();
        }).catch(error => {
            console.error(error);
        });
    }
}