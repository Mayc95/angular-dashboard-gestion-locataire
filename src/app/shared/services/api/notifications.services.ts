import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ListNotification } from "../../models/shared.model";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    readonly #http = inject(HttpClient);
    readonly #NOTIFICATIONS_API_URL = `${environment.apiUrl}${environment.notificationsPath}`;

    getUnreadNotifications():Observable<ListNotification> { 
        return this.#http.get<ListNotification>(this.#NOTIFICATIONS_API_URL);
    }

    markAllAsRead():Observable<any> {
        return this.#http.get(`${this.#NOTIFICATIONS_API_URL}/viewall`);
    }

}