import { FormfieldsValidationService } from './../../../shared/services/formfields.validation.service';
import { Locataire } from './../../../shared/models/locataire.model';
import { Component, computed, inject, signal } from "@angular/core";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { SelectComponent } from "../../../shared/components/form/select/select.component";
import { catchError, delay, map, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AlertComponent } from "../../../shared/components/ui/alert/alert.component";
import { LocatairesService } from '../../../shared/services/locataire.service';
import { AppartementService } from '../../../shared/services/appartement.service';

@Component({
  selector: "app-add-locataire",
  standalone: true,
  imports: [
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
    ButtonComponent,
    SelectComponent,
    AlertComponent,
],
  templateUrl: "./add-locataire.component.html",
  styleUrl: "./add-locataire.component.css",
})
export class AddLocataireComponent {

  newLocataire = {
    idAppartement: '',
    nom: '',
    prenoms: '',
    phone: '',
    email: '',
    picture: '',
  };
  photoProfilFile: File|undefined = undefined;
  photoProfilPreview: String|undefined = undefined;
  // -- pour plus tard
  // docAdministratifFile: File|undefined = undefined;
  // contratFile: File|undefined = undefined;

  readonly router = inject(Router);
  readonly formfieldsValidationService = inject(FormfieldsValidationService);
  readonly #locataireService = inject(LocatairesService);
  readonly #appartementService = inject(AppartementService);
  readonly #listAppartementsResponse = toSignal(this.#appartementService.getListAppartement().pipe(
    delay(2000),
    map((value) => ({ value: value, error: undefined })),
    catchError(() => of({ value: [], error: true }))
  ))

  readonly showLoadingListAppartements = computed(() => this.#listAppartementsResponse() == undefined);
  readonly listAppartementsOptions = computed(() => this.#listAppartementsResponse()?.value?.filter((appart) => (
    appart.idLocataire == null && appart.nomLocataire == null
  )).map((appartement) => ({
    value: appartement.id,
    label: `${appartement.num}`
  })) || []);

  readonly showLoading = signal(false);
  readonly error = signal(false);
  errorMessage = signal("");

  onChangePhotoProfil(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      console.log("photo de profil selectionner :");
      console.log(file);
      this.photoProfilFile = file;
      this.photoProfilPreview = URL.createObjectURL(file);
    }
  }


  handleSelectAppartementChange(value: string) {

    let idSelectedAppartement = value;
    let listAppartment = this.#listAppartementsResponse()?.value;
    if (listAppartment != undefined && value.trim().length > 0) {
      let selectedAppartement = listAppartment.find((appart) => idSelectedAppartement == appart.id)
      if (selectedAppartement) {
        this.newLocataire.idAppartement = selectedAppartement.id;
      }
    }
  }

  onAddLocataire() {
    console.log('new Locataire: ');
    console.dir(this.newLocataire);

    console.log("listAppartementsResponse value:");
    console.log(this.#listAppartementsResponse()?.value);

    console.log("listAppartements options:");
    console.log(this.listAppartementsOptions());


    this.error.set(false);
    // Verification des champs du formulaire
    const message =
      this.formfieldsValidationService.check(
        !this.newLocataire.idAppartement.trim(),
        "Veuillez sélectionner un appartement"
      ) ??
      this.formfieldsValidationService.check(
        !this.newLocataire.nom.trim(),
        "Veuillez entrer un nom"
      ) ??
      this.formfieldsValidationService.check(
        !this.newLocataire.prenoms.trim(),
        "Veuillez entrer un prénom"
      ) ??
      this.formfieldsValidationService.check(
        !this.formfieldsValidationService.validateEmail(this.newLocataire.email.trim()),
        "Veuillez entrer une adresse mail valide"
      ) ??
      this.formfieldsValidationService.check(
        !this.newLocataire.phone.trim(),
        "Veuillez entrer un contact"
      );

    if (message) {
      this.error.set(true);
      this.errorMessage.set(message);
      return;
    }
    // Fin verification des champs du formulaire

    this.showLoading.set(true);
    this.#locataireService.addLocataire(this.newLocataire, this.photoProfilFile).pipe(delay(3500)).subscribe({
      next: () => {
        this.showLoading.set(false);
        this.router.navigate(['/locataires']);
      },
      error: (error) => {
        console.log("erreur: ");
        console.log(error);
        this.error.set(true);
        this.errorMessage.set("Erreur lors de l'ajout du locataire veuillez reessayer");
        this.showLoading.set(false);
      },
      complete: () => {
        this.error.set(false);
        this.showLoading.set(false);
      }
    })


  }

}
