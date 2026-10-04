import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, signal } from "@angular/core";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { SelectComponent } from "../../../shared/components/form/select/select.component";
import { DatePickerComponent } from "../../../shared/components/form/date-picker/date-picker.component";
import { MONTHS } from "../../../shared/models/shared.model";
import { LIST_STATUT_PAIEMENT, Paiement } from "../../../shared/models/paiement.model";
import { catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { FormfieldsValidationService } from '../../../shared/services/formfields.validation.service';
import { AlertComponent } from "../../../shared/components/ui/alert/alert.component";
import { LocataireListObject } from '../../../shared/models/locataire.model';
import { LocatairesService } from '../../../shared/services/locataire.service';
import { PaiementsService } from '../../../shared/services/paiements.service';


@Component({
  selector: "app-add-paiement",
  imports: [
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    DatePickerComponent,
    ButtonComponent,
    AlertComponent
],
  templateUrl: "./add-paiement.component.html",
  styleUrl: "./add-paiement.component.css",
})
export class AddPaiementComponent {

  readonly LIST_MONTHS_OPTIONS = MONTHS;
  readonly LIST_STATUT_OPTIONS = LIST_STATUT_PAIEMENT
  readonly #locataireService = inject(LocatairesService);
  readonly #paiementService = inject(PaiementsService);
  readonly router = inject(Router);
  readonly formfieldsValidationService = inject(FormfieldsValidationService);

  readonly #listLocataire = toSignal(this.#locataireService.getLocataires().pipe(
    map((list) => ({ value: list, error: undefined })),
    catchError((error) => of({ value: undefined, error: error }))
  ));

  readonly hideSelectedLocataireInput = computed(() => this.#listLocataire() == undefined);
  readonly listLocataire = computed(() => this.#listLocataire()?.value);
  readonly error = signal(false);
  readonly showLoading = signal(false);
  errorMessage = signal("");

  newPaiement:Paiement = {
    idLocataire: '',
    montant: 0,
    mois: '',
    datePaiement: new Date(),
  }

  // for select Locataire
  readonly listLocataireOptions = computed(() => this.#listLocataire()?.value?.map((locataire) => ({ value: locataire.id.toString(), label: `${locataire.nom} ${locataire.prenoms}` })) || []);
  
  // for input Recu Paiement file
  readonly recuPaiementFile= signal<File|undefined>(undefined);
  recuPaiementFilePreview:string|undefined = undefined;


  handleSelectLocataireChange(value: string) {
    console.log('list locataire:');
    console.dir(this.#listLocataire()?.value);
    let list = this.#listLocataire()?.value;
    if(list!=undefined) {
      let selectedLocataire:LocataireListObject|undefined = list.find((lc) => lc.id==value);
      if(selectedLocataire) {
        this.newPaiement.idLocataire = selectedLocataire.id;
      }
    }
    
    this.newPaiement.idLocataire = value;
    console.log('Selected Locataire value:', value);
  }

  onChangeRecuPaiement(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      const file = input.files[0];
      this.recuPaiementFile.set(file);
      this.recuPaiementFilePreview = URL.createObjectURL(file);
    }
  }


  // for input Montant
  handleMontantChange(value:string) {
    console.log('Montant string: ',value);
    console.log('Montant number: ',parseFloat(value));
    this.newPaiement.montant = parseFloat(value) || 0;
  }

  // for select Mois
  handleSelectMoisChange(value: string) {
    this.newPaiement.mois = value;
    console.log('Selected Mois value:', value);
  }

  // for date paiement input
  handleDatePaiementChange(event: any) {
    this.newPaiement.datePaiement = event.selectedDates[0];
    console.log(event);
    console.log(typeof event);
    console.log('Date changed:', this.newPaiement.datePaiement ?? null);
  }

  //
  onAddPaiement() {

    console.log('paiement:');
    console.dir(this.newPaiement);

    const paiement: Paiement = {
        idLocataire: this.newPaiement.idLocataire,
        montant: this.newPaiement.montant,
        mois: this.newPaiement.mois,
        datePaiement: this.newPaiement.datePaiement,
      }

    // Verification des champs du formulaire
    const message =
      this.formfieldsValidationService.check(
        !paiement.idLocataire.trim(),
        "Veuillez sélectionner un locataire"
      ) ??
      this.formfieldsValidationService.check(
        !paiement.mois.trim(),
        "Veuillez selectionner un mois"
      ) ??
      this.formfieldsValidationService.check(
        paiement.montant == 0,
        "Veuillez entrer un montant en Fcfa (que des chiffres)"
      ) ??
      this.formfieldsValidationService.check(
        !paiement.datePaiement,
        "Veuillez selectionner une date"
      );

    if (message) {
      this.error.set(true);
      this.errorMessage.set(message);
      return;
    }
    // Fin verification des champs du formulaire

    console.log('new Paiement value:');
      console.table(paiement);

      this.showLoading.set(true);

      this.#paiementService.addPaiement(paiement, this.recuPaiementFile()).subscribe({
        next: () => {
          this.showLoading.set(false);
          this.router.navigate(['/paiements']);
        },
        error: (response) => {
          console.log('Error adding paiement:', response);
          this.showLoading.set(false);
          this.error.set(true);
          let msgError = "Erreur survenue pendant l'enregistrement du paiement, veuillez réessayer.";
          if (response.error && response.error.message) {
            msgError = "Erreur survenue pendant l'enregistrement du paiement: " + response.error.message
          }
          this.errorMessage.set(msgError);
          
        },
        complete: () => this.showLoading.set(false)
      })

  }
}
