import { Injectable } from '@angular/core';
import { AlbumService } from '../data/album.service';
import { ScryfallService } from '../scryfall/scryfall.service';

@Injectable({
  providedIn: 'root'
})
export class ImportacionService {

  constructor(
    private scryfallService: ScryfallService,
    private albumService: AlbumService
  ) { }

  processText(text: string): any {

  }
}
