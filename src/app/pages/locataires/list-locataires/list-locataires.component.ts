import { getDoc } from 'firebase/firestore';
import { LIST_ETAGE, LIST_PORTE, Locataire, ListLocataires } from './../../../shared/models/locataire.model';
import { Component, computed, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalComponent } from "../../../shared/components/ui/modal/modal.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NotFoundComponent } from '../../other-page/not-found/not-found.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { RouterLink } from "@angular/router";
import { LocatairesJsonServerService } from '../../../shared/services/json-server/locataires-json-server.service';
import { LocatairesService } from '../../../shared/services/locataires.service';
import { LocatairesFirebaseCloudstoreService } from '../../../shared/services/firebase-cloudstore/locataires-firebase-cloudstore.service';

@Component({
  selector: "app-list",
  imports: [
    ModalComponent,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent,
    NotFoundComponent,
    AlertComponent,
    RouterLink
  ],
  templateUrl: "./list-locataires.component.html",
  styleUrl: "./list-locataires.component.css",
})
export class ListLocatairesComponent {


  readonly #locatairesServices = inject(LocatairesService);

  readonly #listLocatairesResponse = toSignal(
    this.#locatairesServices.getListLocataires().pipe(
      map((list) => ({ value: list, error: undefined })),
      catchError((error) => of({ value: undefined, error: error }))
    )
  );

  readonly showLoading = computed(() => this.#listLocatairesResponse() == undefined);
  readonly listLocataires = computed(() => this.#listLocatairesResponse()?.value);
  readonly error = computed(() => this.#listLocatairesResponse()?.error);

  readonly LIST_ETAGE_OPTIONS = LIST_ETAGE;
  readonly LIST_PORTE_OPTIONS = LIST_PORTE;

  readonly searchedWord = signal('');
  readonly listLocatairesFiltered = computed(() => {
    console.log('begin search');
    let searchedWord = this.searchedWord();
    let list = this.listLocataires();

    if (list != undefined && searchedWord.trim().length > 0) {
      return list.filter((l) => {
        // on cherche dans la colonne nom et prenoms du tableau
        if (`${l.nom} ${l.prenoms}`.toLowerCase().includes(searchedWord.toLowerCase())) {
          return l;
        }
        // on cherche dans la colonne appartement du tableau
        if (`Appartement ${l.appartementId}`.toLowerCase().includes(searchedWord.toLowerCase())) {
          return l;
        }
        // on cherche dans la colonne contact du tableau
        if (`${l.phone}`.toLowerCase().includes(searchedWord.toLowerCase())) {
          return l;
        }

        return;
      });
    }

    return list;
  });

  getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'Active') return 'success';
    if (status === 'Pending') return 'warning';
    return 'error';
  }

  // for delete locataire modal
  deleteLocataireModalIsOpen = false;
  showDeleteLocataireModalLoading = false;
  showDeleteLocataireModalError = false;
  selectedLocataireId = "";
  openDeleteLocataireModal(idlocataire: string) {
    this.selectedLocataireId = idlocataire;
    this.deleteLocataireModalIsOpen = true;
  }
  closeDeleteLocataireModal() {
    this.selectedLocataireId = "";
    this.deleteLocataireModalIsOpen = false;
  }
  handleDeleteLocataire() {
    this.showDeleteLocataireModalError = false;

    // Handle delete logic here
    if (this.selectedLocataireId.trim().length <= 0) {
      this.showDeleteLocataireModalError = true;
      console.log('cant delete locataire with id: ' + this.selectedLocataireId);
    } else {

      this.showDeleteLocataireModalLoading = true;

      let indexOfSelectedLocataireInListLocataires = this.listLocataires()?.findIndex(locataire => locataire.id == this.selectedLocataireId);
      let selectedLocataire = this.listLocataires()?.find(locataire => locataire.id == this.selectedLocataireId);

      if (selectedLocataire) {
        this.#locatairesServices.deleteLocataireById(selectedLocataire).subscribe({
          next: () => {
            console.log('locataire with id: ' + this.selectedLocataireId + " is deleted");
            this.listLocataires()?.splice(indexOfSelectedLocataireInListLocataires ?? -1, 1);
            this.showDeleteLocataireModalLoading = false;
            this.showDeleteLocataireModalError = false;
            this.closeDeleteLocataireModal();
          },
          error: (error) => {
            console.log('error deleting locataire with id=' + this.selectedLocataireId);
            console.error('error: ' + error);
            this.showDeleteLocataireModalLoading = false;
            this.showDeleteLocataireModalError = true;
          },
        })
      }
    }
  }



  // for update locataire modal
  selectedLocataire = signal<Locataire | undefined>(undefined);
  showDetailsLocataireModalLoading = signal(false);
  showDetailsLocataireModalError = signal(false);
  showDetailsLocataireModalIsOpen = false;
  openUpdateLocataireModal(idlocataire: string) {
    this.showDetailsLocataireModalIsOpen = true;
    this.showDetailsLocataireModalLoading.set(true);

    /*
    this.#LocatairefirestoreService.getDoc("2ay3Juf9RAGxaybiwK9I").
      then((value) => {
        this.showDetailsLocataireModalLoading.set(false);
        console.log('locataire :', value);
        if (value == undefined) {
          this.showDetailsLocataireModalError.set(true);
        } else {
          this.selectedLocataire.set(value);
          this.showDetailsLocataireModalError.set(false);
        }
      }).
      catch((error) => {
        this.showDetailsLocataireModalLoading.set(false);
        console.error('Une erreur est survenue :', error);
        this.selectedLocataire.set(undefined);
        this.showDetailsLocataireModalError.set(true);
      }).finally(() => {
        this.showDetailsLocataireModalLoading.set(false);
      });
*/

    this.#locatairesServices.getLocataireById(idlocataire).subscribe({
      next: (value) => {
        debugger;
        console.log('locataire :', value);
        if (value == undefined) {
          this.showDetailsLocataireModalError.set(true);
        } else {
          this.selectedLocataire.set(value);
          this.showDetailsLocataireModalError.set(false);
        }
      },
      error: (error) => {
        debugger;
        console.error('Une erreur est survenue :', error);
        this.selectedLocataire.set(undefined);
        this.showDetailsLocataireModalError.set(true);
      },
      complete: () => {
        console.log('Flux terminé !');
        this.showDetailsLocataireModalLoading.set(false);
      }
    })


  }
  closeUpdateDetailsLocataireModal() {
    this.selectedLocataire.set(undefined);
    this.showDetailsLocataireModalLoading.set(false);
    this.showDetailsLocataireModalError.set(false);
    this.showDetailsLocataireModalIsOpen = false;
  }
}
