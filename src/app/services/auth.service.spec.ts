import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service"
import { TestBed } from "@angular/core/testing";


describe('AuthService Test',()=>{
    let service : AuthService;
    let httpMock: HttpTestingController;
    const userEmail = 'test@test.com';
    const userpassword = '#Clave1234';
    const token = 'test-token';

    beforeEach( ()=>{
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            providers:[AuthService]
        })
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    })

    afterEach( ()=>{
        httpMock.verify();
    });

    it('Debería hacer una llamada al endpoint /register y devolver el resultado', ()=>{
        // Arrange
        const mockResponse = {ok: true, msg: 'User registered successfully'}
        // Act & Assert
        service.register(userEmail, userpassword).subscribe(
            response =>{
                expect(response).toEqual(mockResponse)
            }
        );

        // Assert segunda parte para los servicios en el front - Realizar el firmado de la petición
        const req = httpMock.expectOne(`${service['apiUrl']}/register`);
    
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({email: userEmail, password: userpassword});
        req.flush(mockResponse);
    })

    it('Debería hacer una llamada al endpoint /login y devolver el resultado', ()=>{
        // Arrange

        const mockResponse = {ok: true, msg: 'Bievenido', token: token  };

        // Act & Assert
        service.login(userEmail, userpassword).subscribe(
            response =>{
                expect(response).toEqual(mockResponse);
            }
        )

        // Assert segunda parte
        const req = httpMock.expectOne(`${service['apiUrl']}/login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({email: userEmail, password: userpassword});
        req.flush(mockResponse);
    })

    it('Debería probar que se obtiene un token', ()=>{
        // Arrange - Preparo el escenario donde tengo el token
        sessionStorage.setItem('token',token);
        // Act - Verifico que la función se comporte como espero (obtenga el token)
        const expectedToken = service.getToken();
        // Assert - Verificar si el token es el token que se ingresó
        expect(expectedToken).toBe(token);
    });

    it('Debería eliminar el token del session storage cuando se llama la función logout', ()=>{
        // Arrange - Preparo el escenario donde tengo el token
        sessionStorage.setItem('token',token);
        // Act - Remuevo el token por medio del metódo que quiero probar
        service.logout();
        // Assert - Comparar que el storage este vacio
        expect(sessionStorage.getItem('token')).toBeNull();
    })

    it('Debería tener un token en el local storage luego de haber llamado a login', ()=>{
        // Arrange - Preparo el escenario para tener el token
        sessionStorage.setItem('token',token);
        // Act - Verificar por medio del método a probar que si existe un token
        const booleanResult = service.isLoggedIn();
        // Assert - Verificar que SI se tenga el token porque asi va a estar logeado
        expect(booleanResult).toBeTruthy();
        // expect(booleanResult).toBe(true);
    })
})