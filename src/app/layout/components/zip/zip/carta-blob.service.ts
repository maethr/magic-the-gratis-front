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

  length: number = 0;
  album_id: number;
  img_quality: string;

  constructor(
    private albumService: AlbumService,
    private scryfallService: ScryfallService,
  ) { }

  /**
   * Configura la generación de las imagenes
   * @param album_id id del album
   * @param img_quality calidad de las imagenes
   */
  setAlbum(album_id: any, img_quality: string) {
    this.album_id = Number(album_id);
    this.img_quality = img_quality;
  }

  /**
   * Método principal del servicio.
   * Hace falta llamar primero a setAlbum para establecer la configuración.
   * Realiza las llamadas que obtienen los blobs de las imagenes de las cartas,
   * y llama a waitForBlob para esperar a que se obtengan todas.
   * @param then Función que se ejecuta cuando se han obtenido todas las imagenes.
   */
  generarBlob(then: (res: any) => void) {
    this.albumService.getAllCartasFromAlbum(this.album_id).pipe(
      map((response: any[]) => {
        this.length = response.length;

        response.forEach((res: CartaWrapBlob) => {
          this.scryfallService.fillCartaData(res).subscribe(async (carta: CartaWrapBlob) => {

            while (!carta.main_image) {
              await new Promise(f => setTimeout(f, 1000));
            }

            let url = this.getImageUrl(carta);
            carta.main_image_type = (carta.main_image.png == url) ? 'png' : 'jpg';

            let random = Math.floor(Math.random() * 10000);
            url = url + "?foo=" + random;

            this.imageRequestXHR(url, (res: any) => {
              carta.main_image_object = res.target.result;
            });

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

  /**
   * Obtiene la url de la imagen según la calidad seleccionada
   */
  private getImageUrl(carta: CartaWrapBlob) {
    switch (this.img_quality) {
      case 'mini':
        return carta.main_image.small;
      case 'med':
        return carta.main_image.normal;
      case 'high':
        return carta.main_image.large;
      case 'best':
        return carta.main_image.png;
      case 'artwork':
        return carta.main_image.art_crop;
    }
  }

  /**
   * Obtención del blob de una imagen usando XmlHttpRequest
   */
  private imageRequestXHR(url: string, then: (res: any) => void) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = () => {
      let blob = xhr.response;
      var r = new FileReader();
      r.onload = then;
      r.readAsBinaryString(blob);
    };
    xhr.send();
  }

  /**
   * Obtención del blob de una imagen usando FetchAPI
   */
  private imageRequestFetch(url: string, then: (res: any) => void) {
    fetch(url, { mode: 'cors' })
      .then(response => response.blob())
      .then(blob => {
        var r = new FileReader();
        r.onload = then;
        r.readAsBinaryString(blob);
      });
  }

  /**
   * Función asíncrona que espera la obtención de las imagenes
   */
  private async waitForBlob(cartas_resp: CartaWrapBlob[], then: (res: any) => void) {
    let loaded: boolean = false;
    let counter = 0;
    while (!loaded) {
      counter++;
      if (counter > 50) {
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
        if (carta.data == null || carta.main_image_object == null) {
          loaded = false;
        }
      }
      if (loaded) {
        then(cartas_resp);
      }
    }
  }
}
