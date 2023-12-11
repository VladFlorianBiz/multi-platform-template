//--------------- Core ----------------------------------------------//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// SERVICE THAT CALLS BACKEND USUALLY HAS BASIC OPERATION
// CREATE
// UPDATE
// DELETE
// GET
export class BackendService {
  backendAppBaseUrl = 'http://localhost:3001'

  constructor(
    public http: HttpClient,
  ) { }


  createUser(user) {
    const createBackendUrl = this.backendAppBaseUrl + '/user/create';
    return this.http.post(createBackendUrl, user)
  }

    getAllUsers() {
      return this.http.get(this.backendAppBaseUrl + '/user/get-all')
    }
  
}
