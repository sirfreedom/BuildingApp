import { BaseService } from "./BaseService";

export class RolSeguridadService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/rolSeguridad/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/rolSeguridad/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/rolSeguridad/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/rolSeguridad/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/rolSeguridad/Borrar", "post", data, okFunc, errorFunc);
    }
}