import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = ''
  password: string = ''
  constructor(private authService : AuthService, private router: Router){}

  onSubmit(event: Event) :void {
    this.authService.register(this.email, this.password).subscribe(
      response => {
        if(response.ok) {
          Swal.fire('Usuer Registered!!', response.msg, 'success')
          this.router.navigate(['/login'])
        } else {
          Swal.fire('Algo salió mal en el backend', response.error.msg, 'error')
        }
      },
      error => {
        Swal.fire('Hubo un error al hacer la petición', error.error.msg, 'error')
      }
    )
  }
}
