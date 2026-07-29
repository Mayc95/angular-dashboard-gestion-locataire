import { Appartement, ListAppartements } from './../../../shared/models/locataire.model';
import { Component, computed, inject, signal } from "@angular/core";
import { NotFoundComponent } from "../../other-page/not-found/not-found.component";
import { LocatairesService } from "../../../shared/services/locataires.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs";
import { ModalComponent } from "../../../shared/components/ui/modal/modal.component";
import { AlertComponent } from "../../../shared/components/ui/alert/alert.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { Router } from '@angular/router';
import { FormfieldsValidationService } from '../../../shared/services/formfields.validation.service';

@Component({
  selector: "app-list-appartements",
  imports: [NotFoundComponent, ModalComponent, AlertComponent, LabelComponent, InputFieldComponent, ButtonComponent],
  templateUrl: "./list-appartements.component.html",
  styleUrl: "./list-appartements.component.css",
})
export class ListAppartementsComponent {

  readonly #locatairesServices = inject(LocatairesService);
  readonly router = inject(Router);
  readonly formfieldsValidationService = inject(FormfieldsValidationService);

  readonly #listAppartementsResponse = toSignal(
    this.#locatairesServices.getListAppartements().pipe(
      map((value) => ({ value: value, error: undefined }),
        catchError((error) => of({ value: undefined, error: error }))
      ))
  )

  readonly error = computed(() => this.#listAppartementsResponse()?.error);
  readonly listAppartements = computed(() => this.#listAppartementsResponse()?.value);
  readonly showLoading = computed(() => this.#listAppartementsResponse() == undefined);

  readonly searchedWord = signal("");
  readonly listAppartementsFiltered = computed(() => {
    let searchedWord = this.searchedWord();
    let list = this.listAppartements();

    if (list != undefined && searchedWord.trim().length > 0) {
      return list.filter((appart) => {
        // on cherche dans la colonne id
        if (appart.id.toLowerCase().includes(searchedWord.toLowerCase())) {
          return appart;
        }
        // on cherche dans la colonne num du tableau
        if (appart.num.toString().toLowerCase().includes(searchedWord.toLowerCase())) {
          return appart;
        }
        // on cherche dans la colonne etage du tableau
        if (appart.numEtage.toString().toLowerCase().includes(searchedWord.toLowerCase())) {
          return appart;
        }
        // on cherche dans la colonne porte du tableau
        if (appart.numPorte.toString().toLowerCase().includes(searchedWord.toLowerCase())) {
          return appart;
        }
        // on cherche dans la colonne locataire du tableau
        if (appart.nomCompletLocataire.toLowerCase().includes(searchedWord.toLowerCase())) {
          return appart;
        }
        // on cherche dans la colonne locataire le mot aucun
        if (searchedWord.toLowerCase() == 'aucun'.toLowerCase() && appart.nomCompletLocataire.trim().toLowerCase().length <= 0) {
          return appart;
        }
        return;
      });
    }

    return list;
  })

  newAppartement: Appartement = {
    id: '',
    num: 0,
    numEtage: 0,
    numPorte: 0,
    locataireId: '',
    nomCompletLocataire: ''
  };
  addAppartementModalLoading = signal(false);
  addAppartementModalError = signal(false);
  addAppartementModalIsOpen = signal(false);
  errorMessage = signal("Erreur lors de l'ajout du locataire veuillez reessayer")
  openAddAppartementModal() {
    this.addAppartementModalIsOpen.set(true);
    this.addAppartementModalError.set(false);

    console.log("listAppartements value:");
    console.log(this.listAppartements());
  }
  closeAddAppartementModal() {
    this.addAppartementModalIsOpen.set(false);
  }
  onSubmitAddAppartementForm() {
    console.log("new appart data: ");
    console.log(this.newAppartement);

    // checking
    this.addAppartementModalError.set(false);
    // Verification des champs du formulaire
    const message =
      this.formfieldsValidationService.check(
        this.newAppartement.num <= 0,
        "Veuillez sélectionner un numero superieur a 0"
      ) ??
      this.formfieldsValidationService.check(
        this.newAppartement.numPorte <= 0,
        "Veuillez sélectionner un numero superieur a 0"
      );

    if (message) {
      this.addAppartementModalError.set(true);
      this.errorMessage.set(message);
      return;
    }

    // 
    const appartWithSameData = this.listAppartements()?.find((appart) =>
      appart.numEtage == this.newAppartement.numEtage && appart.numPorte == this.newAppartement.numPorte ||
      appart.num == this.newAppartement.num
    )
    if (appartWithSameData) {
      this.addAppartementModalError.set(true);
      if (appartWithSameData.num == this.newAppartement.num) {
        this.errorMessage.set("Erreur, un appartement avec le meme numero existe deja, veuillez modifier cette valeur");
      } else {
        this.errorMessage.set("Erreur, un appartement avec les memes numeros d'etage et de porte existe deja, veuillez modifier ces valeurs");
      }

      return;
    }

    this.addAppartementModalLoading.set(true);

    this.#locatairesServices.addAppartement(this.newAppartement).subscribe({
      next: () => {
        this.searchedWord.set("");
        this.closeAddAppartementModal();
      },
      error: (error) => {
        console.log('Error pendant ajout appartement: ');
        console.log(error);
        this.addAppartementModalError.set(true);
        this.errorMessage.set("Erreur pendant l'ajout d'un appartement: "+error);
      },
      complete: () => {
        this.addAppartementModalLoading.set(false);
      }
    })
  }
}
