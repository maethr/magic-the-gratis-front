import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Carta } from 'src/app/core/models/carta';
import { CartaWrap } from '../../models/carta-wrap';
import { CartaService } from '../local/carta.service';
import { SearchParams } from './search-params';

/**
 * Servicio que ataca a la API de Scryfall para obtener los datos de
 * las cartas y sus imagenes.
 * @author Miguel Bautista Pérez
 */
@Injectable({
  providedIn: 'root'
})
export class ScryfallService {

  private url: string = "http://api.scryfall.com/";
  constructor(
    private http: HttpClient,
    private cartaService: CartaService
  ) { }

  public search(search_text: string, search_params?: SearchParams): Observable<any> {
    let url = this.url + "cards/search?q=" + encodeURIComponent(search_text);
    if (search_params) {
      url += "&" + this._serialize(search_params);
    }
    return this.http.get(url) as Observable<any>;
  }

  public getCard(id: string): Observable<any> {
    let url = this.url + "cards/" + id;
    return this.http.get(url);
  }

  public fillCartaData(res: CartaWrap): Observable<any> {
    return this.getCard(res.scryfall_id).pipe(map(carta_scryfall => {
      res.data = carta_scryfall as Carta;
      res.main_image = this.cartaService.getDefaultImageUris(res.data);
      return res;
    }));
  }

  public searchAutocomplete(name: string): Observable<any> {
    let url = this.url + "cards/autocomplete?q=" + name;
    const params = {
      pretty: "true",
      include_extras: "false",
    }
    url += "&" + this._serialize(params);
    return this.http.get(url);
  }

  public getSymbols(): Observable<any> {
    let url = this.url + "symbology";
    return this.http.get(url);
  }

  public getCardByName(name: string): Observable<any> {
    let type = "fuzzy";
    let url = `${this.url}cards/named?${type}=${name}`;
    return this.http.get(url);
  }

  private _serialize(obj: any): string {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }
}
