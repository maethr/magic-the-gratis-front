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
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { InicioComponent } from './pages/home/inicio.component';
import { UsuariosComponent } from './pages/usuarios/listado-usuarios/usuarios.component';
import { UsuarioDetalleComponent } from './pages/usuarios/perfil/usuario-detalle.component';
import { CrearPerfilComponent } from './pages/usuarios/crear-perfil/crear-perfil.component';
import { EditarPerfilComponent } from './pages/usuarios/editar-perfil/editar-perfil.component';
import { LoginComponent } from './pages/login/login.component';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { BuscadorUsuariosComponent } from './pages/usuarios/buscador-usuarios/buscador-usuarios.component';
import { CartaComponent } from './pages/carta/carta.component';
import { ColeccionComponent } from './pages/coleccion/coleccion.component';
import { OpcionesAlbumComponent } from './pages/opciones-album/opciones-album.component';

import { UsuarioService } from './core/services/data/usuario.service';
import { ColeccionService } from './core/services/data/coleccion.service';
import { AlbumComponent } from './pages/album/album.component';
import { AlbumService } from './core/services/data/album.service';
import { EdicionService } from './core/services/scryfall/edicion.service';

import { PaginadorAlbumesComponent } from './layout/paginator/paginador-albumes/paginador-albumes.component';
import { PaginadorAlbumComponent } from './layout/paginator/paginador-album/paginador-album.component';
import { PaginadorBuscadorComponent } from './layout/paginator/paginador-buscador/paginador-buscador.component';
import { PaginadorUsuariosComponent } from './layout/paginator/paginador-usuarios/paginador-usuarios.component';
import { ScryfallService } from './core/services/scryfall/scryfall.service';
import { EdicionPipe } from './core/pipes/edicion/edicion.pipe';


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
    CartaComponent,
    EdicionPipe
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
    EdicionService,
    ScryfallService,

    CrearPerfilComponent,
    UsuarioDetalleComponent,
    EditarPerfilComponent,
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
