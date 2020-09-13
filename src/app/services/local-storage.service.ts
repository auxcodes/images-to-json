import { Injectable } from '@angular/core';
import { StoredFields } from '../shared/interfaces/stored-fields';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  supported = true;
  hasEntry = () => localStorage.length > 0;

  constructor() {
    this.supported = window.localStorage ? true : false;
  }


  updateEntry(key, value) {
    if (this.supported) {
      localStorage.setItem(key, value);
    }
  }

  updateJSONEntry(key, value) {
    if (this.supported) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  readEntry(key) {
    if (this.supported && this.hasEntry) {
      return localStorage.getItem(key);
    }
  }

  async readJSONEntry(key): Promise<StoredFields> {
    if (this.supported && this.hasEntry) {
      return JSON.parse(localStorage.getItem(key));
    }
    else {
      return null;
    }
  }

  deleteEntry(key) {
    if (this.supported && this.hasEntry) {
      localStorage.removeItem(key);
    }
  }

  clearStorage() {
    if (this.supported && this.hasEntry) {
      localStorage.clear();
    }
  }
}
