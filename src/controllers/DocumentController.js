const pdf = require('pdfjs-dist');
const path = require('path');

pdf.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export class DocumentController {
    constructor(file) {
        this._file = file;
    }

    getPreviewData() {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            switch(this._file.type) {
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
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
                    fileReader.onload = () => {
                        pdf.getDocument(new Uint8Array(fileReader.result)).then(doc => {
                            doc.getPage(1).then(page => {
                                let viewport = page.getViewport(1);

                                let canvas = document.createElement('canvas');
                                let canvasContext = canvas.getContext('2d');

                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                page.render({
                                    canvasContext, viewport
                                }).then(() => {
                                    let pageString = doc.numPages > 1 ? `${doc.numPages} páginas` : `${doc.numPages} página`;
                                    resolve({
                                        src: canvas.toDataURL('image/png'),
                                        info: pageString
                                    })
                                }).catch(error => {
                                    reject(error);
                                })
                            }).catch(error => {
                                reject(error);
                            })
                        }).catch(error => {
                            reject(error);
                        })
                    }

                    fileReader.readAsArrayBuffer(this._file)
                    break;
                default:
                    reject();
            }
        });
    }
}