import { BaseService } from "./BaseService";

export class EstadoAdministracionService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/EstadoAdministracion/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/EstadoAdministracion/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/EstadoAdministracion/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/EstadoAdministracion/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/EstadoAdministracion/Borrar", "post", data, okFunc, errorFunc);
    }
}