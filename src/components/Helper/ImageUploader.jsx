import React from 'react';

export class ImageUploader extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectFile = this.selectFile.bind(this);

        this.fileInput = React.createRef();
        this.imgFileInput = React.createRef();
    }

    handleSubmit(event) {
        event.preventDefault();
        const onUploadComplete = this.props.onUploadComplete;
        const rowData = this.props.rowData;
        const readerBase64 = new FileReader();
        const img = this.imgFileInput;

        readerBase64.onload = function () {
            //muestra la miniatura de la imagen
            img.current.src = this.result;

            const fileinfo = this.result.split(",");
            const base64 = fileinfo[1];
            const mimeType = fileinfo[0].split(":")[1].split(";")[0];

            //le paso la data del file al callback del componente padre.
            onUploadComplete(rowData, base64, mimeType);
        };

        readerBase64.readAsDataURL(this.fileInput.current.files[0]);
    }

    selectFile() {
        this.fileInput.current.click();
    }

    render() {
        const imgStyle = { width: "80px", height: "80px", cursor: "pointer" };
        const imgsrc = `data:${this.props.mimeType};base64, ${this.props.base64}`;

        return (            
            <form onSubmit={this.handleSubmit}>
                <img src={imgsrc} alt="" title={"Haga click para adjuntar una imagen"} onClick={this.selectFile} ref={this.imgFileInput} style={imgStyle} />
                <input type="file" style={{ display: "none" }} accept={this.props.accept} ref={this.fileInput} onChange={this.handleSubmit} />
            </form>
        );
    }
}