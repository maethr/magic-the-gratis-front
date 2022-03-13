/**
 * Clase que representa la cara de una carta de Scryfall.
 */
export class CardFace {

  // Propiedades de la carta
  oracle_id: string;
  name: string;
  mana_cost?: string;
  cmc?: number;
  colors?: string[];
  type_line: string;
  power?: string;
  toughness?: string;
  loyalty?: string;

  // Propiedades de la impresión
  printed_text?: string;
  oracle_text?: string;
  flavor_text?: string;
  illustration_id?: string;
  artist?: string;
  image_uris?: ImageURIs;
}

/**
 * Clase que representa una carta de Magic según la API de Scryfall.
 */
export class Carta extends CardFace {

  // Propiedades del usuario
  local_id?: number;

  // Propiedades de la impresión
  id: string;
  lang: string;
  uri: string;
  image_status: string;

  // Propiedades de la edición
  rarity: string;
  set: string;
  set_name: string;

  // Propiedades de la carta
  layout?: string;
  card_faces?: CardFace[];
  all_parts?: Carta[];
}

/**
 * Clase que contiene las imagenes de las cartas o las caras de
 * la API de Scryfall.
 */
export class ImageURIs {
  small?: string;
  normal?: string;
  large?: string;
  png?: string;
  art_crop?: string;
  border_crop?: string;
}
