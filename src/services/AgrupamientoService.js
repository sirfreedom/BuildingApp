import { BaseService } from "./BaseService";

export class AgrupamientoService extends BaseService {
    static listar(edificioId, callback) {
        this.handleResponse(`api/agrupamiento/Listar?edificioId=${edificioId}`, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarMisExpensas(callback) {
        this.handleResponse("api/agrupamiento/ListarMisExpensas", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        return this.handleResponse("api/agrupamiento/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        return this.handleResponse("api/agrupamiento/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        return this.handleResponse("api/agrupamiento/Borrar", "post", data, okFunc, errorFunc);
    }

    static listarBuscadorDropDown(callback) {
        this.handleResponse("api/agrupamiento/ListarBuscadorDropDown", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }
}