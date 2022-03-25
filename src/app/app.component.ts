import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SimbolosService } from './core/services/scryfall/simbolos.service';

@Component({
  selector: 'app-root',
  template: `
    <app-header *ngIf="header_visible"></app-header>
    <div class="container-fluid mt-4 my-3 wrap contenido">
        <router-outlet (activate)="onActivate($event)"></router-outlet>
    </div>
    <app-footer></app-footer>`
})
export class AppComponent implements OnInit {


  header_visible: boolean = true;

  constructor(
    private simbolosService: SimbolosService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(events => events instanceof NavigationEnd),
      map(evt => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      ).subscribe(x => x.header === false ? this.header_visible = false : this.header_visible = true);
  }

  onActivate(event: any) {
    window.scroll(0, 0);
  }
}

