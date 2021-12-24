import { BaseService } from "./BaseService";

export class EstadoCuentaService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/estadoCuenta/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/estadoCuenta/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/estadoCuenta/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {

        this.handleResponse("api/estadoCuenta/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoCuenta/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoCuenta/Borrar", "post", data, okFunc, errorFunc);
    }
}