import { CartaWrap } from "src/app/core/models/carta-wrap";

export class CartaWrapBlob extends CartaWrap {
    main_image_object?: any;
    main_image_type: 'jpg' | 'png';
}