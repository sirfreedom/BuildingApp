import { BaseService } from "./BaseService";

export class EstadoDepartamentoService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/estadoDepartamento/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/estadoDepartamento/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/estadoDepartamento/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {

        this.handleResponse("api/estadoDepartamento/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoDepartamento/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoDepartamento/Borrar", "post", data, okFunc, errorFunc);
    }
}