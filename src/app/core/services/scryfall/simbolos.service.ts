import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {

  private url: string = "http://api.scryfall.com/";
  constructor(
    private http: HttpClient
  ) { }

  sim_data: any;

  async _initialize() {
    try {
      await this.initialize().toPromise();
      return;
    } catch (err) { }
  }

  initialize() {
    let url = this.url + "symbology";
    return this.http.get(url).pipe(
      map((response: any) => {
        this.sim_data = response.data as any;
        console.log("SIMBOLOGIA", this.sim_data);
      })
    );
  }

  getSimbolo(cod_simbolo: string): any {
    if (!this.sim_data) {
      this.sim_data = new Object();
      this._initialize();
    }
    let simbolo_enc: any;
    this.sim_data.forEach((simbolo: any) => {
      if (simbolo.symbol === cod_simbolo) {
        simbolo_enc = simbolo;
      }
    });
    return simbolo_enc;
  }
}
