import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor() { }

  SetStorageAny(data: any, name: string) {
    localStorage.setItem(name, JSON.stringify(data));
  }
  GetStorageAny(name: string): any {
    let r = localStorage.getItem(name);
    if (r && r != "undefined") {
      let json = JSON.parse(r);
      return json;
    } else {
      return null;
    }
  }

  SetStorage(data: any, name: string) {
    localStorage.setItem(name, data);
  }
  GetStorage(name: string): any {
    return localStorage.getItem(name);
  }
}
