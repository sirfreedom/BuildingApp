import { BaseService } from "./BaseService";

export class ABMBancosService extends BaseService {
    
    //EDIFICIO
    static listarCuentaEdificio(id, callback) {
        this.handleResponse("api/CuentaBancariaEdificio/Listar?edificioId=" + id, "get", null,
            response => response.json().then(data => callback(data)) 
        );
    }
    static agregarCuentaEdificio(data, okFunc, errorFunc) {
        return this.handleResponse("api/CuentaBancariaEdificio/Agregar", "post", data, okFunc, errorFunc);
    }
    static modificarCuentaEdificio(data, okFunc, errorFunc) {
        return this.handleResponse("api/CuentaBancariaEdificio/Modificar", "post", data, okFunc, errorFunc);
    }
    static borrarCuentaEdificio(data, okFunc, errorFunc) {
        return this.handleResponse("api/CuentaBancariaEdificio/Borrar", "post", data, okFunc, errorFunc);
    }

    //ADMINISTRACION
    static listarCuentaAdministracion(callback) {
        this.handleResponse("api/CuentaBancariaAdministracion/Listar", "get", null,
            response => response.json().then(data => callback(data))
        );
    }
    static agregarCuentaAdministrador(data, okFunc, errorFunc) {
        return this.handleResponse("api/CuentaBancariaAdministracion/Agregar", "post", data, okFunc, errorFunc);
    }  
    static modificarCuentaAdministracion(data, okFunc, errorFunc) {
        return this.handleResponse("api/CuentaBancariaAdministracion/Modificar", "post", data, okFunc, errorFunc);
    }
    static borrarCuentaAdministracion(data, okFunc, errorFunc) {
        return this.handleResponse("api/CuentaBancariaAdministracion/Borrar", "post", data, okFunc, errorFunc);
    }
    
    //TIPO DE CUENTA 
    static listarCuentaTipo(callback) {
        this.handleResponse("api/TipoDeCuenta/Listar", "get", null,
            response => response.json().then(data => callback(data))            
        );
    }
}