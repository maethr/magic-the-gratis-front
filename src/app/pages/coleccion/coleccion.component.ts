import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from '../album/album';
import { ColeccionService } from '../../core/services/data/coleccion.service';
import { Usuario } from '../../core/models/usuario';
import { UsuarioService } from '../../core/services/data/usuario.service';
import Swal from 'sweetalert2';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { CartaWrap } from 'src/app/core/models/carta-wrap';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-coleccion',
  templateUrl: './coleccion.component.html',
  styleUrls: ['./coleccion.component.css']
})
export class ColeccionComponent implements OnInit {

  id: string;
  usuario: Usuario;
  albums: Album[];
  albumsPagina: Album[];

  paginador: any;

  numAlbumsPagina = 12;
  totalAlbums: number;

  @ViewChild('p', { static: false }) paginator: Paginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coleccionService: ColeccionService,
    private usuarioService: UsuarioService,
    private scryfallService: ScryfallService,
    private albumService: AlbumService,
    private router: Router
  ) {
    this.usuario = this.usuarioService.usuario
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let pagina: number = +params.get('page');
      if (!pagina) {
        pagina = 0;
      }

      this.obtenerAlbumes();
    });
  }

  obtenerAlbumes() {
    this.coleccionService.getAllAlbumes(this.usuario.username).subscribe(
      (response) => {
        console.log(response);
        this.albums = response as Album[];
        this.albums.forEach(album => {
          this.contarCartasAlbum(album);
        });
        this.albumsPagina = this.albums.slice(0, this.numAlbumsPagina);
        this.totalAlbums = this.albums.length;
      }
    );
  }

  paginate(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let indice = ((event.page) * event.rows);
    this.albumsPagina = this.albums.slice(indice, indice + event.rows);
  }

  contarCartasAlbum(album: Album) {
    this.albumService.countCartasAlbum(Number(album.id)).subscribe(
      response => {
        album.totalCartas = response as number;
        console.log(album);
        console.log("RESPONSE: " + response);
      }
    )
  }

  crearAlbum() {
    Swal.fire({
      title: "Nuevo album",
      text: "Ponle un título a tu album",
      inputPlaceholder: "Album Épico",
      input: 'text',
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value !== '') {
            resolve(null);
          } else {
            resolve('Debes escoger un nombre para tu album');
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.coleccionService.createAlbum(result.value, this.usuario.username).subscribe(
          (response) => {
            this.router.navigate(['album', response.id]);
            Swal.fire('Album creado', `El album ${result.value} ha sido creado`, 'success');

          });
      }
    });
  }
}
