import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagenPath',
  standalone: true
})
export class ImagenPathPipe implements PipeTransform {

  transform(imagen: string): string {

    if (imagen && imagen !== '') {

      console.log(imagen);

      if(imagen.startsWith('/var/www')){
        const fileName = imagen.split('/').pop();
        const serverURL = 'https://congressovirgofloscarmeli.org/profileTomista/';
        return `${serverURL}${fileName}`;
      }else{
        return imagen;

      }
      

  } else {
    return '';

  
  }
}

}
