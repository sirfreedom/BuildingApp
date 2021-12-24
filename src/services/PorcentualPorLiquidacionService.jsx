import { BaseService } from "./BaseService";

export class PorcentualPorLiquidacionService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/porcentualPorLiquidacion/Listar", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarAutocomplete(callback) {
        this.handleResponse("api/porcentualPorLiquidacion/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/porcentualPorLiquidacion/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/porcentualPorLiquidacion/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/porcentualPorLiquidacion/Borrar", "post", data, okFunc, errorFunc);
    }
}