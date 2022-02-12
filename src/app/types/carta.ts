
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

  // Propiedades de la tirada
  printed_text?: string;
  flavor_text?: string;
  illustration_id?: string;
  artist?: string;
  image_uris?: ImageURIs;
}

export class Card extends CardFace {

  // Propiedades de la impresión
  id: number;
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
  all_parts?: Card[];
}

export class ImageURIs {
  small?: string;
  normal?: string;
  large?: string;
  png?: string;
  art_crop?: string;
  border_crop?: string;
}
