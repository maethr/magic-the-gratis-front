import { Pipe, PipeTransform } from '@angular/core';
import { SimbolosService } from '../services/scryfall/simbolos.service';

@Pipe({
  name: 'simbolos'
})
export class SimbolosPipe implements PipeTransform {

  constructor(
    private simbolosService: SimbolosService
  ) { }

  /**
   * Pipe que substituye todas las apariciones de códigos de simbolos por sus iconos.
   * @param value un string que puede (o no) (solo) contener un simbolo
   * @param args un tamaño de imagen en pixeles, por defecto es 20px
   * @returns el texto original con los simbolos reemplazados por sus imagenes
   * @usage <span [innerHTML]=" carta.texto | simbolos:'22px' "></span>
   */

  transform(value: string, ...args: unknown[]): string {

    let ocurrencias = value.match(/\{(.*?)\}/g);
    // Array con todas las ocurrencias de x carácteres entre {}

    let size: any = '20px';
    if (args.length > 0) {
      size = args[0];
    }
    // Tamaño por defecto 20px, si se pasa un argumento se usa ese

    if (ocurrencias) {
      for (let i = 0; i < ocurrencias.length; i++) {
        // Recorremos el array de ocurrencias

        let simbolo_enc: any;
        let cod_simbolo = ocurrencias[i];

        simbolo_enc = this.simbolosService.getSimbolo(cod_simbolo);
        // Buscamos el simbolo en el servicio

        if (simbolo_enc) {
          // let simbolo_naked = cod_simbolo.replace(/[{}]/g, '');
          let simbolo_text = simbolo_enc.english.charAt(0).toUpperCase() + simbolo_enc.english.slice(1);
          value = value.replace(cod_simbolo, `<img width="${size}" height="${size}"
                        style="display: inline-block;"
                        src="${simbolo_enc.svg_uri}"
                        alt="${simbolo_enc.english}"
                        title="${simbolo_text}"
                        class="" />`);
          // Se reemplaza el simbolo por una imagen en el texto original
        }
      }
    }
    return value;
    // Devolvemos el texto original con los simbolos reemplazados
  }
}