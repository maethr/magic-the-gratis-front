import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from './album';
import { ColeccionService } from '../../core/services/data/coleccion.service';
import { ChangeDetectorRef } from '@angular/core';
import { AlbumService } from 'src/app/core/services/primitive/album.service';
import { EdicionService } from '../../core/services/scryfall/edicion.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartaWrap } from 'src/app/core/models/carta-wrap';
import { map } from 'rxjs/operators';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { Paginator } from 'primeng/paginator';
import { CartaDataService } from 'src/app/core/services/fill/carta-data.service';


@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  album: Album;
  tam_fila: number = 3;
  num_filas: number = 3;

  id_album: number;

  cartas: CartaWrap[];
  cartasFiltro: CartaWrap[];
  cartasPagina: CartaWrap[];

  pagina: number;
  cargando: boolean = true;

  filterForm: FormGroup;

  totalCartas: number;

  @ViewChild('p', {static: false}) paginator: Paginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private edicionService: EdicionService,
    private scryfallService: ScryfallService,
    private cartaDataService: CartaDataService,
    private albumService: AlbumService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.pagina = +params.get('page');
      if (!this.pagina) {
        this.pagina = 0;
      }

      if (localStorage.getItem('tam_fila') != null) {
        this.tam_fila = +localStorage.getItem('tam_fila');
      }

      this.id_album = +params.get('id');

      this.albumService.getAlbumById(this.id_album).subscribe(response => {
        this.album = response as Album;
      });

      this.filterForm = this.formBuilder.group({
        nombre: [''],
        color: [''],
        set: [''],
        cmc: [''],
        tipo: [''],
        oracle_text: ['']
      });

      this.filterForm.valueChanges.subscribe(valor => {
        this.onFiltro(valor);
      });

      this.obtenerCartas();
    })
  }

  recargar(num: number) {
    this.tam_fila = this.tam_fila + num;
    this.pagina = 0;
    localStorage.setItem('tam_fila', this.tam_fila.toString());
    this.ref.detectChanges();
    if (num > 0) {
      this.router.navigate(['/album', this.album.id, 'page', this.pagina])
    }
    this.obtenerCartas();
  }

  obtenerCartas(): void {
    this.cargando = true;
    this.cartaDataService.getAllCartasFromAlbum(this.id_album, (cartas: CartaWrap[]) => {
      this.cartas = cartas;
      this.cartasFiltro = Object.assign([], this.cartas);
      let indice = 0;
      this.cartasPagina = this.cartasFiltro.slice(indice, indice + this.tam_fila * this.num_filas);
      this.totalCartas = this.cartasFiltro.length;
      this.cargando = false;
    }).subscribe();
  }

  onFiltro(valor: any) {
    this.cartasFiltro = Object.assign([], this.cartas);
    for (let key in valor) {
      if (valor[key].toString() != '') {
        let valor_filtro: string = valor[key].toString().toLowerCase();
        switch (key) {
          case 'color':
            console.log('Filtrado por color', valor_filtro);
            this.cartasFiltro = this.cartasFiltro.filter(carta => {
              console.log(carta.data.colors);
              for (let color of carta.data.colors) {
                if (valor_filtro.includes(color.toLowerCase())) {
                  return true;
                }
              }
              return false;
            });
            break;
          case 'tipo':
            console.log('Filtrado por tipo');
            this.cartasFiltro = this.cartasFiltro.filter(carta => carta.data.type_line.toLowerCase().includes(valor_filtro));
            break;
          case 'oracle_text':
            console.log('Filtrado por oracle_text');
            this.cartasFiltro = this.cartasFiltro.filter(carta => carta.data.oracle_text?.toLowerCase().includes(valor_filtro));
            break;
          case 'nombre':
            console.log('Filtrado por nombre');
            this.cartasFiltro = this.cartasFiltro.filter(carta => carta.data.name.toLowerCase().includes(valor_filtro));
            break;
          case 'cmc':
            console.log('Filtrado por cmc');
            this.cartasFiltro = this.cartasFiltro.filter(carta => carta.data.cmc == Number(valor_filtro));
            break;
          case 'set':
            console.log('Filtrado por set');
            this.cargando = true;
            for (let i = 0; i < this.cartasFiltro.length; i++) {
              let carta = this.cartasFiltro[i];
              this.edicionService.getEdicion(carta.data.set).subscribe((response) => {
                if (response.name.toString().toLowerCase().includes(valor[key].toString().toLowerCase()) == false
                  && (response.block_name != null
                    && response.block_name.toString().toLowerCase().includes(valor[key].toString().toLowerCase())) == false) {
                  this.cartasFiltro = this.cartasFiltro.filter(_carta => _carta != carta);
                }
                if (i >= this.cartasFiltro.length - 1) {
                  this.cargando = false;
                }
              })
            }
            break;
        }
      }
    }
    this.changePageToFirst();
  }

  changePageToFirst() {
    let tam_pag = this.tam_fila * this.num_filas;
    let indice = 0;
    this.cartasPagina = this.cartasFiltro.slice(indice, indice + tam_pag);
    this.totalCartas = this.cartasFiltro.length;
    if (this.paginator && this.totalCartas > tam_pag) {
      this.paginator.changePageToFirst(new Event('click'));
    }
  }

  onClear() {
    this.filterForm.reset();
    this.cartasFiltro = this.cartas;
  }

  paginate(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.num_filas = event.rows / this.tam_fila;
    let indice = ((event.page) * event.rows);
    this.cartasPagina = this.cartasFiltro.slice(indice, indice + event.rows);
  }
}
