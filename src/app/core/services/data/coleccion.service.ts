import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Album } from '../../../pages/album/album';
import { ScryfallService } from '../scryfall/scryfall.service';

@Injectable()
export class ColeccionService {

  private url: string = "http://localhost:8080/collector";
  constructor(
    private http: HttpClient,
    private scryfallService: ScryfallService
  ) { }

  getAlbumes(username: string, page: string): Observable<any> {
    let url = this.url + "/user";
    let params = new HttpParams().set("page", page);
    return this.http.get(`${url}/${username}/albums`, { params: params }).pipe(
      map((response: any) => {
        (response.content as Album[]).map(album => {
          if (album.portada) {
            this.scryfallService.fillCartaData(album.portada).subscribe();
          }
          return album;
        });
        return response;
      }
      )
    );
  }

  getAllAlbumes(username: string): Observable<any> {
    let url = this.url + "/user";
    return this.http.get(`${url}/${username}/albums/all`).pipe(
      map((response: any) => {
        
        return response as Album[];
      }
      )
    );
  }

  getAlbum(id: number):Observable<any>{
    let url = this.url + "/album";
    return this.http.get(`${url}/${id}`).pipe(
      map((response: any) => {
        return response as Album;
      })
    )

  }

  createAlbum(nombreAlbum: string, username: string): Observable<any>{
    let url = this.url + "/album";
    console.log(nombreAlbum);
    let params = new HttpParams().set("nombre", nombreAlbum).set("usuario", username);
    
    console.log(params);
    return this.http.post(`${url}`, params).pipe(
      map((response: any) => {
        console.log(response);
        return response as Album;
      })
    );
  }

  editarAlbum(id: number, nombre?: string, portada?: number): Observable<any>{
    let url = this.url + "/album";
    let params = new HttpParams()
                .set("id", id)
                .set("nombre", nombre)
                .set("portada", portada);
    return this.http.put(`${url}`, params );
  }

}
