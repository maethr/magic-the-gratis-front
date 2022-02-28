import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimbolosService {

  simbologia: any = [];

  private _cachedData:  Subject<any>;
  public data: Observable<any>;

  private url: string = "http://api.scryfall.com/";
  constructor(
    private http: HttpClient
  ) {
    this.initializeData();
  }

  refreshData() {
    let url = this.url + "symbology";
    this.http.get(url).subscribe(res => {
      console.log("PETICIÓN", res);
      this._cachedData.next(res)
    });
  }

  initializeData() {
    if (!this._cachedData) {
      this._cachedData = new Subject<any>();
      this.data = this._cachedData.asObservable();
      this.refreshData();
    }
  }
}
