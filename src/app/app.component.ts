// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { Component } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { AuthService } from "./services/AuthService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appareils!: any[];
  secondes!: number;
  counterSubscription!: Subscription;
  isAuth!: boolean;

  constructor(private authService: AuthService) {

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyDNDjlFUYL5mK-pZh_VOV3KtnDiNuo6MuY",
      authDomain: "angular-tp-3b66d.firebaseapp.com",
      databaseURL: "https://angular-tp-3b66d-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "angular-tp-3b66d",
      storageBucket: "angular-tp-3b66d.appspot.com",
      messagingSenderId: "624179324952",
      appId: "1:624179324952:web:c0f7f22204a3543710bb6d"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  ngOnInit() {
    const counter = interval(1000);
    this.counterSubscription = counter.subscribe({
      next: (value) => this.secondes = value,
      error: (error) => console.log('Uh-oh, an error occurred! : ' + error),
      complete: () => console.info('Observable complete!')
    });

    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.counterSubscription.unsubscribe();
  }

  onSignOut() {
    this.authService.signOutUser();
    window.location.reload();
  }
}
