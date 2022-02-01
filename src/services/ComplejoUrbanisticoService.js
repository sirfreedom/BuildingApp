import { BaseService } from "./BaseService";

export class ComplejoUrbanisticoService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/complejoUrbanistico/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/complejoUrbanistico/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/complejoUrbanistico/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/complejoUrbanistico/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/complejoUrbanistico/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/complejoUrbanistico/Borrar", "post", data, okFunc, errorFunc);
    }
}