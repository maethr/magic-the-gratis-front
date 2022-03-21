import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

import { Album } from '../album/album';

import { ColeccionService } from '../../core/services/data/coleccion.service';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


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

    this.activatedRoute.paramMap.subscribe(params =>{
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

  descargarZip() {
    window.location.assign(`aaaaaaaaaaaaaaa`); 
  }
}
