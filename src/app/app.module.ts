import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import localeES from '@angular/common/locales/es';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InicioComponent } from './home/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioDetalleComponent } from './usuarios/perfil/usuario-detalle.component';
import { CrearPerfilComponent } from './usuarios/crear-perfil/crear-perfil.component';
import { EditarPerfilComponent } from './usuarios/editar-perfil/editar-perfil.component';
import { LoginComponent } from './usuarios/login/login.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { BuscadorUsuariosComponent } from './usuarios/buscador/buscador-usuarios/buscador-usuarios.component';
import { CartaComponent } from './pages/carta/carta.component';
import { ColeccionComponent } from './pages/coleccion/coleccion.component';
import { OpcionesAlbumComponent } from './pages/opciones-album/opciones-album.component';

import { UsuarioService } from './usuarios/usuario.service';
import { ColeccionService } from './pages/coleccion/coleccion.service';
import { AlbumComponent } from './pages/album/album.component';
import { AlbumService } from './pages/album/album.service';
import { CartaService } from './pages/carta/carta.service';
import { EdicionService } from './pages/carta/ediciones/edicion.service';

import { PaginadorAlbumesComponent } from './paginador/paginador-albumes/paginador-albumes.component';
import { PaginadorAlbumComponent } from './paginador/paginador-album/paginador-album.component';
import { PaginadorBuscadorComponent } from './paginador/paginador-buscador/paginador-buscador.component';
import { PaginadorUsuariosComponent } from './paginador/paginador-usuarios/paginador-usuarios.component';


registerLocaleData(localeES, 'es');

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'home', component: InicioComponent, },
  { path: 'crearCuenta', component: CrearPerfilComponent },
  { path: 'usuarios', component: UsuariosComponent, },
  { path: 'usuarios/page/:page', component: UsuariosComponent },
  { path: 'usuarios/form/:id', component: CrearPerfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: UsuarioDetalleComponent},
  { path: 'coleccion', component: ColeccionComponent },
  { path: 'coleccion/:page', component: ColeccionComponent },
  { path: 'album/:id', component: AlbumComponent },
  { path: 'album/:id/page/:page', component: AlbumComponent },
  { path: 'album/:id/config', component: OpcionesAlbumComponent },
  { path: 'editarPerfil', component: EditarPerfilComponent},
  { path: 'buscar', component: BuscadorComponent },
  { path: 'buscar/:tipo/:txt', component: BuscadorComponent },
  { path: 'buscar/:tipo/:txt/:page', component: BuscadorComponent },
  { path: 'buscarUsuarios', component: BuscadorUsuariosComponent },
  { path: 'carta/:scid/:id', component: CartaComponent },
  { path: 'carta/:scid', component: CartaComponent }

]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    InicioComponent,

    UsuariosComponent,
    UsuarioDetalleComponent,
    EditarPerfilComponent,
    CrearPerfilComponent,
    LoginComponent,
    ColeccionComponent,
    AlbumComponent,
    BuscadorComponent,
    OpcionesAlbumComponent,

    PaginadorAlbumesComponent,
    PaginadorAlbumComponent,
    PaginadorBuscadorComponent,
    PaginadorUsuariosComponent,
    BuscadorUsuariosComponent,
    CartaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatProgressBarModule
  ],
  providers: [
    UsuarioService,
    ColeccionService,
    AlbumService,
    CartaService,
    EdicionService,

    CrearPerfilComponent,
    UsuarioDetalleComponent,
    EditarPerfilComponent,
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
