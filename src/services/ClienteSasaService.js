import { BaseService } from "./BaseService";

export class ClienteSasaService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/clienteSasa/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/clienteSasa/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/clienteSasa/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/clienteSasa/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/clienteSasa/Borrar", "post", data, okFunc, errorFunc);
    }

    static modificarDireccion(clienteSasaId, data, okFunc, errorFunc) {
        this.handleResponse("api/clienteSasa/ModificarDireccion?clienteSasaId=" + clienteSasaId, "post", data, okFunc, errorFunc);
    }
}