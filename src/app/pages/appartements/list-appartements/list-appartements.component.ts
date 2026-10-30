import { Component, computed, inject, signal } from "@angular/core";
import { NotFoundComponent } from "../../other-page/not-found/not-found.component";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ModalComponent } from "../../../shared/components/ui/modal/modal.component";
import { AlertComponent } from "../../../shared/components/ui/alert/alert.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { Router } from '@angular/router';
import { FormfieldsValidationService } from '../../../shared/services/formfields.validation.service';
import { AppartementService } from "../../../shared/services/appartement.service";
import { Appartement, AppartementDetails } from "../../../shared/models/appartement.model";

@Component({
  selector: "app-list-appartements",
  imports: [NotFoundComponent, ModalComponent, AlertComponent, LabelComponent, InputFieldComponent, ButtonComponent],
  templateUrl: "./list-appartements.component.html",
  styleUrl: "./list-appartements.component.css",
})
export class ListAppartementsComponent {

  readonly #signalDeclencheur = signal(0);
  readonly #appartementService = inject(AppartementService);
  readonly router = inject(Router);
  readonly formfieldsValidationService = inject(FormfieldsValidationService);

  readonly #listAppartementsResponse = toSignal(
    toObservable(this.#signalDeclencheur).pipe(
      switchMap(() => this.#appartementService.getListAppartement().pipe(
        map((value) => ({ value: value, error: undefined })),
        catchError((error) => of({ value: undefined, error: error }))
      )))
  );

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
        // on cherche dans la colonne batiment du tableau
        if (appart.batiment.toString().toLowerCase().includes(searchedWord.toLowerCase())) {
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
        // on cherche dans la colonne libelle du tableau
        if (appart.libelle.toString().toLowerCase().includes(searchedWord.toLowerCase())) {
          return appart;
        }
        // on cherche dans la colonne locataire du tableau
        if (appart.nomLocataire.toLowerCase().includes(searchedWord.toLowerCase())) {
          return appart;
        }
        // on cherche dans la colonne locataire le mot aucun
        if (searchedWord.toLowerCase() == 'aucun'.toLowerCase() && appart.nomLocataire.trim().toLowerCase().length <= 0) {
          return appart;
        }
        return;
      });
    }

    return list;
  })

  newAppartement = {
    batiment: '',
    numEtage: '',
    numPorte: ''
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
    // pour declencher le processus de mise a jour de la liste de appartements
    this.#signalDeclencheur.update((currentValue) => ++currentValue);
    // on vide les champs des formulaires
    this.newAppartement.batiment = '';
    this.newAppartement.numEtage = '';
    this.newAppartement.numPorte = '';
    // on ferme le modal
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
        this.newAppartement.batiment.trim().length <= 0,
        "Veuillez entrer le libelle du batiment (ex: A, B, C etc...)"
      ) ??
      this.formfieldsValidationService.check(
        this.newAppartement.numEtage.trim().length <= 0 || isNaN(parseInt(this.newAppartement.numEtage.trim())),
        "Veuillez entrer un numero pour l'étage (ex: 0 pour le rez-de-chaussée, ou 1, 2, 3, 5 etc...)"
      ) ??
      this.formfieldsValidationService.check(
        this.newAppartement.numPorte.trim().length <= 0 || isNaN(parseInt(this.newAppartement.numPorte.trim())),
        "Veuillez entrer un numero pour la porte de l'appartement (ex: Un chiffre compris entre 1 et 9)"
      );

    if (message) {
      this.addAppartementModalError.set(true);
      this.errorMessage.set(message);
      return;
    }

    // 
    let newAppart:Appartement = {
      batiment: this.newAppartement.batiment,
      numEtage: parseInt(this.newAppartement.numEtage),
      numPorte: parseInt(this.newAppartement.numPorte)
    }
    const appartWithSameData = this.listAppartements()?.find((appart) =>
      appart.batiment == newAppart.batiment &&
      appart.numEtage == newAppart.numEtage &&
      appart.numPorte == newAppart.numPorte
    )
    if (appartWithSameData) {
      this.addAppartementModalError.set(true);
      this.errorMessage.set("Erreur, un appartement avec les memes numeros d'etage et de porte et le meme libelle de batiment existe deja, veuillez modifier ces valeurs");
      return;
    }

    this.addAppartementModalLoading.set(true);

    this.#appartementService.addAppartement(newAppart).subscribe({
      next: () => {
        this.searchedWord.set("");
        this.closeAddAppartementModal();
      },
      error: (response) => {
        console.log('Erreur pendant ajout appartement: ');
        console.log(response);
        this.addAppartementModalLoading.set(false);
        this.addAppartementModalError.set(true);
        let msgError = "Erreur survenue pendant l'ajout d'un appartement, veuillez réessayer.";
        if (response.error && response.error.message) {
          msgError = "Erreur pendant l'ajout d'un appartement: " + response.error.message
        }
        this.errorMessage.set(msgError);
      },
      complete: () => {
        this.addAppartementModalLoading.set(false);
      }
    })
  }

  deleteAppartementModalLoading = false;
  deleteAppartementModalError = false;
  deleteAppartementModalIsOpen = false;
  idAppartementToDelete = signal('');
  openDeleteAppartementModal(id: string) {
    this.idAppartementToDelete.set(id);
    this.deleteAppartementModalLoading = false;
    this.deleteAppartementModalError = false;
    this.deleteAppartementModalIsOpen = true;
  }
  closeDeleteAppartementModal() {
    this.#signalDeclencheur.update((currentValue) => ++currentValue);
    this.idAppartementToDelete.set('');
    this.deleteAppartementModalLoading = false;
    this.deleteAppartementModalError = false;
    this.deleteAppartementModalIsOpen = false;
  }
  handleDeleteAppartement() {
    this.deleteAppartementModalLoading = true;
    const id = this.idAppartementToDelete();
    if (id.trim().length > 0) {
      this.#appartementService.deleteAppartementById(id).subscribe({
        next: () => {
          //this.deleteAppartementModalLoading = false;
          this.closeDeleteAppartementModal();
        },
        error: () => {
          this.deleteAppartementModalLoading = false;
          this.deleteAppartementModalError = true;
        },
        complete: () => this.deleteAppartementModalLoading = false
      })
    } else {
      this.deleteAppartementModalLoading = false;
      this.deleteAppartementModalError = true;
    }
  }
}
