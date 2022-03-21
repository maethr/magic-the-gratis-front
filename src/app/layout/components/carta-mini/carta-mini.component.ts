import { Component, Input, OnInit } from '@angular/core';
import { Carta } from 'src/app/core/models/carta';
import { CartaWrap } from 'src/app/core/models/carta-wrap';

@Component({
  selector: 'app-carta-mini',
  templateUrl: './carta-mini.component.html',
  styleUrls: ['./carta-mini.component.css']
})
export class CartaMiniComponent implements OnInit {

  @Input('carta') carta: CartaWrap;

  constructor() {
    console.log("INPUT CARTA: " + this.carta);

   }

  ngOnInit(): void {
    console.log("INPUT CARTA ngOnInit: " + this.carta);

  }

}
