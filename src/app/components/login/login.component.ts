import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = ''
  password: string = ''

  constructor(private authService: AuthService,
              private router: Router
  ) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        sessionStorage.setItem('token', response.token)
        Swal.fire('Bienvenido!!', response.msg, 'success')
        this.router.navigate(['/csv-home']) 
      },
      error => {
        console.log("error: ", error.error.msg)
        Swal.fire('Ups!!', error.error.msg, 'error')
      }
    )
  }
}
