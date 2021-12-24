import { BaseService } from "./BaseService";

export class ConmutadorReciboService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorRecibo/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposImpresionReciboMesAnterior(callback) {
        this.handleResponse("api/conmutadorRecibo/ListarTiposImpresionReciboMesAnterior", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposImpresionReciboMesActual(callback) {
        this.handleResponse("api/conmutadorRecibo/ListarTiposImpresionReciboMesActual", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorRecibo/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorRecibo/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}