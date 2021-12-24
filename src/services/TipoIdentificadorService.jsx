import { BaseService } from "./BaseService";

export class TipoIdentificadorService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/tipoIdentificador/Listar", "get", null, 
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/tipoIdentificador/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/tipoIdentificador/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/tipoIdentificador/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/tipoIdentificador/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/tipoIdentificador/Borrar", "post", data, okFunc, errorFunc);
    }
}