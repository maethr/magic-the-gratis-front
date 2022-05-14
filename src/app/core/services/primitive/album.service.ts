import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from 'src/app/pages/album/album';
import { Endpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(
    private http: HttpClient
  ) { }

  getAlbumById(id: number) {
    return this.http.get<Album>(Endpoints.GET_ALBUM_BY_ID.replace('{id}', id.toString()));
  }

  getAlbumsFromUserPaged(user: string, page: number) {
    return this.http.get<Album[]>(Endpoints.GET_ALBUMS_FROM_USER_PAGED.replace('{user}', user).replace('{page}', page.toString()));
  }

  getAllAlbumsFromUser(user: string) {
    return this.http.get<Album[]>(Endpoints.GET_ALL_ALBUMS_FROM_USER.replace('{user}', user));
  }

  countAlbumsFromUser(user: string) {
    return this.http.get<number>(Endpoints.COUNT_ALBUMS_FROM_USER.replace('{user}', user));
  }

  createAlbum(nombre: string, user: string) {
    return this.http.post<Album>(Endpoints.CREATE_ALBUM, { nombre: nombre, usuario: user });
  }

  editAlbum(id: number, nombre: string, portada: string) {
    return this.http.put<Album>(Endpoints.EDIT_ALBUM.replace('{id}', id.toString()), { nombre: nombre, portada: portada });
  }

  deleteAlbum(id: number) {
    return this.http.delete(Endpoints.DELETE_ALBUM.replace('{id}', id.toString()));
  }

  countCartasAlbum(id: number) {
    return this.http.get<number>(Endpoints.COUNT_CARTAS_ALBUM.replace('{id}', id.toString()));
  }
}
