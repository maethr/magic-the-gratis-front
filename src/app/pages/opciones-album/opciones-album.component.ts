import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Album } from '../album/album';

import { ColeccionService } from '../../core/services/data/coleccion.service';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartaWrap } from 'src/app/core/models/carta-wrap';
import { Carta } from 'src/app/core/models/carta';
import { CartaWrapBlob } from './carta-wrap-blob.model';
import { CartaService } from 'src/app/core/services/local/carta.service';
import { map } from 'rxjs/operators';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';


@Component({
  selector: 'app-opciones-album',
  templateUrl: './opciones-album.component.html',
  styleUrls: ['./opciones-album.component.css']
})
export class OpcionesAlbumComponent implements OnInit {

  id_album: number;
  errores: string[];

  album: Album;
  formAlbum: FormGroup;

  constructor(
    private albumService: AlbumService,
    private albumesService: ColeccionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartaService: CartaService,
    private scryfallService: ScryfallService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.id_album = +params.get('id');
      this.albumesService.getAlbum(this.id_album).subscribe(
        response => {
          this.album = response as Album;
          this.formAlbum = this.fb.group({
            nombre: [this.album.nombre, Validators.required]
          })
        }
      );
    });
  }

  editar(): void {
    this.albumService.update(this.album.id, this.formAlbum.value.nombre).subscribe(
      response => {
        this.album = response;
        this.router.navigate(['/album', this.album.id]);
      }
    )

  }

  eliminarAlbum() {
    this.albumService.deleteAlbum(Number(this.album.id)).subscribe(
      response => {
        console.log(response);
      }
    );
    this.router.navigate(['/coleccion']);
  }

  getBase64Image(img_src: string) {
    var img = document.createElement("img");
    img.src = img_src;

    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  async descargarZip() {
    var zip = new JSZip();

    // Crear función en el back que envíe todas las cartas de un album (sin paginar)
    // y que las devuelva en un array de cartas.
    // Luego, recorrer el array y crear un archivo por cada carta.
    // zip.file(carta.data.nombre + ' - ' + carta.data.set + ' - ' + carta.data.id + '.png', carta.imagen);

    let cartas_resp: CartaWrapBlob[] = [];

    this.albumService.getAllCartasFromAlbum(this.id_album).pipe(
      map((response: any) => {
        console.log(response);
        (response as any[]).map((res: CartaWrapBlob) => {
          this.scryfallService.fillCartaData(res).subscribe((carta: CartaWrapBlob) => {
            let url = this.cartaService.getBestImageDefault(carta.data);

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onload = () => {
              let blob = xhr.response;
              var r = new FileReader();
              r.onload = function () {
                carta.main_image_object = r.result;
                zip.file(carta.data.name.replace(/\//g, '-') + '-' + carta.data.set + '-' + carta.data.id + '.png', carta.main_image_object, { binary: true });
              };
              r.readAsBinaryString(blob);
            };
            xhr.send();

            // fetch(url).then((response) => {
            //   return response.blob();
            // }).then((myBlob) => {
            //   // carta.main_image_object = myBlob;
            //   var objectURL = URL.createObjectURL(myBlob);
            //   carta.main_image_object = objectURL;
            //   // myBlob.arrayBuffer().then((buffer) => {
            //   //   // var byteArray = new Uint8Array(buffer);
            //   //   console.log("blob obtenido for ", carta);
            //   //   carta.main_image_object = buffer;
            //   // });

            // });
          });
        });
        return response;
      })
    ).subscribe(
      response => {
        cartas_resp = response as CartaWrapBlob[];
      });

    let loaded: boolean = false;
    while (!loaded) {
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
      }
    }

    // cartas_resp.forEach((carta: CartaWrapBlob) => {
    // });

    zip.generateAsync({ type: "blob" })
      .then(function (blob) {
        saveAs(blob, "hello.zip");
      });

    console.log("archivos generados");
  }
}
