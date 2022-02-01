import { BaseService } from "./BaseService";

export class PreCargaGastoService extends BaseService {
    static async listar(callback) {
        this.handleResponse("api/precargagasto/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static obtenerGastosImportes(callback, data) {
        this.handleResponse("api/precargagasto/obtenerGastosImportes?preCargaGastoId=" + data, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarTextosPregrabados(callback, edificioId) {
        this.handleResponse("api/precargagasto/ListarTextosPregrabados?edificioId=" + edificioId, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/precargagasto/Agregar", "post", data, okFunc, errorFunc);
    }

    static listoParaEnviarAda4(data, okFunc, errorFunc) {
        this.handleResponse("api/precargagasto/ListoParaEnviarAda4", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/precargagasto/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/precargagasto/Borrar", "post", data, okFunc, errorFunc);
    }

    static async listarAgrupamientos(callback) {
        return this.handleResponse("api/precargagasto/ListarAgrupamientos", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static async listarTiposDePagosPorEdificio(callback) {
        return this.handleResponse("api/precargagasto/ListarTiposDePagosPorEdificio", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static async listarProveedores(callback) {
        return this.handleResponse("api/precargagasto/ListarProveedores", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static async listarTiposDePagos(callback) {
        return this.handleResponse("api/precargagasto/ListarTiposDePagos", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }
}