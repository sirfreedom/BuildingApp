import { BaseService } from "./BaseService";

export class ProveedorService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/proveedor/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarSituacionFiscal(callback) {
        this.handleResponse("api/proveedor/ListarSituacionFiscal", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/proveedor/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/proveedor/ModificarBatch", "post", data, okFunc, errorFunc);
    }    
}