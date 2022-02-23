import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { EdicionService } from 'src/app/pages/carta/ediciones/edicion.service';

@Pipe({
  name: 'edicion'
})
export class EdicionPipe implements PipeTransform {

  constructor(
    private edicionService: EdicionService
  ) { }

  transform(value: string, ...args: unknown[]): Observable<string> {
    return this.edicionService.getIconSVG(value);
  }

}
