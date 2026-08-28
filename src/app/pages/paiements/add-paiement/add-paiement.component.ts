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
import { catchError, delay, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { FormfieldsValidationService } from '../../../shared/services/formfields.validation.service';
import { AlertComponent } from "../../../shared/components/ui/alert/alert.component";
import { Locataire, LocataireDetails, LocataireListObject } from '../../../shared/models/locataire.model';
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
    delay(5000),
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
    montant: '',
    mois: '',
    statut: '',
    datePaiement: new Date(),
  }

  // for select Locataire
  readonly listLocataireOptions = computed(() => this.#listLocataire()?.value?.map((locataire) => ({ value: locataire.id.toString(), label: `${locataire.nom} ${locataire.prenoms}` })) || []);
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

  // for input Montant
  handleMontantChange(value:string) {
    console.log('Montant: ',value);
    this.newPaiement.montant = value;
  }

  // for select Mois
  handleSelectMoisChange(value: string) {
    this.newPaiement.mois = value;
    console.log('Selected Mois value:', value);
  }

  // for select Statut
  handleSelectStatutChange(value: string) {
    this.newPaiement.statut = value;
    console.log('Selected Statut value:', value);
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

    const paiement: Omit<Paiement,'id'> = {
        idLocataire: this.newPaiement.idLocataire,
        montant: this.newPaiement.montant,
        mois: this.newPaiement.mois,
        statut: this.newPaiement.statut,
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
        !paiement.montant.trim(),
        "Veuillez entrer un montant"
      ) ??
      this.formfieldsValidationService.check(
        !paiement.datePaiement,
        "Veuillez selectionner une date"
      ) ??
      this.formfieldsValidationService.check(
        !paiement.statut.trim(),
        "Veuillez selectionner un statut"
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

      this.#paiementService.addPaiement(paiement).pipe(delay(3000)).subscribe({
        next: () => {
          this.showLoading.set(false);
          this.router.navigate(['/paiements']);
        },
        error: (error) => {
          console.log('Error adding paiement:', error);
          this.showLoading.set(false);
          this.errorMessage.set("Une erreur est survenue lors de l'ajout du locataire. Veuillez réessayer.");
          this.error.set(true);
        },
        complete: () => this.showLoading.set(false)
      })

  }
}
