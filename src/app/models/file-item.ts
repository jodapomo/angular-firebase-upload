

export class FileItem {

    public archivo: File;
    public nombreArchivo: string;
    public url: string;
    public uploading: boolean;
    public progreso: number;

    constructor( archivo: File ) {

        this.archivo = archivo;
        this.nombreArchivo = archivo.name;

        this.uploading = false;
        this.progreso = 0;

    }

}
