import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CartaWrap } from 'src/app/core/models/carta-wrap';
import { ColeccionService } from 'src/app/core/services/data/coleccion.service';
import { AlbumWrapService } from 'src/app/core/services/local/album-wrap.service';
import { Album } from 'src/app/pages/album/album';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carta-mini',
  templateUrl: './carta-mini.component.html',
  styleUrls: ['./carta-mini.component.css']
})
export class CartaMiniComponent implements OnInit {

  @Input('carta') carta: CartaWrap;
  @Input('album') album?: Album;

  items: MenuItem[];

  constructor(
    private router: Router,
    private albumWrapService: AlbumWrapService,
    private coleccionService: ColeccionService
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Ver carta',
        icon: 'pi pi-fw pi-arrow-right',
        command: () => {
          this.router.navigate(this.carta.data.id ? ['/carta', this.carta.data.id, this.carta.id] : ['/carta', this.carta.data.id]);
        }
      },
      {
        label: 'Guardar carta',
        icon: 'pi pi-fw pi-save',
        command: () => {
          this.albumWrapService.obtenerAlbumes().subscribe(() => {
            this.albumWrapService.showGuardarCarta(this.carta.data);
          });
        }
      },
      {
        separator: true
      },
      {
        label: 'Otras versiones',
        icon: 'pi pi-fw pi-search-plus',
        command: () => {
          this.router.navigate(['/buscar', 'prints', this.carta.data.name]);
        }
      },
      {
        label: 'Ver edición',
        icon: 'pi pi-fw pi-search-plus',
        command: () => {
          this.router.navigate(['/buscar', 'cards', 'set:' + this.carta.data.set]);
        }
      }
    ];

    if(this.album){
      this.items.push(
      {
        separator: true
      },
      {
        label: 'Hacer portada del album',
        icon: 'pi pi-fw pi-book',
        command: () => {
          this.setPortadaAlbum(this.album, this.carta);
        }
      });
    }
  }

  setPortadaAlbum(album: Album, portada: CartaWrap){
    this.coleccionService.editarAlbum(Number(album.id), album.nombre, portada.id).subscribe(
      (response: Album) => {
        Swal.fire({
          title: 'Portada cambiada',
          text: 'La portada del album ' + response.nombre + ' ha sido cambiada',
          icon: 'success'
          });
      }
    )
  }
}
