import { BaseService } from "./BaseService";

export class ConmutadorPorcentualService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorPorcentual/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorPorcentual/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorPorcentual/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}