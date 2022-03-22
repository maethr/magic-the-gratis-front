import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CartaWrap } from 'src/app/core/models/carta-wrap';
import { AlbumWrapService } from 'src/app/core/services/local/album-wrap.service';

@Component({
  selector: 'app-carta-mini',
  templateUrl: './carta-mini.component.html',
  styleUrls: ['./carta-mini.component.css']
})
export class CartaMiniComponent implements OnInit {

  @Input('carta') carta: CartaWrap;

  items: MenuItem[];

  constructor(
    private router: Router,
    private albumWrapService: AlbumWrapService
  ) {
    console.log("INPUT CARTA: " + this.carta);


  }

  ngOnInit(): void {
    console.log("INPUT CARTA ngOnInit: " + this.carta);

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
  }


}
