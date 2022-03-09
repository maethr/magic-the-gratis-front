import { Component, OnInit } from '@angular/core';
import { Carta } from 'src/app/core/models/carta';
import { ScryfallService } from 'src/app/core/services/scryfall/scryfall.service';

@Component({
  selector: 'app-importador',
  templateUrl: './importador.component.html',
  styleUrls: ['./importador.component.css']
})
export class ImportadorComponent implements OnInit {

  texto: string = "";

  uploadedFiles: any[] = [];
  cartasEncontradas: any[] = [];

  constructor(
    private scryfallService: ScryfallService
  ) { }

  ngOnInit(): void {
  }

  onSelect(event) {
    // console.log(event);
    // for (let file of event.files) {
    //   this.uploadedFiles.push(file);
    // }

    // console.log(this.uploadedFiles);
  }

  onUpload(event) {
    this.uploadDocument(event.files[0]);

    // if (state === 'upload-handler') {
    //   this.uploadDocument(event.files[0]);

    //   console.log('done');
    // }
  }

  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.parseTexto(fileReader.result as string);
    }
    fileReader.readAsText(file);
  }

  parseTexto(texto: string) {
    let arr_nombres = texto.split("\n");
    let arr_cartas_parsed: Carta[];
    for (let nombre of arr_nombres) {
      this.scryfallService.getCardByName(nombre).subscribe(carta => {
        carta.textoBuscado = nombre;
        this.cartasEncontradas.push(carta);
      }, error => {
        let carta: any = new Carta();
        carta.textoBuscado = nombre;
        this.cartasEncontradas.push(carta);
      });
    }
  }
}
