import { BaseService } from "./BaseService";

export class UsuarioEdificioService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/usuarioedificio/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/usuarioedificio/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/usuarioedificio/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/usuarioedificio/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/usuarioedificio/Borrar", "post", data, okFunc, errorFunc);
    }
}