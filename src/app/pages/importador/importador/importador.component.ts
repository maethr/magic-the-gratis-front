import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Carta } from 'src/app/core/models/carta';
import { Edicion } from 'src/app/core/models/edicion';
import { AlbumWrapService } from 'src/app/core/services/local/album-wrap.service';
import { CartaService } from 'src/app/core/services/local/carta.service';
import { EdicionService } from 'src/app/core/services/scryfall/edicion.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { SearchParams } from 'src/app/core/services/scryfall/search-params';
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

  @ViewChild('edicion', { read: ElementRef }) edicionSelectorRef: ElementRef;
  edicionSelectorData: { edicion: Edicion, rareza?: string }[] = [{ edicion: new Edicion() }];
  edicionSelectorSelected: Edicion;
  edicionSelectorOpen = false;

  constructor(
    private scryfallService: ScryfallService,
    private cartaService: CartaService,
    public _gallery: Gallery,
    public _lightbox: Lightbox,
    private router: Router,
    private albumWrapService: AlbumWrapService,
    private edicionService: EdicionService
  ) { }

  ngOnInit(): void {
    this.albumWrapService.obtenerAlbumes().subscribe();
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
        let arr_palabras: string[] = nombre.split(" ");
        let ultima_pos: string = arr_palabras[arr_palabras.length - 1];
        if (ultima_pos[0].toLowerCase() === 'x') {
          let valor: number = Number(ultima_pos.slice(1));
          if (!isNaN(valor) && valor > 0) {
            nombre = arr_palabras.slice(0, arr_palabras.length - 1).join(" ");
            this.getCartaByNombre(nombre, valor);
          }
        } else {
          this.getCartaByNombre(nombre);
        }
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

  getCartaByNombre(nombre: string, amount: number = 1) {
    let carta: ImportCarta = new ImportCarta();
    carta.textoBuscado = nombre;
    carta.amount = amount;
    this.scryfallService.getCardByName(nombre).subscribe(res => {
      carta.data = res;
      carta.fullResImg = this.rellenarArrayGaleria(res);
      this.cartasEncontradas.push(carta);
    }, error => {
      this.cartasEncontradas.push(carta);
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
    this.albumWrapService.showGuardarCartas(this.cartasEncontradas);
  }

  crearAlbum() {
    this.albumWrapService.showCrearAlbum(this.cartasEncontradas);
  }

  elegirVersionCarta(carta: ImportCarta) {
    let params: SearchParams = new SearchParams();
    params.unique = "prints";
    this.scryfallService.search(carta.data.name, params).subscribe(result => {
      let cartas = result.data as Carta[];
      this.edicionSelectorData = [];
      for (let i = 0; i < cartas.length; i++) {
        let carta = cartas[i];
        this.edicionService.getEdicion(carta.set).subscribe(res => {
          let edicion = res as Edicion;
          this.edicionSelectorData.push({ edicion: edicion, rareza: carta.rarity });
          if (i === cartas.length - 1) {
            this.edicionSelectorOpen = true;
            console.log(this.edicionSelectorRef);
            console.log(this.edicionSelectorData);
            //this.edicionSelectorRef.nativeElement.querySelector('.open-me').click();
          }
        });
      }
    });
  }

}
