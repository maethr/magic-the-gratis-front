import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <div class="container-fluid mt-4 my-3 wrap">
        <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>`
})
export class AppComponent {
}
