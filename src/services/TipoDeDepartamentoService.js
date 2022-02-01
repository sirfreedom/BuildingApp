import { BaseService } from "./BaseService";

export class TipoDeDepartamentoService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/tipoDeDepartamento/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/tipoDeDepartamento/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/tipoDeDepartamento/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/tipoDeDepartamento/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/tipoDeDepartamento/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/tipoDeDepartamento/Borrar", "post", data, okFunc, errorFunc);
    }
}