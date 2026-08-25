import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Appartement, AppartementDetails, ListAppartementDetails } from "../models/appartement.model";
import { Observable } from "rxjs";

export abstract class AppartementService {
    abstract getListAppartement(): Observable<ListAppartementDetails>;
    abstract getAppartementById(id: string): Observable<AppartementDetails>;
    abstract updateAppartement(id:string, appartement: Appartement): Observable<Appartement>;
    abstract deleteAppartementById(id:string): Observable<any>;
    abstract addAppartement(appartement: Appartement): Observable<Appartement>;
}