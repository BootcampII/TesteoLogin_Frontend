import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('LoginComponent Test', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const userEmail = 'test@test.com';
  const userPassword = '#Clave1234';
  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('Debería crear un componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería loguear al usuario al usar el método onSubmit', () => {
    // Arrange
    component.email = userEmail;
    component.password = userPassword;
    const mockCorrectResponse = { token: 'mockToken', msg: 'Usuario logueado' };
    authServiceSpy.login.and.returnValue(of(mockCorrectResponse));
    spyOn(Swal, 'fire');

    // Act
    component.login();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith(userEmail, userPassword);
    expect(Swal.fire).toHaveBeenCalledWith(
      'Bienvenido!!',
      'Usuario logueado',
      'success'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/csv-home']);
  });

  it('Debería manejar el error al tener un response.ok en false desde el auth service en el register component', () => {
    // Arrange
    const mockErrorResponse = {
      ok: false,
      error: { msg: 'Error email ya registrado' },
    };
    authServiceSpy.register.and.returnValue(of(mockErrorResponse));
    // Act
    component.login();
    // Assert
    expect(Swal.isVisible()).toBeTrue();
    expect(Swal.getTitle()?.textContent).toBe('Algo salió mal en el backend');
  });

  it('Debería manejar errores inesperados al hacer el llamado de la api (del servicio)', () => {
    // Arrange
    const mockFailResponse = { error: { msg: 'Internal Server Error' } };
    authServiceSpy.register.and.returnValue(throwError(mockFailResponse));
    // Act
    component.login();
    // Assert
    expect(Swal.isVisible()).toBeTrue();
    expect(Swal.getTitle()?.textContent).toBe(
      'Hubo un error al hacer la petición'
    );
  });
});
