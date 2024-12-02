import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CsvHomeComponent } from './protected/csv-home/csv-home.component';
import { AuthGuard } from './components/register/guards/auth.guard';

export const routes: Routes = [
    { path: '', title: `Home`, component: HomeComponent  },
    { path: 'register', title: `Register`, component: RegisterComponent  },
    { path: 'login', title: `Login`, component: LoginComponent  },
    { path: 'csv-home', title: 'CSV Home', component: CsvHomeComponent, canActivate: [AuthGuard] }
];
