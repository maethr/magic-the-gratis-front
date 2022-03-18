import { Carta, ImageURIs } from "./carta";

/**
 * Carta que reprenta la entidad Carta que recibimos del Back-end,
 *  que se rellena con la información de la API de Scryfall.
 * @author Miguel Bautista Pérez
 */
export class CartaWrap {

    data: Carta;
    id: number;
    scryfall_id: string;
    main_image: ImageURIs;
    amount: number;

}