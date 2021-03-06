import { Component, OnInit } from '@angular/core';
import { Usuario } from "../../core/models/usuario";
import { UsuarioService } from '../../core/services/data/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;

  errores: string[];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuariologueado');
  }

  loguear(): void {
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login', '¡username o password vacías!', 'error');
      return;
    }

    this.usuarioService.getUsuarioLogin(this.usuario).subscribe(
      response => {
        this.usuarioService.guardarUsuario(response.usuario);

        let usuario = this.usuarioService.usuario;
        this.router.navigate(['/coleccion']);
        Swal.fire('Login', `Bienvenido ${usuario.username}, has iniciado sesión con éxito`, 'success');
      },
      err => {
        if (err.status == 400 || err.status == 401 || err.status == 404) {
          Swal.fire('Error de login', 'Nombre de usuario o clave incorrectos', 'error');
        }
      }
    );
  }

  getThisUsuarioLogueado() {
    return this.usuario;
  }
}
