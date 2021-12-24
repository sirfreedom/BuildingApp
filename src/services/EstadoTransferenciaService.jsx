import { BaseService } from "./BaseService";

export class EstadoTransferenciaService extends BaseService {
    static listarAutocomplete(callback) {
        this.handleResponse("api/estadoTransferencia/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listar(callback) {
        this.handleResponse("api/estadoTransferencia/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/estadoTransferencia/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoTransferencia/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoTransferencia/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoTransferencia/Borrar", "post", data, okFunc, errorFunc);
    }
}