import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from 'src/app/core/models/carta';
import { SearchParams } from './search-params';

@Injectable({
  providedIn: 'root'
})
export class ScryfallService {

  private url: string = "http://api.scryfall.com/";
  constructor(
    private http: HttpClient
  ) { }

  public search(search_text: string, search_params?: SearchParams): Observable<any> {
    let url = this.url + "cards/search?q=" + encodeURIComponent(search_text);
    if (search_params) {
      url += "&" + this.serialize(search_params);
    }
    return this.http.get(url) as Observable<any>;
  }

  private serialize(obj: any): string {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }

  public getCard(id: string): Observable<any> {
    let url = this.url + "cards/" + id;
    return this.http.get(url);
  }

  public searchAutocomplete(name: string): Observable<any> {
    let url = this.url + "cards/autocomplete?q=" + name;
    const params = {
      pretty: "true",
      include_extras: "false",
    }
    url += "&" + this.serialize(params);
    return this.http.get(url);
  }

  public getSymbols(): Observable<any> {
    let url = this.url + "symbology";
    return this.http.get(url);
  }
}
