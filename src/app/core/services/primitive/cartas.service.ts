import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../../config/endpoints';
import { Carta } from '../../models/carta';

@Injectable({
  providedIn: 'root'
})
export class CartasService {

  constructor(
    private http: HttpClient
  ) { }

  getPaginaFromAlbum(id: number, page: number, size:number) {
    return this.http.get<any>(Endpoints.GET_PAGINA_FROM_ALBUM.replace('{id}', id.toString()).replace('{page}', page.toString()), {params: {size: size.toString()}});
  }

  getAllCartasFromAlbum(id: number) {
    return this.http.get<any>(Endpoints.GET_ALL_CARTAS_FROM_ALBUM.replace('{id}', id.toString()));
  }

  putCartaInAlbum(id: number, carta: string) {
    return this.http.put<any>(Endpoints.PUT_CARTA_IN_ALBUM.replace('{id}', id.toString()), carta);
  }

  deleteCarta(id: number) {
    return this.http.delete(Endpoints.DELETE_CARTA.replace('{id}', id.toString()));
  }

  getXCartasAleatorias(x: number) {
    return this.http.get<any>(Endpoints.GET_X_CARTAS_ALEATORIAS.replace('{x}', x.toString()));
  }
}
