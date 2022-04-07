import { Component, Input, OnInit, PLATFORM_INITIALIZER } from '@angular/core';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { CartaWrap } from 'src/app/core/models/carta-wrap';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { Album } from 'src/app/pages/album/album';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-texto',
  templateUrl: './texto.component.html',
  styleUrls: ['./texto.component.css']
})
export class TextoComponent implements OnInit {
  
  @Input("album")
  album: Album;
  cargando: boolean = false;
  
  constructor(
    private scryfallService: ScryfallService,
    private albumService: AlbumService
    
  ) { }
    
  ngOnInit(): void {
    console.log(this.album);
  }
    
    
  exportarTexto(cartaArr: CartaWrap[]) {
    let texto : string = "";
    cartaArr.forEach( (carta: CartaWrap)  => {
      texto += carta.amount;
      texto += " ";
      texto += carta.data.name;
      texto += "\r\n";
    });
    let fileName: string = this.album.nombre + ".txt"

    let txtBlob = new Blob([texto], {
      type: "text/plain;charset=utf-8"
    })

    saveAs(txtBlob, fileName);
  }

  obtenerCartas(): void {
    console.log(this.album);

    this.cargando = true;
    this.albumService.getAllCartasFromAlbum(Number(this.album.id)).pipe(
      map((response: any) => {
        return response.map(carta => {
          this.scryfallService.fillCartaData(carta).subscribe(carta => {
            this.cargando = false;
          });
          return carta;
        })
      })
    ).subscribe(response => { 

      this.waitForBlob(response, (a)=>{this.exportarTexto(a)});

    });
  }

  /**
   * Función asíncrona que espera la obtención de los datos de carta
   */
   private async waitForBlob(cartas_resp: CartaWrap[], then: (res: any) => void) {
    console.log(cartas_resp);

    let loaded: boolean = false;
    let counter = 0;
    while (!loaded) {
      counter++;
      if (counter > 500) {
        Swal.fire({
          title: 'Alerta',
          text: 'No todas se pudieron obtener todas las cartas.',
          icon: 'warning'
        });
        then(cartas_resp);
      }
      loaded = true;
      await new Promise(f => setTimeout(f, 1000));
      for (let carta of cartas_resp) {
        if (carta.data == null) {
          loaded = false;
        }
      }
      if (loaded) {
        then(cartas_resp);
      }
    }
  }
}
      