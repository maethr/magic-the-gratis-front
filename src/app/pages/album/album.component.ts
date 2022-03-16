import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from './album';
import { ColeccionService } from '../../core/services/data/coleccion.service';

import { Carta } from 'src/app/core/models/carta';

import { ChangeDetectorRef } from '@angular/core';
import { AlbumService } from 'src/app/core/services/data/album.service';
import { EdicionService } from '../../core/services/scryfall/edicion.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Edicion } from 'src/app/core/models/edicion';
import { CartaWrap } from 'src/app/core/models/carta-wrap';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  album: Album;
  tam_fila: number = 3;

  id_album: number;
  cartas: CartaWrap[];
  cartasFiltro: CartaWrap[];

  paginador: any;
  pagina: number;
  cargando: boolean = true;

  filterForm: FormGroup;

  constructor(
    private albumService: AlbumService,
    private albumesService: ColeccionService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private edicionService: EdicionService
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
      this.albumesService.getAlbum(this.id_album).subscribe(response => {
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

      this.obtenerCartas(this.pagina);

    })
  }

  recargar(num: number) {
    this.tam_fila = this.tam_fila + num;
    this.pagina = 0;
    localStorage.setItem('tam_fila', this.tam_fila.toString());
    this.ref.detectChanges();
    if (num > 0 && this.paginador.last) {
      this.router.navigate(['/album', this.album.id, 'page', this.pagina])
    }
    this.obtenerCartas(this.pagina);
  }

  obtenerCartas(pagina: number): void {
    this.albumService.getPaginaAlbum(this.id_album, pagina, this.tam_fila ** 2).subscribe(response => {
      this.cartas = response.content as CartaWrap[];
      this.cartasFiltro = Object.assign([], this.cartas);

      console.log(this.cartasFiltro)
      this.paginador = response;
      this.cargando = false;
    })
  }

  onFiltro(valor: any) {
    this.cartasFiltro = Object.assign([], this.cartas);
    for (let key in valor) {
      console.log(key, valor[key]);
      if (valor[key].toString() != '') {
        let valor_filtro: string = valor[key].toString().toLowerCase();
        switch (key) {
          case 'color':
            console.log('Filtrado por color');
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

        // let cartasARetirar = this.cartasFiltro.filter((carta: Carta) => carta[key].includes(valor[key]) === false);
        // console.log(cartasARetirar);
        // cartasARetirar.forEach(carta => {
        //   this.cartasFiltro.splice(this.cartasFiltro.indexOf(carta), 1);
        // }
        // );

      }
    }
  }

  onClear() {
    this.filterForm.reset();
    this.cartasFiltro = this.cartas;
  }
}
