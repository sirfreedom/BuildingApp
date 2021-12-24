import { BaseService } from "./BaseService";

export class ConmutadorAdministradorService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorAdministrador/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarSituacionFiscal(callback) {
        this.handleResponse("api/conmutadorAdministrador/ListarSituacionFiscal", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorAdministrador/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorAdministrador/ModificarBatch", "post", data, okFunc, errorFunc);
    }
    
}