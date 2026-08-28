import { from, map, Observable, of } from "rxjs";
import { ListPaiementsDetails, Paiement, PaiementDetails } from "../../models/paiement.model";
import { PaiementsService } from "../paiements.service";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export class PaiementsFirebaseCloudstoreService {

    private paiementsCollectionRef = collection(db, 'paiements');


    async getAllPaiementsDocs() {
        let allPaiementsDocs: ListPaiementsDetails = [];
        try {
            const snapshot = await getDocs(this.paiementsCollectionRef);
            snapshot.docs.map((doc) => {
                let paiement: PaiementDetails = {
                    id: doc.id,
                    montant: doc.data()['montant'],
                    mois: doc.data()['mois'],
                    statut: doc.data()['statut'],
                    idLocataire: doc.data()['locataireId'],
                    nomLocataire: doc.data()['nomCompletLocataire'],
                    numAppartement: doc.data()['numeroAppartement'],
                    idAppartement: doc.data()['idAppartement'],
                    datePaiement: doc.data()['datePaiement'].toDate(),
                    created: doc.data()['created'].toDate(),
                }
                allPaiementsDocs.push(paiement);
            })
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode getAllPaiementsDocs :");
            console.log(erreur);
        }
        return allPaiementsDocs;
    }
    async getPaiementDoc(id: string) {
        let paiement: PaiementDetails | undefined = undefined
        try {
            const docRef = doc(db, 'paiements', id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                paiement = {
                    id: snap.id,
                    montant: snap.data()['montant'],
                    mois: snap.data()['mois'],
                    statut: snap.data()['statut'],
                    nomLocataire: snap.data()['nomCompletLocataire'],
                    numAppartement: snap.data()['numeroAppartement'],
                    idAppartement: snap.data()['idAppartement'],
                    idLocataire: snap.data()['locataireId'],
                    datePaiement: snap.data()['datePaiement'].toDate(),
                    created: snap.data()['created'].toDate(),
                }
            }
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode getPaiementDoc :");
            console.log(erreur);
        }
        return paiement;
    }
    async addPaiementDoc(paiement: Omit<Paiement, 'id'>) {
        let result: boolean = false;
        try {
            const newDocRef = await addDoc(this.paiementsCollectionRef, paiement);
            if (newDocRef.id) {
                console.log("id new paiement document: " + newDocRef.id);
                result = true;
            } else {
                console.log("Aucun document paiement enregistrer apres execution de la methode addPaiementDoc veuillez reessayer.");
            }
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode addPaiementDoc :");
            console.log(erreur);
        }
        return result;
    }
    async deletePaiementDoc(id: string) {
        let result = false;
        try{
           const docRef = doc(this.paiementsCollectionRef,id);
           await deleteDoc(docRef);
           result = true;
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode deletePaiementDoc :");
            console.log(erreur);
        }
        return result;
    }

    getListPaiements(): Observable<ListPaiementsDetails> {
        return from(this.getAllPaiementsDocs()).pipe(map(snap => snap));
    }
    getPaiementById(idpaiement: string): Observable<any> {
        return from(this.getPaiementDoc(idpaiement)).pipe(map(snap => snap));
    }
    deletePaiementById(idpaiement: string): Observable<any> {
        return from(this.deletePaiementDoc(idpaiement)).pipe(map(snap => snap));
    }
    addPaiement(paiement: Omit<Paiement, "id">): Observable<any> {
        return from(this.addPaiementDoc(paiement)).pipe(map(snap => snap));
    }
}