import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component';
import { NotificationService } from '../../../services/api/notifications.services';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ListNotification } from '../../../models/shared.model';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemComponent, DatePipe]
})
export class NotificationDropdownComponent {

  readonly #refreshSignal = signal(0);
  notifying = signal(false);
  readonly #notificationService = inject(NotificationService);
  readonly notificationsResponse = toSignal(
    toObservable(this.#refreshSignal).pipe(
      switchMap(() => this.#notificationService.getUnreadNotifications().pipe(
        tap((value) => {
          debugger;
          if (value.length > 0) {
            this.notifying.set(true);
          }
        }),
        map((value) => ({ value: value, error: undefined })),
        catchError(() => of({ value: undefined, error: true }))
      ))
    )
  );
  // readonly notificationsResponse = toSignal(this.#notificationService.getUnreadNotifications().pipe(
  //   tap((value) => {
  //     debugger;
  //     if (value.length > 0) {
  //       this.notifying.set(true);
  //     }
  //   }),
  //   map((value) => ({ value: value, error: undefined })),
  //   catchError(() => of({ value: undefined, error: true }))
  // ), { initialValue: undefined });

  isOpen = false;


  readonly notifications = computed(() => this.notificationsResponse()?.value ?? []);

  markAllAsRead() {
    this.#notificationService.markAllAsRead().subscribe(() => {
      this.notifying.set(false);
      this.closeDropdown();
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.notifying.set(false);
  }

  closeDropdown() {
    this.#refreshSignal.update((currentvalue) => ++currentvalue);
    this.isOpen = false;
  }
}