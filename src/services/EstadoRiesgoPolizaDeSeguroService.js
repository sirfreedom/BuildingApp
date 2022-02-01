import { BaseService } from "./BaseService";

export class EstadoRiesgoPolizaDeSeguroService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/estadoRiesgoPolizaDeSeguro/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/estadoRiesgoPolizaDeSeguro/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/estadoRiesgoPolizaDeSeguro/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {

        this.handleResponse("api/estadoRiesgoPolizaDeSeguro/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoRiesgoPolizaDeSeguro/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoRiesgoPolizaDeSeguro/Borrar", "post", data, okFunc, errorFunc);
    }
}