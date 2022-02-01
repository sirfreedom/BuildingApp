import { BaseService } from "./BaseService";

export class UsuarioService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/usuario/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/usuario/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/usuario/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/usuario/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/usuario/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/usuario/Borrar", "post", data, okFunc, errorFunc);
    }
}