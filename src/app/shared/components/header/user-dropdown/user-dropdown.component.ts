import { Component, inject } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

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
export class UserDropdownComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  isOpen = false;

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
