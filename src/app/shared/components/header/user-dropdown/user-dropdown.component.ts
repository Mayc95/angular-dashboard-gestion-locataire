import { Component, inject, OnInit, signal } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AuthenticatedUserDetails } from '../../../models/auth.model';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[
    CommonModule,
    RouterModule,
    DropdownComponent,
    //DropdownItemTwoComponent
  ]
})
export class UserDropdownComponent implements OnInit {

  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly authenticatedUserDetails = signal<AuthenticatedUserDetails | undefined>(undefined);
  isOpen = false;

  ngOnInit() {
    this.#authService.me().subscribe({
      next: (userDetails) => {
      this.authenticatedUserDetails.set(userDetails);
      console.log('Authenticated user details:', userDetails);
    },
      error: (error) => {
        console.error('Error fetching authenticated user details:', error);
        alert('Error fetching authenticated user details. Please check the console for more information. You will be redirected to the login page.');
        this.#authService.signout();
    }});
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  signout(): void {
    this.#authService.signout();
    this.closeDropdown();
    void this.#router.navigate(['/signin']);
  }
}
