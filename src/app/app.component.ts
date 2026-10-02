import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NotificationPopupComponent } from './shared/components/notification-popup/notification-popup.component';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NotificationPopupComponent, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
