import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { ReservationComponent } from './reservation/reservation.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ExpertComponent } from './expert/expert.component';
import { LocationComponent } from './location/location.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'api/users', component: UserComponent },
  { path: 'api/reservations', component: ReservationComponent },
  { path: 'api/login', component: LoginComponent },
  { path: 'api/signup', component: SignupComponent },
  { path: 'api/experts', component: ExpertComponent },
  { path: 'api/locations', component: LocationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
