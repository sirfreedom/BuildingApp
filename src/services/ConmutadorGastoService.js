import { BaseService } from "./BaseService";

export class ConmutadorGastoService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorGasto/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposMetodoPagoGasto(callback) {
        this.handleResponse("api/conmutadorGasto/ListarTiposMetodoPagoGasto", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposNumeracionGasto(callback) {
        this.handleResponse("api/conmutadorGasto/ListarTiposNumeracionGasto", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorGasto/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorGasto/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}