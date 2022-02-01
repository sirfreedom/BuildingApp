import { BaseService } from "./BaseService";

export class ConmutadorProveedorService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/conmutadorProveedor/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTiposIncluirFacturas(callback) {
        this.handleResponse("api/conmutadorProveedor/ListarTiposIncluirFacturas", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorProveedor/Modificar", "post", data, okFunc, errorFunc);
    }

    static modificarBatch(data, okFunc, errorFunc) {
        this.handleResponse("api/conmutadorProveedor/ModificarBatch", "post", data, okFunc, errorFunc);
    }
}