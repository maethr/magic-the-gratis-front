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

  transform(value: string, ...args: unknown[]): Observable<any> {
    return this.simbolosService.data.pipe(
      map(response => {
        let simbologia = response.data;
        let ocurrencias = value.match(/\{(.*?)\}/g);
        let display_mana_cost = value.replace(/[{}]/g, '');
        let html: string = `<span title="${display_mana_cost}">`;

        let size: any = '28px';
        if (args.length > 0) {
          size = args[0];
        }

        if (ocurrencias) {
          for (let i = 0; i < ocurrencias.length; i++) {

            let simbolo_enc: any;
            let cod_simbolo = ocurrencias[i];

            simbologia.forEach((simbolo: any) => {
              if (simbolo.symbol === cod_simbolo) {
                simbolo_enc = simbolo;
              }
            });

            if (simbolo_enc) {
              console.log(simbolo_enc);
              html += `<img width="${size}" height="${size}"
                        src="${simbolo_enc.svg_uri}" alt="${simbolo_enc.english}"
                        class="" />`;
            }
          }
        }

        html += '</span>'
        return html;
      })
    );
  }
}