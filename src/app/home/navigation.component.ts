import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { CouchService } from '../shared/couchdb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'planet-navigation',
  template: `
    <ul>
      <li *ngFor="let comp of components"><a [routerLink]="'/' + comp.link">{{comp.name.toUpperCase()}}</a></li>
      <li><a href="#" class="km-logout" (click)="logoutClick()">LOGOUT</a></li>
      <li><a routerLink="/manager"><i class="material-icons">settings</i></a></li>
      <li *ngIf="roles.indexOf('_admin') === -1"><a routerLink="/users/profile/{{name}}"><mat-icon>person</mat-icon></a></li>
      <li><mat-icon [matMenuTriggerFor]="notification" id="notification">notifications</mat-icon></li>
    </ul>
    <mat-menu #notification="matMenu">
      <div mat-menu-item> Notification 1 </div>
      <mat-divider></mat-divider>
      <div mat-menu-item> Notification 2 </div>
      <mat-divider></mat-divider>
      <div mat-menu-item> Notification 3 </div>
    </mat-menu>
  `,
  styleUrls: [ './navigation.scss' ]
})
export class NavigationComponent implements OnInit {
  name = '';
  roles: string[] = [];
  constructor(
    private couchService: CouchService,
    private router: Router,
    private userService: UserService
  ) {}

  components = [
    { link: '', name: 'Home' },
    { link: 'resources', name: 'Library' },
    { link: 'courses', name: 'Courses' },
    { link: 'meetups', name: 'Meetups' },
    { link: 'users', name: 'Members' },
    { link: '', name: 'Reports' },
    { link: 'feedback', name: 'Feedback' },
  ];

  logoutClick() {
    this.couchService.delete('_session', { withCredentials: true }).subscribe((data: any) => {
      if (data.ok === true) {
        this.router.navigate([ '/login' ], {});
      }
    });
  }

  ngOnInit() {
    Object.assign(this, this.userService.get());
  }

}
