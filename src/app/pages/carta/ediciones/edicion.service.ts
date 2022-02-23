import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Edicion } from '../../../core/models/edicion';

@Injectable()
export class EdicionService {

  private url: string = "http://localhost:8080";

  constructor(
    private http: HttpClient
  ) { }

  getEdicion(set_code: string): Observable<any> {
    let url = "https://api.scryfall.com/sets";
    return this.http.get(`${url}/${set_code}`).pipe(
      map((response: any) => {
       return response as Edicion;
      })
    );
  }

  getIconSVG(set_code:string): Observable<string> {
    let url = "https://api.scryfall.com/sets";
    return this.http.get(`${url}/${set_code}`).pipe(
      map((response: any) => {
       return response.icon_svg_uri as string;
      })
    );
  }
}