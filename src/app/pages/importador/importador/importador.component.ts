import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gallery, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { Carta } from 'src/app/core/models/carta';
import { CartaService } from 'src/app/core/services/local/carta.service';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-importador',
  templateUrl: './importador.component.html',
  styleUrls: ['./importador.component.css']
})
export class ImportadorComponent implements OnInit {

  texto: string = "";

  uploadedFiles: any[] = [];
  cartasEncontradas: any[] = [];
  galeria = [];

  constructor(
    private scryfallService: ScryfallService,
    private cartaService: CartaService,
    public _gallery: Gallery,
    public _lightbox: Lightbox,
    private router: Router

  ) { }

  ngOnInit(): void {
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
    // console.log(event);
    // for (let file of event.files) {
    //   this.uploadedFiles.push(file);
    // }

    // console.log(this.uploadedFiles);
  }

  onUpload(event) {
    this.uploadDocument(event.files[0]);

    // if (state === 'upload-handler') {
    //   this.uploadDocument(event.files[0]);

    //   console.log('done');
    // }
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
    let arr_nombres = texto.split("\n");
    let arr_cartas_parsed: Carta[];
    for (let nombre of arr_nombres) {
      this.getCartaByNombre(nombre);
    }
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

  getCartaByNombre(nombre: string) {
    this.scryfallService.getCardByName(nombre).subscribe(carta => {
      carta.textoBuscado = nombre;
      this.cartasEncontradas.push(carta);
      this.rellenarArrayGaleria(carta);
    }, error => {
      let carta: any = new Carta();
      carta.textoBuscado = nombre;
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



  editarItem(carta: any) {
    let textoBuscado = carta.textoBuscado;
    Swal.fire({
      title: "Editar carta",
      text: null,
      inputPlaceholder: null,
      input: 'text',
      inputValue: textoBuscado,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value !== textoBuscado) {
          this.cartasEncontradas = this.cartasEncontradas.filter(elem => elem !== carta);
          if (result.value !== "") {
            this.getCartaByNombre(result.value);
          }
        }
      }
    });
  }
}
