import { BaseService } from "./BaseService";

export class DireccionService extends BaseService {

    static buscar(id, callback) {
        this.handleResponse("api/direccion/Buscar?id=" + id, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }
    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/direccion/Borrar", "post", data, okFunc, errorFunc);
    }
}