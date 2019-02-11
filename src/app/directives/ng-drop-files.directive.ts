import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any ) {
    this.mouseOver.emit( true );
    this._preventStop(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any ) {
    this.mouseOver.emit( false );
  }

  @HostListener('drop', ['$event'])
  public onDrop( event: any ) {

    const transferencia = this._getTransferencia( event );

    if ( !transferencia ) {
      return;
    }

    this._extraerArchivos( transferencia.files );

    this._preventStop(event);
    this.mouseOver.emit( false );

  }


  private _getTransferencia( event: any ) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos( archivosLista: FileList ) {

    // tslint:disable-next-line:forin
    for ( const propiedad in Object.getOwnPropertyNames(archivosLista)) {

      const archivoTemp = archivosLista[propiedad];

      if ( this._archivoPuedeSerCargado( archivoTemp ) ) {

        const nuevoArchivo = new FileItem( archivoTemp );
        this.archivos.push( nuevoArchivo );

      }
    }

  }




  // Validaciones
  private _archivoPuedeSerCargado( archivo: File ): boolean {
    if ( !this._archivoAlreadyDropped( archivo.name ) && this._isImage(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }


  private _preventStop( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoAlreadyDropped( nombreArchivo: string ): boolean {
    for ( const archivo of this.archivos ) {
      if ( archivo.nombreArchivo === nombreArchivo ) {
        console.log('El archivo ' + nombreArchivo + ' ya está agregado');
        return true;
      }
    }

    return false;
  }

  private _isImage( tipoArchivo: string ): boolean {
    return ( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }


}
