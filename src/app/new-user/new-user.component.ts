import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/User.model';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  errorMessage!: string;
  userForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  /**
   * cette méthode récupère la value du formulaire et crée un nouvel objet User à partir de la valeur des controls du formulaire.
   * Ensuite elle ajoute le nouvel utilisateur au service et navigue vers /users pour en montrer le résultat.
   */
  onSubmitForm() {
    const formValue = this.userForm.value;
    const email = formValue['email'];
    const password = formValue['password'];
    
    this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['/appareils']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
}
    
