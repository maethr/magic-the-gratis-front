import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { Carta } from 'src/app/core/models/carta';
import { SearchParams } from 'src/app/core/services/scryfall/search-params';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

  tamFila: number = 3;
  tamPag: number = 24;
  readonly tamPagScry = 175;
  pagScry = 1;
  indicePagScry = 0;
  totalCartasBusqueda: number;

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
        this.getPaginaByPagScry();
      }
    });
    if (localStorage.getItem('tam_fila') != null) {
      this.tamFila = +localStorage.getItem('tam_fila');
    }
  }

  buscar() {
    if (this.textoBuscado) {
      this.router.navigate(['buscar', this.tipoBusqueda, this.textoBuscado]);
      this.pagScry = 1;
    }
  }

  recargar(num: number) {
    this.tamFila = this.tamFila + num;
    this.pagina = 0;
    localStorage.setItem('tam_fila', this.tamFila.toString());
    this.ref.detectChanges();
    if (num > 0 && this.paginador.last) {
      this.router.navigate(['buscar', this.tipoBusqueda, this.textoBuscado, this.pagina])
    }
    this.getPaginaByPagScry();
  }

  paginate(event: any) {
    this.tamPag = event.rows;
    this.indicePagScry = ((event.page) * event.rows) % this.tamPagScry;
    let nuevaPagScry = Math.floor(event.first / this.tamPagScry) + 1;

    console.log("PAGINACIÓN: ", event);
    console.log("-to pagina: ", event.page + 1)
    console.log("-pagina scryfall: ", this.pagScry)
    console.log("-indice pagina scryfall: ", this.indicePagScry)
    console.log("-nueva pagina scryfall: ", nuevaPagScry)
    console.log("-total paginas scryfall: ", Math.floor(this.totalCartasBusqueda / this.tamPagScry) + 1)
    console.log("-total paginas: ", event.pageCount)
    console.log("-total cartas busqueda: ", this.totalCartasBusqueda)

    if (nuevaPagScry == this.pagScry) {
      this.cartasPagina = this.cartasBusqueda.slice(this.indicePagScry, this.indicePagScry + event.rows);

      console.log("La página de scryfall de la que vamos a leer es la misma que la que tenemos en memoria")
      console.log("-mostrando", this.cartasPagina.length, "cartas");
      console.log(this.cartasPagina);

      if (this.indicePagScry + event.rows > this.tamPagScry) {
        nuevaPagScry = nuevaPagScry + 1;

        console.log("El indice de la pagina de scryfall es mayor que 175, hemos llegado al final de la pagina")
        console.log("-fin página");
      }
    }

    if (nuevaPagScry != this.pagScry) {
      console.log("La página de scryfall que necesitamos leer es diferente que la que tenemos en memoria")
      console.log("-peticion pagina: ", nuevaPagScry);

      this.getCartas(nuevaPagScry).subscribe(() => {
        if (this.cartasPagina.length < event.rows) {
          this.cartasPagina = this.cartasPagina.concat(this.cartasBusqueda.slice(0, event.rows - this.cartasPagina.length));

          console.log("Hemos llegado al final de la pagina y no habia suficientes cartas para mostrar");
          console.log("-inicio página", nuevaPagScry);
          console.log("mostrando", this.cartasPagina.length, "cartas");
          console.log(this.cartasPagina);

        } else {
          this.cartasPagina = this.cartasBusqueda.slice(this.indicePagScry, this.indicePagScry + event.rows);

          console.log("Estamos pidiendo una página nueva");
          console.log("mostrando", this.cartasPagina.length, "cartas");
          console.log(this.cartasPagina);

          if (this.cartasPagina.length < event.rows && event.first + event.rows < this.totalCartasBusqueda) {
            console.log("-inicio página", nuevaPagScry);
            console.log("De dicha página nueva, estamos leyendo el final, y no hay suficientes cartas para mostrar");
            console.log("-peticion pagina: ", nuevaPagScry + 1);

            this.getCartas(nuevaPagScry + 1).subscribe(() => {
              this.cartasPagina = this.cartasPagina.concat(this.cartasBusqueda.slice(0, event.rows - this.cartasPagina.length));
              
              console.log("mostrando", this.cartasPagina.length, "cartas");
              console.log(this.cartasPagina);
            });
          }

        }
      });
    }
    this.pagScry = nuevaPagScry;
  }

  getPaginaByPagScry(pag_scry: number = 1) {
    console.log("START: ");
    console.log("-to pagina: 1");
    console.log("-pagina scryfall: ", this.pagScry)
    console.log("-indice pagina scryfall: ", this.indicePagScry)
    this.getCartas().subscribe(() => {
      this.cartasPagina = this.cartasBusqueda.slice(0, this.tamPag);
    });
  }

  getCartas(page_num?: number): Observable<any> {
    let params: SearchParams = {
      unique: this.tipoBusqueda,
      page: page_num ? page_num : 1
    }
    this.cargando = true;
    return this.scryfallService.search(this.textoBuscado, params).pipe(map(
      response => {
        console.log("RESPUESTA SCRYFALL: ", response);
        this.totalCartasBusqueda = response.total_cards;
        console.log(this.totalCartasBusqueda)
        this.cartasBusqueda = response.data as Carta[];
        console.log("Cartas Busqueda: ", this.cartasBusqueda)
        this.cargando = false;
        //this.getImagenes();
      }));
  }
}
