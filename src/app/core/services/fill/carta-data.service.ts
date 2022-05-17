import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Album } from 'src/app/pages/album/album';
import { Carta } from '../../models/carta';
import { CartaWrap } from '../../models/carta-wrap';
import { AlbumService } from '../primitive/album.service';
import { CartasService } from '../primitive/cartas.service';
import { ScryfallService } from '../scryfall/scryfall.service';

@Injectable({
  providedIn: 'root'
})
export class CartaDataService {

  constructor(
    private albumService: AlbumService,
    private cartasService: CartasService,
    private scryfallService: ScryfallService
  ) { }

  getAllCartasFromAlbum(id: number, then?: (res: CartaWrap[]) => void, onEach?: (res: CartaWrap) => void) {
    return this.cartasService.getAllCartasFromAlbum(id).pipe(map((response: any) => {
      let cartas = response.map((carta: CartaWrap) => {
        this.scryfallService.fillCartaData(carta).subscribe((carta: CartaWrap) => {
          if (onEach) {
            onEach(carta);
          }
        });
        return carta;
      });
      if (then) {
        then(cartas);
      }
      return cartas;
    }));
  }

  getAllAlbumesFromUser(username: string, then?: (res: Album[]) => void, onEach?: (res: Album) => void) {
    return this.albumService.getAllAlbumsFromUser(username).pipe(map((response: any) => {
      let albumes = response.map((album: Album) => {
        this.albumService.countCartasAlbum(Number(album.id)).subscribe(
          response => {
            album.totalCartas = response as number;
          }
        );
        if (album.portada) {
          this.scryfallService.fillCartaData(album.portada).subscribe((carta: CartaWrap) => {
            if (onEach) {
              onEach(album);
            }
          });
        }
        return album;
      });
      if (then) {
        then(albumes);
      }
      return albumes;
    }));
  }
}
