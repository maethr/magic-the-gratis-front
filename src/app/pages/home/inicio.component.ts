import { Component, OnInit } from '@angular/core';
import { Usuario } from "../../types/usuario";
import { UsuarioService } from '../../services/data/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  busquedaCartas:string;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
2