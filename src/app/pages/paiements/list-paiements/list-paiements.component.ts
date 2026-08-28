import { Component, computed, inject, signal } from "@angular/core";
import { BadgeComponent } from "../../../shared/components/ui/badge/badge.component";
import { ModalComponent } from "../../../shared/components/ui/modal/modal.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { PaiementDetails } from '../../../shared/models/paiement.model';
import { catchError, map, of } from 'rxjs';
import { NotFoundComponent } from '../../other-page/not-found/not-found.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { PaiementsService } from "../../../shared/services/paiements.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-list-paiements",
  imports: [
    DatePipe,
    BadgeComponent,
    ModalComponent,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent,
    NotFoundComponent,
    AlertComponent,
  ],
  templateUrl: "./list-paiements.component.html",
  styleUrl: "./list-paiements.component.css",
})
export class ListPaiementsComponent {

  readonly #paiementsService = inject(PaiementsService);
  readonly #listPaiementsDetailsResponse = toSignal(
    this.#paiementsService.getListPaiements().pipe(
      map((list) => ({ value: list, error: undefined })),
      catchError(() => of({ value: undefined, error: true }))
    )
  );

  readonly showLoading = computed(() => this.#listPaiementsDetailsResponse() == undefined);
  readonly error = computed(() => this.#listPaiementsDetailsResponse()?.error);
  readonly listPaiements = computed(() => this.#listPaiementsDetailsResponse()?.value);
  readonly listPaiementsFiltered = computed(() => {
    console.log('begin search');
    let searchedWord = this.searchedWord();
    let list = this.listPaiements();

    if (list != undefined && searchedWord.trim().length > 0) {
      return list.filter((paiement) => {
        // on cherche dans la colonne nom et prenoms du locataire dans le tableau
        if(paiement.nomLocataire.toLowerCase().includes(searchedWord.toLowerCase())) {
          return paiement;
        }
        // on cherche dans la colonne montant du tableau
        if(paiement.montant.toLowerCase().includes(searchedWord.toLowerCase())) {
          return paiement;
        }
        // on cherche dans la colonne mois du tableau
        if(paiement.mois.toLowerCase().includes(searchedWord.toLowerCase())) {
          return paiement;
        }
        // on cherche dans la colonne statut du tableau
        if(paiement.statut.toLowerCase().includes(searchedWord.toLowerCase())) {
          return paiement;
        }

        return;
      });
    }

    return list;
  });
  readonly searchedWord = signal('');


  getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'valider') return 'success';
    if (status === 'en cours') return 'warning';
    return 'error';
  }

  // for delete paiement modal
  deletePaiementModalIsOpen = false;
  showDeletePaiementModalLoading = false;
  showDeletePaiementModalError = false;
  selectedPaiementId = '';
  openDeletePaiementModal(idpaiement: string) {
    this.selectedPaiementId = idpaiement;
    this.deletePaiementModalIsOpen = true;
  }
  closeDeletePaiementModal() {
    this.selectedPaiementId = '';
    this.deletePaiementModalIsOpen = false;
  }
  handleDeletePaiement() {
    this.showDeletePaiementModalLoading = true;

    // Handle delete logic here
    if (this.selectedPaiementId == '') {
      console.log('cant delete paiement with id: ' + this.selectedPaiementId);
    } else {
      let indexOfSelectedPaiementInListPaiements = this.listPaiements()?.findIndex(p => p.id === this.selectedPaiementId) ?? -1;

      this.#paiementsService.deletePaiementById(this.selectedPaiementId).subscribe({
        next: () => {
          console.log('delete paiement with id: ' + this.selectedPaiementId);
          this.listPaiements()?.splice(indexOfSelectedPaiementInListPaiements, 1);
          this.showDeletePaiementModalLoading = false;
          this.showDeletePaiementModalError = false;
          this.closeDeletePaiementModal();
        },
        error: (error) => {
          console.log('error deleting paiement with id=' + this.selectedPaiementId);
          console.error('error: ' + error);
          this.showDeletePaiementModalLoading = false;
          this.showDeletePaiementModalError = true;
        },
      })

    }
  }

  // for show paiement modal
  selectedPaiement = signal<PaiementDetails | undefined>(undefined);
  showModalLoading = signal(false);
  modalError = signal(false);
  showPaiementModalIsOpen = false;
  openShowPaiementModal(idpaiement: string) {
    this.showPaiementModalIsOpen = true;
    this.showModalLoading.set(true);

    this.#paiementsService.getPaiementById(idpaiement).subscribe({
      next: valeur => {
        console.log('Valeur reçue :', valeur);
        this.selectedPaiement.set(valeur);
        this.modalError.set(false);
      },
      error: err => {
        console.error('Une erreur est survenue :', err)
        this.selectedPaiement.set(undefined);
        this.modalError.set(true);
      },
      complete: () => {
        console.log('Flux terminé !');
        this.showModalLoading.set(false);
      }
    });
  }
  closeShowPaiementModal() {
    this.selectedPaiement.set(undefined);
    this.modalError.set(false);
    this.showPaiementModalIsOpen = false;
  }
}
