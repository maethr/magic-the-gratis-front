import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Carta } from 'src/app/core/models/carta';
import { AlbumWrapService } from 'src/app/core/services/local/album-wrap.service';
import { CartaService } from 'src/app/core/services/local/carta.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import Swal from 'sweetalert2';
import { ImportCarta } from './import-carta.model';

/**
 * Importación de cartas en lote desde un archivo de texto. Posee una
 * interfaz previa a la importación, que permite modificar la
 * selección de cartas encontrada en el archivo.
 * @author Miguel Bautista Pérez
 */
@Component({
  selector: 'app-importador',
  templateUrl: './importador.component.html',
  styleUrls: ['./importador.component.css']
})
export class ImportadorComponent implements OnInit {

  cartasEncontradas: ImportCarta[] = [];
  galeria: GalleryItem[] = [];

  constructor(
    private scryfallService: ScryfallService,
    private cartaService: CartaService,
    public _gallery: Gallery,
    public _lightbox: Lightbox,
    private router: Router,
    private albumWrapService: AlbumWrapService
  ) { }

  ngOnInit(): void {
    this.albumWrapService.obtenerAlbumes();
    this._lightbox.setConfig({
      panelClass: 'fullscreen'
    });
    this._gallery.ref().setConfig({
      thumb: false,
      imageSize: 'contain'
    });
    this._gallery.ref().load(this.galeria);
  }

  onSelect(event) {
  }

  onUpload(event) {
    this.uploadDocument(event.files[0]);
  }

  onCancel() {
    this.reloadComponent();
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.parseTexto(fileReader.result as string);
    }
    fileReader.readAsText(file);
  }

  parseTexto(texto: string) {
    // TODO: RegExp for \n and \r
    // texto = texto.replace(/\r?\n|\r/g, " ");
    let arr_nombres = texto.split("\n");
    let arr_cartas_parsed: Carta[];
    for (let nombre of arr_nombres) {
      console.log(nombre.charCodeAt(0));
      console.log(nombre == '\r');
      console.log(nombre.length);
      nombre = nombre.replace("\r", "");
      if (nombre != "") {
        this.getCartaByNombre(nombre);
      }
    }
  }

  rellenarArrayGaleria(carta: Carta): boolean {
    let fullResImg = false;
    let image_uri_arr = this.cartaService.getAllImageUris(carta);
    for (let image_uri of image_uri_arr) {
      fullResImg = (image_uri.png != null || image_uri.large != null) || fullResImg;
      if (fullResImg) {
        console.log(image_uri);
      }
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
    return fullResImg;
  }

  getCartaByNombre(nombre: string) {
    let data: ImportCarta = new ImportCarta();
    data.textoBuscado = nombre;
    this.scryfallService.getCardByName(nombre).subscribe(carta => {
      data.carta = carta;
      data.fullResImg = this.rellenarArrayGaleria(carta);
      this.cartasEncontradas.push(data);
    }, error => {
      this.cartasEncontradas.push(data);
    });
  }

  getCssRarity(rarity: string) {
    let css_rarity = "texto-rareza ";
    switch (rarity) {
      case 'common':
        return css_rarity + 'texto-comun';
      case 'uncommon':
        return css_rarity + 'texto-infrecuente';
      case 'rare':
        return css_rarity + 'texto-rara';
      case 'mythic':
        return css_rarity + 'texto-mitica';
      default:
        return css_rarity + 'texto-comun';
    }
  }

  editarItem(data: any) {
    let textoBuscado = data.textoBuscado;
    Swal.fire({
      title: "Modificar <i class='pi pi-pencil ml-2'></i>",
      text: null,
      inputPlaceholder: null,
      input: 'text',
      inputValue: textoBuscado,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value !== textoBuscado) {
          this.cartasEncontradas = this.cartasEncontradas.filter(elem => elem !== data);
          if (result.value !== "") {
            this.getCartaByNombre(result.value);
          }
        }
      }
    });
  }

  addItem() {
    Swal.fire({
      title: "Añadir carta",
      text: "Añade cartas al listado de importación",
      inputPlaceholder: "Jace Beleren",
      input: 'text',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value !== "") {
          this.getCartaByNombre(result.value);
        }
      }
    });
  }

  eliminarItem(data: any) {
    this.cartasEncontradas = this.cartasEncontradas.filter(elem => elem !== data);
  }

  guardarCartasEnAlbum() {
    let cartasArray = this.cartasEncontradas.map(elem => elem.carta);
    this.albumWrapService.showGuardarCartas(cartasArray);
  }

  crearAlbum() {
    let cartasArray = this.cartasEncontradas.map(elem => elem.carta);
    this.albumWrapService.showCrearAlbum(cartasArray);
  }

}
