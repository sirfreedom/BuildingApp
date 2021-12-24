import { BaseService } from "./BaseService";

export class TipoFormaDePagoService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/TipoFormaDePago/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/TipoFormaDePago/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/TipoFormaDePago/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/TipoFormaDePago/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/TipoFormaDePago/Borrar", "post", data, okFunc, errorFunc);
    }
}