import { BaseService } from "./BaseService";

export class AdministracionService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/administracion/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/administracion/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/administracion/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/administracion/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/administracion/Borrar", "post", data, okFunc, errorFunc);
    }

    static modificarDireccion(administracionId, data, okFunc, errorFunc) {
        this.handleResponse("api/administracion/ModificarDireccion?administracionId=" + administracionId, "post", data, okFunc, errorFunc);
    }
}