import { ListAppartement } from './../../models/appartement.model';
import { from, map, Observable, of } from "rxjs";
import { ListLocatairesObject, Locataire, LocataireDetails } from "../../models/locataire.model";

import { app, db } from "../../../firebase/firebase";
import { Injectable } from "@angular/core";
import { addDoc, updateDoc, deleteDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Appartement } from "../../models/appartement.model";

@Injectable({
    providedIn: 'root'
})
export class LocatairesFirebaseCloudstoreService {

    private locatairesCollectionRef = collection(db, 'locataires');
    private appartementsCollectionRef = collection(db, 'appartements');

    async getAllAppartsDocs() {
        const snapshot = await getDocs(this.appartementsCollectionRef);
        return snapshot.docs.map(doc => {
            console.log("data:");
            console.dir(doc.data());
            console.log("data id:"),
                console.dir(doc.id);
            return {
                id: doc.id,
                num: doc.data()['num'],
                numEtage: doc.data()['etage'],
                numPorte: doc.data()['porte'],
                locataireId: doc.data()['locataireId'],
                nomCompletLocataire: doc.data()['nomCompletLocataire'],
            }
        })
    }
    async updateAppartDoc(appart: any) {
        try {
            const docRef = doc(this.appartementsCollectionRef, appart.id);
            await updateDoc(docRef, appart);
            return true;
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode updateLocataireDoc: ");
            console.log(erreur);
            return false;
        }
    }
    async addAppartementDoc(appartement: Appartement) {
        try {
            const newAppartDoc = {
                num: appartement.num,
                etage: appartement.numEtage,
                porte: appartement.numPorte,
                locataireId: "",
                nomCompletLocataire: ""
            }

            const newAppartDocSnapshot = await addDoc(this.appartementsCollectionRef, newAppartDoc);
            console.log("appartement ajoutee avec succes, new id is: ");
            console.log(newAppartDocSnapshot.id);
            return true;
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode updateLocataireDoc: ");
            console.log(erreur);
            return false;
        }
    }
    async getAllLocatairesDoc() {
        const snapshot = await getDocs(this.locatairesCollectionRef);
        return snapshot.docs.map(doc => {
            console.log("data:");
            console.dir(doc.data());
            console.log("data id:"),
                console.dir(doc.id);
            return {
                id: doc.id,
                nom: doc.data()['nom'],
                prenoms: doc.data()['prenoms'],
                email: doc.data()['email'],
                phone: doc.data()['phone'],
                picture: doc.data()['picture'],
                appartementId: doc.data()['appartementId'],
                numeroAppartement: doc.data()['numeroAppartement'],
                created: doc.data()['created'].toDate(),
            };
        });
    }
    async getLocataireDoc(id: string) {
        const docRef = doc(db, 'locataires', id);
        const docSnapshot = await getDoc(docRef);
        let locataire: LocataireDetails | undefined = undefined;
        if (docSnapshot.exists()) {
            console.log("doc data:");
            console.log(docSnapshot.data());
            locataire = {
                id: docSnapshot.id,
                nom: docSnapshot.data()['nom'],
                prenoms: docSnapshot.data()['prenoms'],
                email: docSnapshot.data()['email'],
                phone: docSnapshot.data()['phone'],
                photoProfil: docSnapshot.data()['picture'],
                idAppartement: docSnapshot.data()['appartementId'],
                numAppartement: docSnapshot.data()['numeroAppartement'],
                paiements: [],
                created: docSnapshot.data()['created'].toDate(),
            }
            console.log("document finded!");
        } else {
            // docSnapshot.data() = undefined in this case
            console.log("No such document!");
        }

        return locataire;
    }
    async addLocataireDoc(locataire: Omit<Locataire, "id">) {
        try {
            const newDocRef = await addDoc(this.locatairesCollectionRef, locataire);
            console.log("id new locataire document: " + newDocRef.id);
            return newDocRef.id;
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode addLocataireDoc :");
            console.log(erreur);
            return false;
        }
    }
    async updateLocataireDoc(locataire: LocataireDetails) {
        try {
            const docRef = doc(db, 'locataires', locataire.id);
            await updateDoc(docRef, {
                nom: locataire.nom,
                prenoms: locataire.prenoms,
                phone: locataire.phone,
                email: locataire.email,
                appartementId: locataire.idAppartement,
                numeroAppartement: locataire.numAppartement
            });
            return true;
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode updateLocataireDoc: ");
            console.log(erreur);
            return false;
        }
    }
    async deleteLocataireDoc(idlocataire: string) {
        try {
            const deleteDocRef = deleteDoc(doc(db, 'locataires', idlocataire));
            return true;
        } catch (erreur) {
            console.log("Erreur lors de l'execution de la methode deleteLocataireDoc: ");
            console.log(erreur);
            return false;
        }
    }

    getListLocataires(): Observable<any> {
        return from(this.getAllLocatairesDoc()).pipe(map(list => list));
    }
    getListAppartements(): Observable<ListAppartement> {
        return from(this.getAllAppartsDocs()).pipe(map(list => list));
    }
    getLocataireById(idlocataire: string): Observable<any> {
        return from(this.getLocataireDoc(idlocataire)).pipe(map(snap => snap));
    }
    updateLocataire(locataire: LocataireDetails): Observable<any> {
        return from(this.updateLocataireDoc(locataire)).pipe(map(snap => snap));
    }
    deleteLocataireById(locataire: LocataireDetails): Observable<any> {
        //return from(this.deleteLocataireDoc(idlocataire)).pipe(map(snap => snap));
        let result = false;
        this.deleteLocataireDoc(locataire.id)
            .then((locataireIsDeleted) => {
                if (locataireIsDeleted) {
                    // update data of appartement
                    let appartToUpdate = {
                        id: locataire.idAppartement,
                        locataireId: '',
                        nomCompletLocataire: ''
                    }
                    this.updateAppartDoc(appartToUpdate)
                        .then((r) => {
                            console.log("result method updateAppartDoc apres supression du locataire:");
                            console.log(r);
                            if (!r) {
                                console.log("Locataire supprimer mais modification donnees appartement a echouer");
                            }
                            result = r;
                        })
                        .catch((error) => {
                            console.log("error method updateAppartDoc apres supression du locataire:");
                            console.log(error);
                            result = false
                        })
                }
            })
            .catch((error) => result = false);

        return of(result);
    }
    addLocataire(locataire: LocataireDetails): Observable<any> {
        let result = false;
        this.addLocataireDoc(locataire)
            .then((idlocataire) => {
                if (typeof (idlocataire) == "string" && idlocataire.length > 0) {
                    let appartToUpdate = {
                        id: locataire.idAppartement,
                        locataireId: idlocataire,
                        nomCompletLocataire: locataire.nom + " " + locataire.prenoms
                    }
                    this.updateAppartDoc(appartToUpdate)
                        .then((r) => {
                            console.log("result method updateAppartDoc apres ajout du locataire:");
                            console.log(r);
                            if (!r) {
                                console.log("Locataire ajouter mais modification donnees appartement a echouer");
                            }
                            result = r;
                        })
                        .catch((error) => {
                            console.log("error method updateAppartDoc apres ajout du locataire:");
                            console.log(error);
                            result = false
                        })
                }
            })
            .catch((error) => result = false);

        return of(result);
    }
    addAppartement(appartement: Appartement) {
        return from(this.addAppartementDoc(appartement)).pipe(map(value => value));
    }
}