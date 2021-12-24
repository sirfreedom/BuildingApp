import { BaseService } from "./BaseService";

export class ConmutadorIntimacionPagoService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorIntimacionPago/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorIntimacionPago/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorIntimacionPago/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}