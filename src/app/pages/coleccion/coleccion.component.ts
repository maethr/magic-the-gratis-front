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
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartaDataService } from 'src/app/core/services/fill/carta-data.service';


@Component({
  selector: 'app-coleccion',
  templateUrl: './coleccion.component.html',
  styleUrls: ['./coleccion.component.css']
})
export class ColeccionComponent implements OnInit {

  id: string;
  usuario: Usuario;
  albums: Album[];
  albumsFiltro: Album[];
  albumsPagina: Album[];

  paginador: any;

  numAlbumsPagina = 12;
  totalAlbums: number;

  filterForm: FormGroup;

  @ViewChild('p', { static: false }) paginator: Paginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coleccionService: ColeccionService,
    private usuarioService: UsuarioService,
    private albumService: AlbumService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cartaDataService: CartaDataService
  ) {
    this.usuario = this.usuarioService.usuario
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let pagina: number = +params.get('page');
      if (!pagina) {
        pagina = 0;
      }
      
      this.filterForm = this.formBuilder.group({
        nombre: [''],
        color: [''],
      });

      this.filterForm.valueChanges.subscribe(valor => {
        this.onFiltro(valor);
      });

      this.obtenerAlbumes();
    });
  }

  obtenerAlbumes() {
    this.cartaDataService.getAllAlbumesFromUser(this.usuario.username, (albumes: Album[]) => {
      this.albums = albumes;
      this.albumsFiltro = Object.assign([], this.albums);
      this.albumsPagina = this.albumsFiltro.slice(0, this.numAlbumsPagina);
      this.totalAlbums = this.albumsFiltro.length;
    });
  }

  paginate(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let indice = ((event.page) * event.rows);
    this.numAlbumsPagina = event.rows;
    this.albumsPagina = this.albumsFiltro.slice(indice, indice + event.rows);
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

  onFiltro(valor: any) {
    this.albumsFiltro = Object.assign([], this.albums);
    for (let key in valor) {
      if (valor[key].toString() != '') {
        let valor_filtro: string = valor[key].toString().toLowerCase();
        switch (key) {
          case 'color':
            console.log('Filtrado por color', valor_filtro);
            this.albumsFiltro = this.albumsFiltro.filter(album => {
              console.log(album.colores);
              for (let color of album.colores.split('')) {
                if (valor_filtro.includes(color.toLowerCase())) {
                  return true;
                }
              }
              return false;
            });
            break;

          case 'nombre':
            console.log('Filtrado por nombre');
            this.albumsFiltro = this.albumsFiltro.filter(album => album.nombre.toLowerCase().includes(valor_filtro));
            break;
        }
      }
    }
    this.changePageToFirst();
  }

  changePageToFirst() {
    let indice = 0;
    this.albumsPagina = this.albumsFiltro.slice(indice, indice + this.numAlbumsPagina);
    this.totalAlbums = this.albumsFiltro.length;
    if (this.paginator && this.totalAlbums > this.numAlbumsPagina) {
      this.paginator.changePageToFirst(new Event('click'));
    }
  }
}
