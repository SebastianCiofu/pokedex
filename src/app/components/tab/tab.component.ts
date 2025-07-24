import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-tab',
   template: `
    <button class="bg-cyan-300 p-2 rounded-md cursor-pointer hover:bg-cyan-200" (click)="tabClickedEvent.emit()">{{ tabName() }}</button>
   `,
  imports: [],
})
export class TabComponent {
  tabName = input<string>('');
  tabClickedEvent = output();
}
