import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}


  getUser(userKey){
    return this.db.collection('users').doc(userKey).valueChanges();
  }

  updateUser(userKey, value){
    value.nameToSearch = value.name.toLowerCase();
    return this.db.collection('users').doc(userKey).set(value);
  }

  deleteUser(userKey){
    return this.db.collection('users').doc(userKey).delete();
  }

  getUsers(){
    return this.db.collection('users').snapshotChanges();
  }

  searchUsersByName(searchValue: string) {
    return this.db.collection('users', ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges();
  }

  searchUsersByLocation(searchValue: string) {
    return this.db.collection('users', ref => ref.where('locationToSearch', '>=', searchValue)
      .where('locationToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges();
  }
  searchUsersByAge(value){
    return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }


  createUser(value){
    return this.db.collection('users').add({
      name: value.name,
      nameToSearch: value.name.toLowerCase(),
      locationToSearch: value.location.toLowerCase(),
      surname: value.surname,
      location: value.location,
    });
  }
  deleteOrder(orderId: string, id): Promise<void> {
    return this.db.collection('users').doc(id).collection('orders').doc(orderId).delete();
  }
}
