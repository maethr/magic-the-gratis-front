import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { CartaWrapBlob } from 'src/app/pages/opciones-album/carta-wrap-blob.model';
import Swal from 'sweetalert2';

/**
 * Servicio que gestiona la descarga de imagenes en lote.
 * @author Miguel Bautista Pérez
 */
@Injectable({
  providedIn: 'root'
})
export class CartaBlobService {

  constructor(
    private albumService: AlbumService,
    private scryfallService: ScryfallService,
  ) { }

  file_ready: boolean = false;
  cargando: boolean = false;
  length: number = 0;

  album_id: number;
  img_quality: string;

  setAlbum(album_id: any, img_quality: string) {
    this.album_id = Number(album_id);
    this.img_quality = img_quality;
  }

  generarBlob(then: (res: any) => void) {
    this.albumService.getAllCartasFromAlbum(this.album_id).pipe(
      map((response: any[]) => {
        this.length = response.length;

        response.forEach((res: CartaWrapBlob) => {
          this.scryfallService.fillCartaData(res).subscribe(async (carta: CartaWrapBlob) => {

            while (!carta.main_image) {
              await new Promise(f => setTimeout(f, 1000));
            }

            let url: any;
            switch (this.img_quality) {
              case 'mini':
                url = carta.main_image.small;
                break;
              case 'med':
                url = carta.main_image.normal;
                break;
              case 'high':
                url = carta.main_image.large;
                break;
              case 'best':
                url = carta.main_image.png;
                break;
              case 'artwork':
                url = carta.main_image.art_crop;
                break;
            }
            carta.main_image_type = (carta.main_image.png == url) ? 'png' : 'jpg';

            let random = Math.floor(Math.random() * 10000);
            url = url + "?foo=" + random;

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onload = () => {
              let blob = xhr.response;
              var r = new FileReader();
              r.onload = () => {
                carta.main_image_object = r.result;
              };
              r.readAsBinaryString(blob);
            };
            xhr.send();

            // WITH FETCH:
            // fetch(url, {mode: 'cors'})
            //   .then(response => response.blob())
            //   .then(blob => {
            //     var r = new FileReader();
            //     r.onload = () => {
            //       carta.main_image_object = r.result;
            //     };
            //     r.readAsBinaryString(blob);
            //   });
          });
        });
        return response;
      })
    ).subscribe(
      response => {
        let cartas_resp = response as CartaWrapBlob[];
        this.waitForBlob(cartas_resp, then);
      }
    );
  }

  private async waitForBlob(cartas_resp: CartaWrapBlob[], then: (res: any) => void) {
    let loaded: boolean = false;
    let counter = 0;
    while (!loaded) {
      counter++;
      if (counter > 50) {
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
      for (let carta of cartas_resp) {
        if (carta.data == null || carta.main_image_object == null) {
          loaded_now = false;
          console.log("esperando carta ", carta);
        }
      }
      if (loaded_now) {
        console.log("ya están todas las cartas");
        loaded = true;
        this.file_ready = true;
        then(cartas_resp);
      }
    }
  }
}
