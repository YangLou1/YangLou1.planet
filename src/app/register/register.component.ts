import { Component, OnInit } from '@angular/core';
import { CouchService } from '../shared/couchdb.service';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators, FormControlName } from '@angular/forms';
import { MatRadioModule , MatFormFieldModule, MatButtonModule, MatInputModule } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  educationLevel: Array<any>= [ 1, 2, 3, 4, 5, 6 , 7, 8, 9, 11, 12, 'Higher' ];
  RegistrationMsg: String;

  constructor(
    private couchService: CouchService,
    private fg: FormBuilder
    ) {
    this.createform();
  }

  ngOnInit() {
  }
  registerUser(userInfo: any ) {
    this.RegistrationMsg = '';
    if (userInfo.password === userInfo.repeatPassword) {
      this.RegistrationMsg = '';
      this.checkAdminExistence().then((noAdmin) => {
        if (noAdmin) {
          console.log('admin');
          this.createAdmin(userInfo);
        } else {
          console.log('not admin');
          this.createrecord(userInfo);
        }
      });
    }else {
      this.RegistrationMsg = 'Passwords do not Match!';
    }
  }

  createrecord(userData: any) {
    const username: string = userData.login;
    const password: string = userData.password;
    this.couchService.put('_users/org.couchdb.user:' + name, { 'name': username, 'password': password, 'userData': userData, 'roles': [], 'type': 'user' })
    .then((data) => {
      this.RegistrationMsg = 'Your registration is successful';
    }, (error) => {
      this.RegistrationMsg = 'Sorry, something went wrong';
    });
  }

  checkAdminExistence() {
    return this.couchService.get('_users/_all_docs')
    .then((data) => {
    return true; // user can see data so there is no admin
  }, (error) => {
    return false; // user doesn't have permission so there is an admin
  });
  }

  createAdmin(userData) {
    this.couchService.put('_node/nonode@nohost/_config/admins/' + userData.login, userData.password).then((data) => {
      this.RegistrationMsg = 'Your registration is successful';
    }, (error) => {
      this.RegistrationMsg = 'Sorry, something went wrong';
    });
  }

  createform() {
    this.registerForm = this.fg.group({
      firstName: [ '', Validators.required ],
      middleName: [ '', Validators.required ],
      lastName: [ '', Validators.required ],
      login: [ '', Validators.required ],
      email: [ '', Validators.required ],
      password: [ '', Validators.required ],
      repeatPassword: [ '', Validators.required ],
      language: [ '', Validators.required ],
      phoneNumber: [ '', Validators.required ],
      birthDay: [ '', Validators.required ],
      gender: [ '', Validators.required ],
      level: [ '', Validators.required ],
      community: [ '', Validators.required ],
      region: [ '', Validators.required ],
      nation: [ '', Validators.required ],

    });
  }
}
