import { Component, Input, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import { map } from 'rxjs/operators';
import { CartaWrap } from 'src/app/core/models/carta-wrap';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { CartaService } from 'src/app/core/services/local/carta.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { Album } from 'src/app/pages/album/album';
import { CartaWrapBlob } from 'src/app/pages/opciones-album/carta-wrap-blob.model';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

  @Input() album: Album;

  file_ready: boolean = false;
  cargando: boolean = false;
  length: number;
  cartas_resp: CartaWrapBlob[] = [];

  pdf = new jsPDF();

  constructor(
    private albumService: AlbumService,
    private cartaService: CartaService,
    private scryfallService: ScryfallService
  ) { }

  ngOnInit(): void {
  }

  __generarPdf() {
    var pdf = new jsPDF();
    var img = new Image;
    img.onload = function () {
      pdf.addImage(img, 'JPEG', 0, 0, 63.5, 88);
      pdf.save("CTStest.pdf");
    };
    img.crossOrigin = "";

    img.src = "https://c1.scryfall.com/file/scryfall-cards/png/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.png?1628801721";
  }

  _generarPdf() {
    this.file_ready = false;
    this.cargando = true;
    let id_album = Number(this.album.id);

    this.albumService.getAllCartasFromAlbum(id_album).pipe(
      map((response: any[]) => {
        this.length = response.length;

        let x = 180;
        let y = 270;
        let tam_x = 63.5;
        let tam_y = 88;

        response.map((res: CartaWrapBlob) => {
          console.log(this.length);
          this.scryfallService.fillCartaData(res).subscribe((carta: CartaWrapBlob) => {
            let url = this.cartaService.getBestImageDefault(carta.data);
            carta.main_image_type = (carta.main_image.png == url) ? 'png' : 'jpg';

            var img = new Image;


            img.onload = () => {
              x += tam_x;
              y += tam_y;

              if (x > 180) {
                x = 0;
              }
              if (y > 270) {
                y = 0;
              }
              this.pdf.addImage(img, carta.main_image_type.toUpperCase(), x, y, tam_x, tam_y);
              this.cargando = false;
              this.file_ready = true;
            };

            img.crossOrigin = "anonymous";
            img.src = carta.main_image.png;

          });
        });

        return response;
      })
    ).subscribe((response) => {


      this.cartas_resp = response as CartaWrapBlob[];
    });
  }


  generarPdf() {
    this.file_ready = false;
    this.cargando = true;
    let id_album = Number(this.album.id);

    this.albumService.getAllCartasFromAlbum(id_album).pipe(
      map((response: any[]) => {
        this.length = response.length;

        let x = -0.2;
        let y = 0;
        let tam_x = 63.5;
        let tam_y = 88;

        response.map((res: CartaWrapBlob) => {
          console.log(this.length);
          this.scryfallService.fillCartaData(res).subscribe((carta: CartaWrapBlob) => {
            let url = this.cartaService.getBestImageDefault(carta.data);
            carta.main_image_type = (carta.main_image.png == url) ? 'png' : 'jpg';

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onload = () => {
              let blob = xhr.response;
              var r = new FileReader();
              r.onload = () => {
                carta.main_image_object = r.result;

                console.log(x, y);

                if (x >= 190) {
                  x = 0;
                  y += tam_y;
                  y+=0.2;
                } else {
                  x+=0.2;
                }
                if (y >= 264) {
                  y = 0;
                  this.pdf.addPage();
                }

                this.pdf.addImage(carta.main_image_object, carta.main_image_type.toUpperCase(), x+10, y+10, tam_x, tam_y);
                this.cargando = false;
                this.file_ready = true;
                x += tam_x;
              };
              r.readAsBinaryString(blob);
            };
            xhr.send();
          });
        });
        return response;
      })
    ).subscribe(
      response => {
        this.cartas_resp = response as CartaWrapBlob[];
      }
    );
  }


  _descargarPdf() {
    this.cargando = true;
    this.pdf.save("CTStest.pdf");
    this.cargando = false;
  }
}

