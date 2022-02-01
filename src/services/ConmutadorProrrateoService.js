import { BaseService } from "./BaseService";

export class ConmutadorProrrateoService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorProrrateo/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposAjustesRedondeo(callback) {
        this.handleResponse("api/conmutadorProrrateo/ListarTiposAjustesRedondeo", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposRedondeo(callback) {
        this.handleResponse("api/conmutadorProrrateo/ListarTiposRedondeo", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorProrrateo/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorProrrateo/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}