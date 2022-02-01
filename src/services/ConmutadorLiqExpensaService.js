import { BaseService } from "./BaseService";

export class ConmutadorLiqExpensaService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorLiqExpensa/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposTitulosRendicionGasto(callback) {
        this.handleResponse("api/conmutadorLiqExpensa/ListarTiposTitulosRendicionGasto", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposDelayMail(callback) {
        this.handleResponse("api/conmutadorLiqExpensa/ListarTiposDelayMail", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorLiqExpensa/Modificar", "post", data, okFunc, errorFunc);
    }
    
    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorLiqExpensa/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}