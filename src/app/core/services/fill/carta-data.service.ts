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

  getAllCartasFromAlbum(id: number, then?: (res: CartaWrap[]) => void) {
    return this.cartasService.getAllCartasFromAlbum(id).pipe(map((response: any) => {
      return response.map((carta: CartaWrap) => {
        this.scryfallService.fillCartaData(carta).subscribe((carta: CartaWrap) => {
          if (then) {
            then(response);
          }
        });
        return carta;
      })
    }));
  }

  getAllAlbumesFromUser(username: string, then?: (res: Album[]) => void) {
    return this.albumService.getAllAlbumsFromUser(username).pipe(map((response: any) => {
      return response.map((album: Album) => {
        if (album.portada) {
          this.scryfallService.fillCartaData(album.portada).subscribe((carta: CartaWrap) => {
            if (then) {
              then(response);
            }
          });
        }
        return album;
      });
    }));
  }
}
