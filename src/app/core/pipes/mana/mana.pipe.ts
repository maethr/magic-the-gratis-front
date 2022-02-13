import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ScryfallService } from '../../services/scryfall/scryfall.service';

@Pipe({
  name: 'mana'
})
export class ManaPipe implements PipeTransform {
  symbols = [];

  constructor(
    private http: HttpClient,
    private scryfall: ScryfallService
  ) {
  }

  async getSymbols() {
    if (this.symbols.length == 0) {
      let res = await this.scryfall.getSymbols().toPromise();
      this.symbols = res.data;
      console.log("Symbols:");
      console.log(this.symbols);
    }
  }

  async transform(value: string, ...args: unknown[]) {
    let result = "";
    let simbolos_carta = value.match("\{(.+?)\}");

    await this.getSymbols(); 
    /* this.scryfall.getSymbols().subscribe(
      (data: any) => {
        symbols = data.data; */

    for (let s = 0; s < simbolos_carta.length; s++) {
      console.log("S:")
      console.log(simbolos_carta[s]);
      for (let i = 0; i < this.symbols.length; i++) {
        console.log("I:")
        console.log(this.symbols[i].symbol);
        if (this.symbols[i].symbol == simbolos_carta[s]) {
          result += '<img src="' + this.symbols[i].svg_uri + '" alt="' + this.symbols[i].symbol + '">';
        }
      }
    }

    console.log("AAAAAAA");
    console.log(result);
    return result;
    /*
   }); */

  }
}
