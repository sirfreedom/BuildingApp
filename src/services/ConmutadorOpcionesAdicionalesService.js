import { BaseService } from "./BaseService";

export class ConmutadorOpcionesAdicionalesService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorOpcionesAdicionales/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposOrdenamientoRecibos(callback) {
        this.handleResponse("api/conmutadorOpcionesAdicionales/ListarTiposOrdenamientoRecibos", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorOpcionesAdicionales/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorOpcionesAdicionales/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}