import { BaseService } from "./BaseService";

export class ConmutadorMisExpensasService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorMisExpensas/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorMisExpensas/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorMisExpensas/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}