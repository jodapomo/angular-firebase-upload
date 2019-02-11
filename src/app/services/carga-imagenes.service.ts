import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileItem } from '../models/file-item';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor( private db: AngularFirestore ) { }

  cargarImagenesFirebase( imagenes: FileItem[] ) {

    const storageRef = firebase.storage().ref();

    for ( const item of imagenes ) {

      item.uploading = true;

      if ( item.progreso >= 100 ) {
        continue;
      }

      const imageReg = storageRef.child(`${ this.CARPETA_IMAGENES }/${ item.nombreArchivo }`);
      const uploadTask: firebase.storage.UploadTask = imageReg.put( item.archivo );

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ( snapshot: firebase.storage.UploadTaskSnapshot ) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        ( error ) => console.error( 'Error al subir', error),
        () => {
          imageReg.getDownloadURL().then(
            ( url ) => {
            console.log('Imagen cargada correctamente');
            item.url = url;
            item.uploading = false;
            this.guardarImagen({
              nombre: item.nombreArchivo,
              url: item.url
            });
          });
        }
      );
    }

  }


  private guardarImagen( imagen: { nombre: string, url: string} ) {

    this.db.collection(`/${ this.CARPETA_IMAGENES}`)
      .add( imagen );

  }

}
