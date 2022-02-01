import { BaseService } from "./BaseService";

export class EstadoProveedorService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/estadoProveedor/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/estadoProveedor/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static buscar(id, callback) {
        this.handleResponse("api/estadoProveedor/Buscar?id=" + id, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {

        this.handleResponse("api/estadoProveedor/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoProveedor/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/estadoProveedor/Borrar", "post", data, okFunc, errorFunc);
    }
}