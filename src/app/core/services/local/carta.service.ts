import { Injectable } from '@angular/core';
import { CartaDisplay } from '../../models/carta-display';
import { CardFace, Carta, ImageURIs } from '../../models/carta';

@Injectable({
  providedIn: 'root'
})
export class CartaService {

  constructor() { }

  public getDefaultText(carta: Carta): string {
    if (carta.oracle_text) {
      return carta.oracle_text;
    }
    if (carta.card_faces && carta.card_faces[0].oracle_text) {
      return carta.card_faces[0].oracle_text;
    }
  }

  public getDefaultFlavorText(carta: Carta): string {
    if (carta.oracle_text) {
      return carta.flavor_text;
    }
    if (carta.card_faces && carta.card_faces[0].flavor_text) {
      return carta.card_faces[0].flavor_text;
    }
  }

  public getBestImageDefault(carta: Carta): string {
    let def_image_uris: ImageURIs = this.getDefaultImageUris(carta);
    if (def_image_uris) {
      return this.getBestImage(def_image_uris);
    }
  }

  public getWorstImageDefault(carta: Carta): string {
    let def_image_uris: ImageURIs = this.getDefaultImageUris(carta);
    if (def_image_uris) {
      return this.getWorstImage(def_image_uris);
    }
  }
  
  public getAllImageUris(carta: Carta): ImageURIs[] {
    let image_uri_arr: ImageURIs[] = [];
    if (carta.image_uris) {
      image_uri_arr.push(carta.image_uris);
    }
    if (carta.card_faces) {
      carta.card_faces.forEach(card_face => {
        if (card_face.image_uris) {
          image_uri_arr.push(card_face.image_uris);
        }
      });
    }
    return image_uri_arr;
  }

  public getDefaultImageUris(carta: Carta): ImageURIs {
    if (carta.image_uris) {
      return carta.image_uris;
    }
    if (carta.card_faces) {
      if (carta.card_faces[0].image_uris) {
        return carta.card_faces[0].image_uris;
      }
    }
  }

  public getWorstImage(image_uris: ImageURIs): string {
    if (image_uris.small) {
      return image_uris.small;
    }
    if (image_uris.normal) {
      return image_uris.normal;
    }
    if (image_uris.large) {
      return image_uris.large;
    }
  }

  public getBestImage(image_uris: ImageURIs): string {
    if (image_uris.png) {
      return image_uris.png;
    }
    if (image_uris.large) {
      return image_uris.large;
    }
    if (image_uris.normal) {
      return image_uris.normal;
    }
    if (image_uris.small) {
      return image_uris.small;
    }
  }
}
