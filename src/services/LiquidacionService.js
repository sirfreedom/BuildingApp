import { BaseService } from "./BaseService";

export class LiquidacionService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/liquidacion/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/liquidacion/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/liquidacion/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/liquidacion/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/liquidacion/Borrar", "post", data, okFunc, errorFunc);
    }

    static cerrarLiquidacion(data, okFunc, errorFunc) {
        this.handleResponse("api/liquidacion/CerrarLiquidacion", "post", data, okFunc, errorFunc);
    }
}