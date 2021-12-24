import { BaseService } from "./BaseService";

export class DepartamentoService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/departamento/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/departamento/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/departamento/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/departamento/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/departamento/Borrar", "post", data, okFunc, errorFunc);
    }
}