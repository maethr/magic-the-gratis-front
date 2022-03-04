import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { Carta } from 'src/app/core/models/carta';
import { SearchParams } from 'src/app/core/services/scryfall/search-params';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  cartasBusqueda: Carta[] = [];
  cartasPagina: Carta[] = [];

  textoBuscado: string;
  tipoBusqueda: string;
  paginador: any;
  pagina: number;

  tam_fila: number = 3;

  tam_pag: number = 24;
  total_cartas_busqueda: number;

  cargando: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private scryfallService: ScryfallService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.pagina = +params.get('page');
      if (!this.pagina) {
        this.pagina = 0;
      }

      this.tipoBusqueda = params.get('tipo')
      if (!this.tipoBusqueda) {
        this.tipoBusqueda = "cards";
      }

      this.textoBuscado = params.get('txt');
      if (this.textoBuscado) {
        this.getCartasS();
      }
    });
    if (localStorage.getItem('tam_fila') != null) {
      this.tam_fila = +localStorage.getItem('tam_fila');
    }
  }

  buscar() {
    if (this.textoBuscado) {
      this.router.navigate(['buscar', this.tipoBusqueda, this.textoBuscado]);
    }
  }

  recargar(num: number) {
    this.tam_fila = this.tam_fila + num;
    this.pagina = 0;
    localStorage.setItem('tam_fila', this.tam_fila.toString());
    this.ref.detectChanges();
    if (num > 0 && this.paginador.last) {
      this.router.navigate(['buscar', this.tipoBusqueda, this.textoBuscado, this.pagina])
    }
    this.getCartasS();
  }

  /* getCartas() {
     this.cargando = true;
     if (this.tipoBusqueda == "oracle") {
       this.getByNombreGroupByOracle();
     } else if (this.tipoBusqueda == "ilust") {
       this.getByNombreGroupByIlust();
     } else if (this.tipoBusqueda == "all") {
       this.getByNombreGroupById();
     }
   }*/

  _paginate(event) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.getCartasS(event.page + 1);
  }

  page_scryfall = 1;
  index = 0;

  paginate(event) {
    this.tam_pag = event.rows;
    console.log("EVENT: ", event);
    this.index = ((event.page) * event.rows) % 175;
    console.log("-index: ", this.index)
    let new_p_sc = Math.floor(event.first / 175) + 1;
    console.log("-newpsc: ", new_p_sc)
    if (new_p_sc == this.page_scryfall) {
      this.cartasPagina = this.cartasBusqueda.slice(this.index, this.index + event.rows);
      console.log(this.cartasPagina);
    } else {
      this.getCartasS(new_p_sc);
      this.page_scryfall = new_p_sc;
    }

  }

  getCartasS(page_num?: number) {
    let params: SearchParams = {
      unique: this.tipoBusqueda,
      page: page_num ? page_num : 1
    }
    this.cargando = true;
    this.scryfallService.search(this.textoBuscado, params).subscribe(
      response => {
        this.total_cartas_busqueda = response.total_cards;
        console.log(this.total_cartas_busqueda)
        this.cartasBusqueda = response.data as Carta[];
        console.log("CartasBusqueda: ", this.cartasBusqueda)
        this.cartasPagina = this.cartasBusqueda.slice(this.index, this.index + this.tam_pag);
        console.log("Cartas Pagina: ", this.cartasPagina);
        this.cargando = false;

        //this.getImagenes();
      });
  }

  /*   getImagenes () {
      this.cartasBusqueda.forEach(carta => {
        this.cartaService.getImagenesCarta(carta).subscribe( () => {
          this.cargando = false;
        });
      });
    } */

  /* getByNombreGroupByOracle () {
     this.cartaService.getByNombreGroupByOracle(this.textoBuscado, this.pagina, this.tam_fila ** 2).subscribe(
       response => {
         this.cartasBusqueda = response.content as Carta[];
         this.paginador = response;
         this.getImagenes();
       }
     );
   }
 
   getByNombreGroupByIlust () {
     this.cartaService.getByNombreGroupByIlust(this.textoBuscado, this.pagina, this.tam_fila ** 2).subscribe(
       response => {
         this.cartasBusqueda = response.content as Carta[];
         this.paginador = response;
         this.getImagenes();
       }
     );
   }
 
   getByNombreGroupById () {
     this.cartaService.getByNombreGroupById(this.textoBuscado, this.pagina, this.tam_fila ** 2).subscribe(
       response => {
         this.cartasBusqueda = response.content as Carta[];
         this.paginador = response;
         this.getImagenes();
       }
     );
   }*/
}
