import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Edicion } from 'src/app/core/models/edicion';
import { SimbolosService } from 'src/app/core/services/scryfall/simbolos.service';


@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styleUrls: ['./edicion.component.css']
})
export class EdicionComponent implements OnInit {
  
  //Array con los datos de todos los SETs.
  listaSets: Edicion[] = this.simbolosService.sets_data;
  listaSetsAgrupada: any[][];
  
  constructor(
    private simbolosService: SimbolosService,
    private router: Router
    ) {
      
    }
    
    ngOnInit(): void {
      this.listaSetsAgrupada = [];
      this.listaSets.forEach(set => {
        let setsAgrupados: any[] = this.listaSetsAgrupada.find(_set => _set[0].icon_svg_uri == set.icon_svg_uri);
        let menu_item: any = {
          ...set,
          label:set.name,
          command: () => {
            this.router.navigate(['/buscar', 'cards', 'set:' + set.code ]);
          }
        }
        
        if (!setsAgrupados){
          setsAgrupados = [];
          setsAgrupados.push(menu_item);
          this.listaSetsAgrupada.push(setsAgrupados);
        } else {
          setsAgrupados.push(menu_item);
        }
        
      })
    }

    buscarSet() {
      //this.router.navigate(['/buscar', 'cards', 'set:' + onclick.set.code]);
    }
    
    generarMenuOpcion (ediciones: Edicion[]) {
      let textoBusqueda: string = 'set:';
      ediciones.forEach(edicion => {
        textoBusqueda += edicion.code + '+';
      });
      return textoBusqueda.slice(0, -1);
    }
  }
  