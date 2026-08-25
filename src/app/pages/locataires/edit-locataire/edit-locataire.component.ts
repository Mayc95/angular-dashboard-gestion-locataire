import { LocatairesJsonServerService } from './../../../shared/services/json-server/locataires-json-server.service';
import { FormfieldsValidationService } from './../../../shared/services/formfields.validation.service';
import { Component, computed, effect, inject, signal } from "@angular/core";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { Locataire } from "../../../shared/models/locataire.model";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, delay, map, of } from "rxjs";
import { AlertComponent } from "../../../shared/components/ui/alert/alert.component";
import { SelectComponent } from "../../../shared/components/form/select/select.component";
import { LocatairesService } from '../../../shared/services/locataires.service';
import { LIST_ETAGE, LIST_PORTE } from '../../../shared/models/appartement.model';

@Component({
  selector: "app-edit-locataire",
  imports: [
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
    ButtonComponent,
    AlertComponent,
    //SelectComponent
],
  templateUrl: "./edit-locataire.component.html",
  styleUrl: "./edit-locataire.component.css",
})
export class EditLocataireComponent {

  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #locatairesService = inject(LocatairesService);

  readonly formfieldsValidationService = inject(FormfieldsValidationService);
  readonly LIST_ETAGE_OPTIONS = LIST_ETAGE;
  readonly LIST_PORTE_OPTIONS = LIST_PORTE;
  

  readonly #locataireId = this.#route.snapshot.paramMap.get('id') ?? '';
  readonly #locataireResponse = toSignal(
    this.#locatairesService.getLocataireById(this.#locataireId).pipe(
      map((value) => ({ value: value, error: undefined })),
      catchError(() => of({ value: undefined, error: true }))
    )
  );
  
  updatedLocataire: Locataire | undefined = undefined;
  readonly locataire = computed(() => {
    if(this.#locataireResponse() && this.#locataireResponse()?.value) {
      this.updatedLocataire = this.#locataireResponse()?.value
    }
    return this.#locataireResponse()?.value
  });
  readonly selectedAppartementId = computed(() => this.#locataireResponse()?.value?.appartementId.toString() ?? '');
  readonly loading = computed(() => this.#locataireResponse() == undefined);
  readonly error = computed(() => this.#locataireResponse()?.error);

  
  // readonly #listAppartmentResponse = toSignal(
  //   this.#locatairesService.getListAppartements().pipe(
  //     map((value) => ({value:value, error:undefined})),
  //     catchError(() => of({value:undefined, error:true}))
  //   )
  // )
  // readonly loadingSelectAppartementOption = computed(() => this.#listAppartmentResponse() == undefined);
  // readonly listAppartementOptions = computed(() => this.#listAppartmentResponse()?.value?.filter((app) => (
  //   app.locataireId.trim().length <= 0 && app.nomCompletLocataire.trim().length <= 0
  // )).map((appartement) => ({
  //     value: appartement.id,
  //     label: `${appartement.num}`
  //   })) || []);


  readonly showLoadingOnSubmitForm = signal(false);
  readonly showErrorAlertOnSubmitForm = signal(false);
  readonly errorAlertOnSubmitFormMessage = signal("");

  /*
  handleSelectAppartementChange(value: string) {
    console.log("liste apparts options: ");
    console.log(this.listAppartementOptions());
    if(value.trim().length >= 0) {
      let appartSelected = this.listAppartementOptions().find((appart) => appart.value == value);
      if(this.updatedLocataire && appartSelected) {
        this.updatedLocataire.numeroAppartement = +appartSelected.label;
        this.updatedLocataire.appartementId = appartSelected.value;
      }
    }
  }
    */

  onSubmitUpdateLocataireForm() {
    console.log("updated locataire data: ");
    console.dir(this.updatedLocataire);


    this.showErrorAlertOnSubmitForm.set(false);

    if (this.updatedLocataire) {
      // Verification des champs du formulaire
    const message =
      this.formfieldsValidationService.check(
        !this.updatedLocataire.appartementId.trim(),
        "Veuillez sélectionner un appartement"
      ) ??
      this.formfieldsValidationService.check(
        this.updatedLocataire.numeroAppartement<=0,
        "Veuillez selectionner un appartement"
      ) ??
      this.formfieldsValidationService.check(
        !this.updatedLocataire.nom.trim(),
        "Veuillez entrer un nom"
      ) ??
      this.formfieldsValidationService.check(
        !this.updatedLocataire.prenoms.trim(),
        "Veuillez entrer un prénom"
      ) ??
      this.formfieldsValidationService.check(
        !this.formfieldsValidationService.validateEmail(this.updatedLocataire.email.trim()),
        "Veuillez entrer une adresse mail valide"
      ) ??
      this.formfieldsValidationService.check(
        !this.updatedLocataire.phone.trim(),
        "Veuillez entrer un contact"
      );

    if (message) {
      this.showErrorAlertOnSubmitForm.set(true);
      this.errorAlertOnSubmitFormMessage.set(message);
      return;
    }
    // Fin verification des champs du formulaire

    console.log('locataire to update: ');
    console.log(this.updatedLocataire);

    this.showLoadingOnSubmitForm.set(true);
    debugger;

      this.#locatairesService.updateLocataire(this.updatedLocataire).pipe(delay(5000)).subscribe({
        next: () => {
          this.showLoadingOnSubmitForm.set(false);
          this.showErrorAlertOnSubmitForm.set(false);
          this.#router.navigate(['/locataires'])
        },
        error: (error) => {
          this.showLoadingOnSubmitForm.set(false);
          this.errorAlertOnSubmitFormMessage.set("Une erreur est survenue lors de la modification du locataire. Veuillez réessayer.")
          this.showErrorAlertOnSubmitForm.set(true);
          console.error("Error updating locataire: ", error);
        },
        complete: () => { this.showLoadingOnSubmitForm.set(false); }
      })
    }

  }


}
