import { from, map, Observable, of } from "rxjs";
import { ListPaiements, Paiement } from "../../models/paiement.model";
import { PaiementsService } from "../paiements.service";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export class PaiementsFirebaseCloudstoreService implements PaiementsService {

    private paiementsCollectionRef = collection(db, 'paiements');


    async getAllPaiementsDocs() {
        let allPaiementsDocs: ListPaiements = [];
        try {
            const snapshot = await getDocs(this.paiementsCollectionRef);
            snapshot.docs.map((doc) => {
                let paiement: Paiement = {
                    id: doc.id,
                    montant: doc.data()['montant'],
                    mois: doc.data()['mois'],
                    statut: doc.data()['statut'],
                    nomCompletLocataire: doc.data()['nomCompletLocataire'],
                    numeroAppartement: doc.data()['numeroAppartement'],
                    locataireId: doc.data()['locataireId'],
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
        let paiement: Paiement | undefined = undefined
        try {
            const docRef = doc(db, 'paiements', id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                paiement = {
                    id: snap.id,
                    montant: snap.data()['montant'],
                    mois: snap.data()['mois'],
                    statut: snap.data()['statut'],
                    nomCompletLocataire: snap.data()['nomCompletLocataire'],
                    numeroAppartement: snap.data()['numeroAppartement'],
                    locataireId: snap.data()['locataireId'],
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

    getListPaiements(): Observable<ListPaiements> {
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