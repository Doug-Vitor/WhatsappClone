export class Base64 {
    static getMimetype(base64URL) {
        return base64URL.match(/^data:(.+);base64,(.*)$/)[1];
    }

    static generateFile(base64URL) {
        let mimeType = Base64.getMimetype(base64URL);
        let extension = mimeType.split('/')[1];
        let filename = `file${Date.now()}.${extension}`;

        return fetch(base64URL).then(result => {
            return result.arrayBuffer();
        }).then(buffer => {
            return new File([buffer], filename, {
                type: mimeType
            });
        });
    }
}