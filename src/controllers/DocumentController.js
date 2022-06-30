export class DocumentController {
    constructor(file) {
        this._file = file;
    }

    getPreviewData() {
        return new Promise((resolve, reject) => {
            switch(this._file.type) {
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                    let fileReader = new FileReader();

                    fileReader.onload = () => {
                        resolve({
                            src: fileReader.result,
                            info: this._file.name
                        });
                    };

                    fileReader.onerror = event => {
                        reject(event);
                    }

                    fileReader.readAsDataURL(this._file);
                    break;

                case 'application/pdf':
                    break;
                default:
                    reject();
            }
        });
    }
}