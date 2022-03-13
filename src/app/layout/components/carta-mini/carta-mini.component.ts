import { Component, Input, OnInit } from '@angular/core';
import { Carta } from 'src/app/core/models/carta';

@Component({
  selector: 'app-carta-mini',
  templateUrl: './carta-mini.component.html',
  styleUrls: ['./carta-mini.component.css']
})
export class CartaMiniComponent implements OnInit {

  @Input('carta') carta: Carta;

  constructor() { }

  ngOnInit(): void {
    // alert(this.carta);
    // console.log(this.carta);
  }

}
