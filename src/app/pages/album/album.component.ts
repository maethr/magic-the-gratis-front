import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from './album';
import { ColeccionService } from '../../core/services/data/coleccion.service';

import { Carta } from 'src/app/core/models/carta';

import { ChangeDetectorRef } from '@angular/core';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { EdicionService } from '../../core/services/scryfall/edicion.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  
  album: Album;
  tam_fila: number = 3;

  id_album: number;
  cartas: Carta[];
  paginador: any;
  pagina: number;
  cargando: boolean = true;

  constructor(
    private albumService: AlbumService,
    private albumesService: ColeccionService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private router: Router,
    private simboloService: EdicionService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.pagina = +params.get('page');
      if (!this.pagina) {
        this.pagina = 0;
      }

      if (localStorage.getItem('tam_fila') != null) {
        this.tam_fila = +localStorage.getItem('tam_fila');
      }

      this.id_album = +params.get('id');
      this.albumesService.getAlbum(this.id_album).subscribe(response => {
        this.album = response as Album;
      });

      this.obtenerCartas(this.pagina);
      
    })
  }

  recargar (num: number) {
    this.tam_fila = this.tam_fila + num;
    this.pagina = 0;
    localStorage.setItem('tam_fila', this.tam_fila.toString());
    this.ref.detectChanges();
    if (num > 0 && this.paginador.last) {
      this.router.navigate(['/album', this.album.id, 'page', this.pagina])
    }
    this.obtenerCartas(this.pagina);
  }

  obtenerCartas(pagina: number): void {
    this.albumService.getPaginaAlbum(this.id_album, pagina, this.tam_fila ** 2).subscribe(response => {
      alert()
      console.log(response);
      this.cartas = response.content as Carta[];
      this.paginador = response;
      this.cargando = false;
    })
  }

}
