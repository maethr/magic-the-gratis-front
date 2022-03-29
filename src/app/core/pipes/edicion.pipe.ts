import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EdicionService } from 'src/app/core/services/scryfall/edicion.service';
import { Edicion } from '../models/edicion';

/**
 * Pipe que devuelve el icono de la edicion a partir de su set code.
 * @usage <span [innerHTML]="carta.set | edicion:'26px' | async"></span>
 * @author Miguel Bautista Pérez
 */
@Pipe({
  name: 'edicion'
})
export class EdicionPipe implements PipeTransform {


  constructor(
    private edicionService: EdicionService
  ) { }

  /**
   * @param value un string con el set code de la edicion
   * @param args numero de pixeles para el tamaño de la imagen, por defecto es 28px
   * @returns un elemento <img> con el icono de la edicion, de forma asincrona
   */

  transform(value: string, ...args: unknown[]): Observable<any> {
    return this.edicionService.getEdicion(value).pipe(
      map((response: Edicion) => {

        let size: any = '28px';
        if (args.length > 0) {
          size = args[0];
        }

        let img = `<img width="${size}" height="${size}"src="${response.icon_svg_uri}" title="${response.name}\n${response.code.toUpperCase()}" alt="${response.name}"
          class="simbolo-edicion" />`;

        return img;
      })
    );
  }

}
