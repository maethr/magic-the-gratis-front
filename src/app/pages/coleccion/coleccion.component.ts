import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from '../album/album';
import { ColeccionService } from '../../core/services/data/coleccion.service';
import { Usuario } from '../../core/models/usuario';
import { UsuarioService } from '../../core/services/data/usuario.service';
import Swal from 'sweetalert2';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';
import { AlbumService } from 'src/app/core/services/data/album.service';


@Component({
  selector: 'app-coleccion',
  templateUrl: './coleccion.component.html',
  styleUrls: ['./coleccion.component.css']
})
export class ColeccionComponent implements OnInit {

  id: string;
  usuario: Usuario;
  albums: Album[];
  paginador: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coleccionService: ColeccionService,
    private usuarioService: UsuarioService,
    private scryfallService: ScryfallService,
    private albumService: AlbumService,
    private router: Router
  ) {
    this.usuario = this.usuarioService.usuario
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let pagina: number = +params.get('page');
      if (!pagina) {
        pagina = 0;
      }

      this.obtenerAlbumes(pagina);
    });
      this.scryfallService.search("color>=uw -c:red").subscribe( (response) => {
        console.log(response);
      });
  }

  obtenerAlbumes(pagina: number) {
    this.coleccionService.getAlbumes(this.usuario.username, pagina.toString()).subscribe(
      response => {
        this.albums = response.content as Album[];
        this.paginador = response;

        //Obtenemos el total de cartas de cada album.
        this.albums.forEach(album => {
          this.contarCartasAlbum(album);
        })
        
      });
  }

  contarCartasAlbum(album: Album){
    this.albumService.countCartasAlbum(Number(album.id)).subscribe(
      response =>{
        album.totalCartas = response as number;
        console.log(album);
        console.log("RESPONSE: "+response);
      }
    )
  }


  crearAlbum () {
    Swal.fire({
      title: "Nuevo album",
      text: "Ponle un título a tu album",
      inputPlaceholder: "Album Épico",
      input: 'text',
      showCancelButton: true,
      inputValidator: function (value) {
        return new Promise(function (resolve, reject) {
          if (value !== '') {
            resolve(null);
          } else {
            resolve('Debes escoger un nombre para tu album');
          }
        });
      }
  }).then((result) => {
      if (result.isConfirmed) {
        this.coleccionService.createAlbum(result.value, this.usuario.username).subscribe(
          (response) => {
            this.router.navigate(['album', response.id]);
            Swal.fire('Album creado', `El album ${result.value} ha sido creado`, 'success');
          
        });
      }
  });
  }
}
