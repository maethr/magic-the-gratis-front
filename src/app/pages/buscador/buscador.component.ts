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
  textoBuscado: string;
  tipoBusqueda: string;
  paginador: any;
  pagina: number;

  tam_fila: number = 3;

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

  recargar (num: number) {
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

  getCartasS () {
    let params: SearchParams = {
      unique: this.tipoBusqueda
    }
    this.scryfallService.search(this.textoBuscado, params).subscribe(
      response => {
        this.cartasBusqueda = response.data as Carta[];
        //this.getImagenes();
      });
  }

  paginate(event) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.getCartasPaginado(event.page);
  }

  getCartasPaginado (page_num: number){
    let params: SearchParams = {
      unique: this.tipoBusqueda,
      page: page_num
    }
    this.cargando = true;
    this.scryfallService.search(this.textoBuscado, params).subscribe(
      response => {
        this.cartasBusqueda = response.data as Carta[];
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
