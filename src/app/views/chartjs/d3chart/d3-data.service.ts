import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import IBatteryData from "./IBatteryData";

@Injectable({
  providedIn: "root",
})
export class D3DataService {
  _url: string = "./assets/batteryData.json";
  constructor(private _http: HttpClient) {}

  getBatteryData(): Observable<IBatteryData[]> {
    return this._http.get<IBatteryData[]>(this._url);
  }
}
