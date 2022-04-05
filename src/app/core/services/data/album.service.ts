import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Carta } from 'src/app/core/models/carta';
import { Album } from 'src/app/pages/album/album';
import { ScryfallService } from '../scryfall/scryfall.service';
import { CartaWrap } from '../../models/carta-wrap';
import { CartaService } from '../local/carta.service';


@Injectable()
export class AlbumService {

  private url: string = "http://localhost:8080/collector";
  constructor(
    private http: HttpClient,
    private scryfallService: ScryfallService
  ) { }

  getPaginaAlbum(id:number, page: number, size:number): Observable<any>{
    let url = this.url + "/album";
    let params = new HttpParams().set("page", page.toString()).set("size", size.toString());

    return this.http.get(`${url}/${id}/${page}`, {params: params}).pipe(
      map((response: any) => {
        (response.content as any[]).map((res: CartaWrap) => {
          this.scryfallService.fillCartaData(res).subscribe();
        });
        return response;
      })
    );
  }

  getPortadaAlbum(id:number): Observable<any>{
    return this.http.get<any>(this.url + "/album/" + id + "/portada").pipe(
      map((response: any) => {
          this.scryfallService.fillCartaData(response).subscribe();
      })
    );
  }

  getAllCartasFromAlbum(id : number): Observable<any> {
    return this.http.get<any>(this.url + `/album/${id}/all`);
  }

  putCartaInAlbum (scryfall_id: string, album_id: number, amount?: number): Observable<any> {
    if (amount == null) {
      amount = 1;
    }
    let url = this.url +  "/album";
    let params = new HttpParams().set("carta", scryfall_id).set("n", amount.toString());
    return this.http.put(`${url}/${album_id}`, params);
  }

  deleteCarta (id: number): Observable<any> {
    let url = this.url +  "/album";
    alert("A");
    let params = new HttpParams().set("carta", id.toString());
    return this.http.delete(`${url}`, { params });
  }

  update(id: string, nombre: string): Observable<any>{
    let url  =  this.url + "/album";
    let params = new HttpParams().set("id", id).set("nombre", nombre);
    return this.http.put<any>(`${url}`, params).pipe( 
      map ((response: any) => {
        return response as Album;
      }
    ));
  }

  _update(id: string, album: Album): Observable<any>{
    let url  =  this.url + "/editar-album";
    let params = new HttpParams().set("id", id);
    return this.http.put<any>(`${url}`, album, { params }).pipe( 
      map ((response: any) => {
        return response as Album;
      }
    ));
  }

  getWelcomePage(q: number): Observable<any> {
    return this.http.get<any>(this.url + "/welcome/" + q);
  }

  countCartasAlbum(id : number): Observable<any> {
    return this.http.get<any>(this.url + `/album/${id}/contar-cartas`);
  }

  deleteAlbum(id : number): Observable<any>{
    return this.http.delete<any>(this.url + "/album/" + id);
  }
}