import { BaseService } from "./BaseService";

export class ConmutadorInteresService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorInteres/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorInteres/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorInteres/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}