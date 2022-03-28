import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { CartaService } from 'src/app/core/services/local/carta.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { CartaWrapBlob } from 'src/app/pages/opciones-album/carta-wrap-blob.model';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Album } from 'src/app/pages/album/album';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-zip',
  templateUrl: './zip.component.html',
  styleUrls: ['./zip.component.css']
})
export class ZipComponent implements OnInit {

  @Input("album")
  album: Album;

  @Input("repetidas")
  guardar_repetidas: boolean = false;

  length: number;
  file_ready: boolean = false;
  cargando: boolean = false;
  download_progress: string;
  cartas_resp: CartaWrapBlob[] = [];

  constructor(
    private albumService: AlbumService,
    private cartaService: CartaService,
    private scryfallService: ScryfallService
  ) { }

  ngOnInit(): void {
  }

  generarZip() {
    this.file_ready = false;
    this.cargando = true;
    let id_album = Number(this.album.id);

    this.albumService.getAllCartasFromAlbum(id_album).pipe(
      map((response: any[]) => {
        this.length = response.length;

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
                console.log("ZWAAAAAAAAAAAAAAAAP", r.result);
                carta.main_image_object = r.result;
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
        this.waitForZip();
      }
    );
  }

  private async waitForZip() {
    let loaded: boolean = false;
    let counter = 0;
    while (!loaded) {
      counter++;
      if (counter > 5) {
        this.cargando = false;
        this.file_ready = true;
        Swal.fire({
          title: 'Alerta',
          text: 'No todas se pudieron obtener todas las cartas.',
          icon: 'warning'
        });
        return;
      }
      let loaded_now = true;
      await new Promise(f => setTimeout(f, 1000));
      for (let carta of this.cartas_resp) {
        if (carta.data == null || carta.main_image_object == null) {
          loaded_now = false;
          console.log("esperando carta ", carta);
        }
      }
      if (loaded_now) {
        console.log("ya están todas las cartas");
        loaded = true;
        this.file_ready = true;
        this.cargando = false;
      }
    }
  }

  downloadZip() {
    if (!this.file_ready) {
      alert('File not ready yet.');
      return;
    }

    this.cargando = true;
    var zip = new JSZip();
    this.cartas_resp.forEach((carta: CartaWrapBlob) => {
      let nombreCarta = carta.data.name.replace(/\//g, '-');
      nombreCarta = nombreCarta + ' - ' + carta.data.set.toUpperCase() + ' - ' + carta.data.id.slice(0, 5);
      if (this.guardar_repetidas)
        nombreCarta += '-' + carta.id;

      for (let i = 0; i < carta.amount; i++) {
        let filename: string = nombreCarta;
        if (this.guardar_repetidas)
          filename += '-' + Math.floor(Math.random() * 100000);

        filename += '.' + carta.main_image_type;
        zip.file(
          filename,
          carta.main_image_object,
          { binary: true }
        );
      }
    });

    this.download_progress = "0%";
    zip.generateAsync({ type: "blob" }, (metadata) => {
      this.download_progress = Math.floor(metadata.percent) + "%";
    }).then((blob) => {
      let fecha = new Date().toISOString().slice(0, 10);
      saveAs(blob, this.album.nombre + '-' + fecha + ".zip");
      this.download_progress = "Espera un momento";
      setTimeout(() => {
        this.cargando = false;
      }, 1000);
    });
  }
}
