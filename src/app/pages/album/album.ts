import { CartaWrap } from "src/app/core/models/carta-wrap";
import { Carta } from "src/app/pages/carta/carta";
import { Usuario } from "../../core/models/usuario";

export class Album {

  id: string;
  username: Usuario;
  nombre: string;
  juego: string;

  portada?: CartaWrap;
  cartas?: Carta[];

  totalCartas: number;

}
