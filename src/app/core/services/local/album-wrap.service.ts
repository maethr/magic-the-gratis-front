import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Album } from 'src/app/pages/album/album';
import Swal from 'sweetalert2';
import { Carta } from '../../models/carta';
import { AlbumService } from '../data/album.service';
import { ColeccionService } from '../data/coleccion.service';
import { UsuarioService } from '../data/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumWrapService {

  albumes: Map<number, string> = new Map();

  constructor(
    private coleccionService: ColeccionService,
    private albumService: AlbumService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  getNombreAlbum(id: number): string {
    let keys = this.albumes.keys();
    for (let key of keys) {
      if (key == id) {
        return this.albumes.get(key);
      }
    }
  }

  obtenerAlbumes() {
    this.coleccionService.getAllAlbumes(this.usuarioService.usuario.username).subscribe(
      response => {
        for (let element of response) {
          this.albumes.set(element.id, element.nombre);
        }
      });
  }

  private elegirAlbumModal() {
    return Swal.fire({
      title: 'Elige un album',
      input: 'select',
      inputOptions: this.albumes,
      inputPlaceholder: this.albumes.values[0],
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value !== '') {
            resolve(null);
          } else {
            resolve('Debes seleccionar un album');
          }
        });
      }
    })
  }

  showGuardarCarta(carta: Carta): void {
    this.elegirAlbumModal().then((result) => {
      if (result.isConfirmed) {
        this.albumService.putCartaInAlbum(carta.id, result.value).subscribe(() => {
          Swal.fire('Carta añadida', `La carta ${carta.name} ha sido añadida al album seleccionado correctamente`, 'success');
        });
      }
    });
  }

  showGuardarCartas(cartaArray: Carta[]): void {
    this.elegirAlbumModal().then((result) => {
      if (result.isConfirmed) {
        this.guardarCartasEnAlbum(cartaArray, result.value, () => {
          Swal.fire('Cartas añadidas', `Las <b>${cartaArray.length}</b> cartas han sido añadidas al album <b>${this.getNombreAlbum(result.value)}</b> correctamente`, 'success');
        });
      }
    });
  }

  private guardarCartasEnAlbum(cartaArray: Carta[], albumId: number, then?: Function) {
    let cartasAdded = 0;
    for (let i = 0; i < cartaArray.length; i++) {
      this.albumService.putCartaInAlbum(cartaArray[i].id, albumId).subscribe(() => {
        cartasAdded++;
        if (cartasAdded === cartaArray.length) {
          if (then) {
            then();
          }
        }
      });
    }
  }

  showBorrarCarta(carta: Carta): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Realmente quieres borrar a ' + carta.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.albumService.deleteCarta(carta.local_id).subscribe(() => {
          Swal.fire('Carta añadida', `La carta ${carta.name} ha sido añadida al album seleccionado correctamente`, 'success');
        });
      }
    });
  }

  private crearAlbumModal() {
    return Swal.fire({
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
    })
  }

  showCrearAlbum(cartaArray?: Carta[]) {
    this.crearAlbumModal().then((result) => {
      if (result.isConfirmed) {
        let mensaje = `El album <b>${result.value}</b> ha sido creado`;
        this.coleccionService.createAlbum(result.value, this.usuarioService.usuario.username).subscribe(
          (response) => {
            if (cartaArray) {
              this.guardarCartasEnAlbum(cartaArray, response.id, () => {
                this.router.navigate(['album', response.id]);
                Swal.fire('Album creado', mensaje, 'success');
              });
            }
            this.router.navigate(['album', response.id]);
            Swal.fire('Album creado', mensaje, 'success');
          });
      }
    });
  }

  showCrearAlbumFromCartas(cartaArray: Carta[]) {
    this.crearAlbumModal().then((result) => {
      if (result.isConfirmed) {
        this.coleccionService.createAlbum(result.value, this.usuarioService.usuario.username).subscribe(
          (response) => {
            this.guardarCartasEnAlbum(cartaArray, response.id, () => {
              this.router.navigate(['album', response.id]);
              Swal.fire('Album creado', `El album ${result.value} ha sido creado`, 'success');
            });
          });
      }
    });
  }
}
