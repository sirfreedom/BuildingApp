import { BaseService } from "./BaseService";

export class EdificioService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/edificio/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/edificio/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/edificio/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/edificio/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/edificio/Borrar", "post", data, okFunc, errorFunc);
    }

    static modificarDireccion(edificioId, data, okFunc, errorFunc) {
        this.handleResponse("api/edificio/ModificarDireccion?edificioId=" + edificioId, "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/edificio/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}