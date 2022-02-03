import { Carta } from "src/app/pages/carta/carta";
import { Usuario } from "../../usuarios/usuario";

export class Album {

  id: string;
  username: Usuario;
  nombre: string;
  juego: string;

  cartas?: Carta[];

}
