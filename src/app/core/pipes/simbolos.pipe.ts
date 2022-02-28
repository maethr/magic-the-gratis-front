import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SimbolosService } from '../services/scryfall/simbolos.service';

@Pipe({
  name: 'simbolos'
})
export class SimbolosPipe implements PipeTransform {

  constructor(
    private simbolosService: SimbolosService
  ) { }

  transform(value: string, ...args: unknown[]): string {

    let ocurrencias = value.match(/\{(.*?)\}/g);

    let size: any = '28px';
    if (args.length > 0) {
      size = args[0];
    }

    if (ocurrencias) {
      for (let i = 0; i < ocurrencias.length; i++) {

        let simbolo_enc: any;
        let cod_simbolo = ocurrencias[i];

        simbolo_enc = this.simbolosService.getSimbolo(cod_simbolo);

        if (simbolo_enc) {
          // let simbolo_naked = cod_simbolo.replace(/[{}]/g, '');
          let simbolo_text = simbolo_enc.english.charAt(0).toUpperCase() + simbolo_enc.english.slice(1);
          value = value.replace(cod_simbolo, `<img width="${size}" height="${size}"
                        src="${simbolo_enc.svg_uri}"
                        alt="${simbolo_enc.english}"
                        title="${simbolo_text}"
                        class="" />`);
        }
      }
    }

    return value;
  }
}