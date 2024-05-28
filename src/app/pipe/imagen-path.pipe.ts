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
        // const serverURL = 'https://arcanjosaorafael.org/bankAccount/';
        const serverURL = 'https://congressovirgofloscarmeli.org/profilePicture/';
        return `${serverURL}${fileName}`;
      }else{
        return imagen;

      }
      

  } else {
    return '';

  
  }
}

}
