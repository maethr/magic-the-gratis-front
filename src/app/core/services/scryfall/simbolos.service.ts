import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { Edicion } from '../../models/edicion';

/**
 * Servicio que ataca a la API de Scryfall para obtener los datos de
 * los simbolos de Magic y sus imagenes.
 * @author Miguel Bautista Pérez
 */
@Injectable({
  providedIn: 'root'
})
export class SimbolosService {

  private url: string = "http://api.scryfall.com/";
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Simbología entera de scryfall.
   * Cóncretamente el .data de la respuesta de la API de scryfall.
   */
  sim_data: any;

  /**
   * Todos los Sets de ediciones de scryfall.
   * Cóncretamente el .data de la respuesta de la API de scryfall.
   */
  public sets_data: Edicion[];

  /**
   * Inicializa el servicio. En teoría, solo se llama una vez, al inicio de la aplicación.
   * @returns Promise<void>
   */
  async initialize() {
    try {
      await this.getSimbologia().pipe(timeout(3000)).toPromise(); // LOL
      await this.getSets().pipe(timeout(3000)).toPromise(); // RE-LOL
      return;
    } catch (err) { }
  }

  /**
   * Obtiene toda la simbología de scryfall.
   * Solo se le llama desde la inicialización del servicio.
   * @returns Observable que será ejecutado al inicio de la aplicación.
   */
  getSimbologia(): Observable<any> {
    let url = this.url + "symbology";
    return this.http.get(url).pipe(
      map((response: any) => {
        this.sim_data = response.data as any;
        console.log("SIMBOLOGIA", this.sim_data);
      })
    );
  }

 /**
  * Obtiene todos los SETS de SCRYFALL.
  * Se la llama desde la inicialización del servicio.
  * @returns Observable que será ejecutado al inicio de la aplicación.
  */
  getSets(): Observable<any> {
    let url = this.url + "sets";
    return this.http.get(url).pipe(
      map((response: any) => {
        this.sets_data = response.data as Edicion[];
        console.log("SETS", this.sets_data);
      })
    );
  }

  /**
   * Obtiene un simbolo de SET de magic a partir de su código entre {}.
   * @param cod_set string con el código de set a buscar
   * @returns el objeto de set de Scryfall correspondiente
   */
   getSet(cod_set: string): any {
    if (!this.sets_data) {
      this.sets_data = []; // Placeholder
      this.initialize();
    }
    let set_enc: any;
    this.sets_data.forEach((set: any) => {
      if (set.symbol === cod_set) {
        set_enc = set;
      }
    });
    return set_enc;
  }

  /**
   * Obtiene un simbolo de magic a partir de su código entre {}.
   * @param cod_simbolo string con el código de simbolo a buscar
   * @returns el objeto de símbolo de Scryfall correspondiente
   */
  getSimbolo(cod_simbolo: string): any {
    if (!this.sim_data) {
      this.sim_data = new Object(); // Placeholder
      this.initialize();
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
