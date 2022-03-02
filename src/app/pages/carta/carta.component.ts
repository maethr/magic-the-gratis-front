import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Carta } from 'src/app/core/models/carta';

import Swal from 'sweetalert2';
import { ColeccionService } from 'src/app/core/services/data/coleccion.service';
import { UsuarioService } from 'src/app/core/services/data/usuario.service';

import { EdicionService } from '../../core/services/scryfall/edicion.service';
import { Edicion } from '../../core/models/edicion';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { CartaService } from 'src/app/core/services/local/carta.service';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css']
})
export class CartaComponent implements OnInit {

  id_carta: number;
  scryfall_id: string;
  carta_en_album: boolean;

  nombre_carta: string;
  carta: Carta;
  simbolo_carta: Edicion;
  albumes: Map<string, string> = new Map<string, string>();

  cargando: boolean = true;
  galeria: GalleryItem[] = [];

  constructor(
    private albumesService: ColeccionService,
    private albumService: AlbumService,
    private usuarioService: UsuarioService,
    private simboloService: EdicionService,
    private activatedRoute: ActivatedRoute,
    private scryfallService: ScryfallService,
    private cartaService: CartaService,
    public _gallery: Gallery,
    public _lightbox: Lightbox
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id_carta = parseInt(params.get('id'));
      this.scryfall_id = params.get('scid');
      this.carta_en_album = this.id_carta ? true : false;
      this.obtenerCarta();
      this.obtenerAlbumes();
    });
    this._lightbox.setConfig({
      panelClass: 'fullscreen',
      keyboardShortcuts: false
    });
    this._gallery.ref().setConfig({
      thumb: false
    });
    this._gallery.ref().load(this.galeria);
  }

  obtenerCarta(): void {
    this.scryfallService.getCard(this.scryfall_id).subscribe(response => {
      this.carta = response as Carta;
      // this.carta.oracle_text = this.carta.oracle_text.replace(/\n/g, '<br>');
      console.log("carta", this.carta);
      this.obtenerSimbolo();
      // this.cargando = false;
      this.rellenarArrayGaleria(this.carta);
    });
  }

  rellenarArrayGaleria(carta: Carta) {
    let image_uri_arr = this.cartaService.getAllImageUris(carta);
    for (let image_uri of image_uri_arr) {
      this.galeria.push(new ImageItem({
        src: this.cartaService.getBestImage(image_uri),
        thumb: this.cartaService.getWorstImage(image_uri),
      }));
    }
    if (this.galeria.length > 1) {
      this._gallery.ref().setConfig({
        thumb: true
      });
    }
  }

  obtenerSimbolo(): void {
    this.simboloService.getEdicion(this.carta.set).subscribe(response => {
      this.simbolo_carta = response as Edicion;
      this.cargando = false;
    }, error => {
      this.cargando = false;
    });
  }

  obtenerAlbumes() {
    this.albumesService.getAllAlbumes(this.usuarioService.usuario.username).subscribe(
      response => {
        for (let element of response) {
          console.log(element);
          this.albumes.set(element.id, element.nombre);
        }
      });
  }

  guardarCarta(): void {
    Swal.fire({
      title: 'Elige el album en el que guardarla',
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.albumService.putCartaInAlbum(this.carta.id, result.value).subscribe(() => {
          Swal.fire('Carta añadida', `La carta ${this.carta.name} ha sido añadida al album seleccionado correctamente`, 'success');
        });
      }
    });
  }

  borrarCarta(): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Realmente quieres borrar a ' + this.carta.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      alert("s")
      if (result.isConfirmed) {
        alert("b")
        this.albumService.deleteCarta(this.carta.local_id).subscribe(() => {
          Swal.fire('Carta añadida', `La carta ${this.carta.name} ha sido añadida al album seleccionado correctamente`, 'success');
        });
      }
    });
  }
}
