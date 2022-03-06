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
        this.getPaginaByPagScry();
      }
    });
    if (localStorage.getItem('tam_fila') != null) {
      this.tam_fila = +localStorage.getItem('tam_fila');
    }
  }

  buscar() {
    if (this.textoBuscado) {
      this.router.navigate(['buscar', this.tipoBusqueda, this.textoBuscado]);
      this.pag_scry = 1;
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
    this.getPaginaByPagScry();
  }

  private tam_pag: number = 24;
  private readonly tam_pag_scry = 175;
  private pag_scry = 1;
  private indice_pag_scry = 0;
  private total_cartas_busqueda: number;

  paginate(event: any) {
    this.tam_pag = event.rows;

    this.indice_pag_scry = ((event.page) * event.rows) % this.tam_pag_scry;
    let nueva_pag_scry = Math.floor(event.first / this.tam_pag_scry) + 1;
    console.log("PAGINACIÓN: ", event);
    console.log("-to pagina: ", event.page + 1)
    console.log("-pagina scryfall: ", this.pag_scry)
    console.log("-indice pagina scryfall: ", this.indice_pag_scry)
    console.log("-nueva pagina scryfall: ", nueva_pag_scry)
    console.log("-total paginas scryfall: ", Math.floor(this.total_cartas_busqueda / this.tam_pag_scry) + 1)
    console.log("-total paginas: ", event.pageCount)
    console.log("-total cartas busqueda: ", this.total_cartas_busqueda)

    if (nueva_pag_scry == this.pag_scry) {
      // Si la página de scryfall de la que vamos a leer es la misma que la que tenemos en memoria 
      console.log("-pagina almacenada en memoria");
      this.cartasPagina = this.cartasBusqueda.slice(this.indice_pag_scry, this.indice_pag_scry + event.rows);
      console.log("-mostrando", this.cartasPagina.length, "cartas");
      console.log(this.cartasPagina);

      if (this.indice_pag_scry + event.rows > this.tam_pag_scry) {
        // Si el indice de la pagina de scryfall es mayor que 175, es que hemos llegado al final de la pagina
        nueva_pag_scry = nueva_pag_scry + 1;
        console.log("-fin página");
      }
    }

    if (nueva_pag_scry != this.pag_scry) {
      // Si la página de scryfall que necesitamos leer es diferente que la que tenemos en memoria
      console.log("-peticion pagina: ", nueva_pag_scry);
      this.getCartas(nueva_pag_scry).subscribe(() => {
        if (this.cartasPagina.length < event.rows) {
          console.log("-inicio página", nueva_pag_scry);
          // En caso de que hayamos llegado al final de la pagina y no haya suficientes cartas para mostrar
          this.cartasPagina = this.cartasPagina.concat(this.cartasBusqueda.slice(0, event.rows - this.cartasPagina.length));
          console.log("mostrando", this.cartasPagina.length, "cartas");
          console.log(this.cartasPagina);

        } else {
          // En caso de que estemos pidiendo una página totalmente nueva
          this.cartasPagina = this.cartasBusqueda.slice(this.indice_pag_scry, this.indice_pag_scry + event.rows);
          console.log("mostrando", this.cartasPagina.length, "cartas");
          console.log(this.cartasPagina);

          if (this.cartasPagina.length < event.rows) {
            console.log("-inicio página", nueva_pag_scry);
            // En caso de que, de dicha página nueva, estemos leyendo el final, y no haya suficientes cartas para mostrar
            // Esto solo puede pasar cuando se salta a otra página no contigua
            console.log("-peticion pagina: ", nueva_pag_scry + 1);
            this.getCartas(nueva_pag_scry + 1).subscribe(() => {
              this.cartasPagina = this.cartasPagina.concat(this.cartasBusqueda.slice(0, event.rows - this.cartasPagina.length));
              console.log("mostrando", this.cartasPagina.length, "cartas");
              console.log(this.cartasPagina);
            });
          }

        }
      });
    }
    this.pag_scry = nueva_pag_scry;
  }

  getPaginaByPagScry(pag_scry: number = 1) {
    console.log("START: ");
    console.log("-to pagina: 1");
    console.log("-pagina scryfall: ", this.pag_scry)
    console.log("-indice pagina scryfall: ", this.indice_pag_scry)
    this.getCartas().subscribe(() => {
      this.cartasPagina = this.cartasBusqueda.slice(0, this.tam_pag);
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
        this.total_cartas_busqueda = response.total_cards;
        console.log(this.total_cartas_busqueda)
        this.cartasBusqueda = response.data as Carta[];
        console.log("Cartas Busqueda: ", this.cartasBusqueda)
        this.cargando = false;
        //this.getImagenes();
      }));
  }
}
