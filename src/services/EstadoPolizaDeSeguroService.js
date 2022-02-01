import { BaseService } from "./BaseService";

export class EstadoPolizaDeSeguroService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/estadoPolizaDeSeguro/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/estadoPolizaDeSeguro/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/estadoPolizaDeSeguro/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {

        this.handleResponse("api/estadoPolizaDeSeguro/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoPolizaDeSeguro/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoPolizaDeSeguro/Borrar", "post", data, okFunc, errorFunc);
    }
}