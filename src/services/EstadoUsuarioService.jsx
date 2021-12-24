import { BaseService } from "./BaseService";

export class EstadoUsuarioService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/estadoUsuario/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/estadoUsuario/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoUsuario/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoUsuario/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoUsuario/Borrar", "post", data, okFunc, errorFunc);
    }
}