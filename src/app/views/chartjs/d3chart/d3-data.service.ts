import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import IBatteryData from "./IBatteryData";
import ICellData from './ICellData';

@Injectable({
  providedIn: "root",
})
export class D3DataService {
  _url: string = "./assets/batteryData.json";
  constructor(private _http: HttpClient) {}

  getBatteryData(): Observable<IBatteryData[]> {
    return this._http.get<IBatteryData[]>(this._url);
  }

  getCellData(): Observable<ICellData[]> {
    let cellDataList: ICellData[] = [];
    const data1: ICellData = {
      cellDate: "1970-01-07 09:37:30",
      cellValue: 10,
    };
    const data2: ICellData = {
      cellDate: "1970-01-07 09:37:31",
      cellValue: 20,
    };
    const data3: ICellData = {
      cellDate: "1970-01-07 09:37:32",
      cellValue: 30,
    };
    cellDataList.push(data1);
    cellDataList.push(data2);
    cellDataList.push(data3);
    return of(cellDataList);
  }
}
