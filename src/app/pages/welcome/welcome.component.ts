import { Component, OnInit } from '@angular/core';
import { Carta } from 'src/app/core/models/carta';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { CartaService } from 'src/assets/extra/old/carta.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  readonly cantidadMosaico = 28;

  cartas: Carta[] = [];

  constructor(
    private albumService: AlbumService,
    private scryfallService: ScryfallService
  ) { }

  ngOnInit(): void {
    this.albumService.getWelcomePage().subscribe(res => {
      let id_array = res as string[];
      id_array.forEach(id => {
        this.scryfallService.getCard(id).subscribe(carta => {
          this.cartas.push(carta as Carta);
        });
      });
    });
  }

}
