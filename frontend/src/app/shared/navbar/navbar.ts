import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  imports: [],
})
export class NavbarComponent {
  // Scroll handling is done by script.js to avoid conflicts
  // Navbar classes and behavior are controlled by the loaded scripts
}
