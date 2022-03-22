import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';
import * as JSZip from 'jszip';

import { Album } from '../album/album';

import { ColeccionService } from '../../core/services/data/coleccion.service';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartaWrap } from 'src/app/core/models/carta-wrap';
import { Carta } from 'src/app/core/models/carta';


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

  async descargarZip() {
    var zip = new JSZip();

    // Crear función en el back que envíe todas las cartas de un album (sin paginar)
    // y que las devuelva en un array de cartas.
    // Luego, recorrer el array y crear un archivo por cada carta.
    // zip.file(carta.data.nombre + ' - ' + carta.data.set + ' - ' + carta.data.id + '.png', carta.imagen);

    let cartas_resp: CartaWrap[] = [];

    this.albumService.getAllCartasFromAlbum(this.id_album).subscribe(
      response => {
        cartas_resp = response as CartaWrap[];
        console.log("response", response);

      });

    let loaded: boolean = false;
    while (!loaded) {
      let loaded_now = true;
      await new Promise(f => setTimeout(f, 1000));
      for (let carta of cartas_resp) {
        if (carta.data == null) {
          loaded_now = false;
        }
      }
      if (loaded_now) {
        loaded = true;
      }
    }

    cartas_resp.forEach((carta: CartaWrap) => {
      console.log("carta", carta);
      zip.file(' - ' + carta.data.set + ' - ' + carta.data.id + '.png', carta + '\n\n\n' + carta.main_image.png);
    });

    zip.generateAsync({ type: "base64" }).then((base64) => {
      window.open("data:application/zip;base64," + base64);
    }, (err) => {
    });
  }
}
