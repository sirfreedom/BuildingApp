import { BaseService } from "./BaseService";

export class PorcentualAutomaticoService extends BaseService {
  

    static listarAutocomplete(callback) {
        this.handleResponse("api/porcentualAutomatico/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarPorEdificio(edificioId, callback) {
        this.handleResponse(`api/porcentualAutomatico/ListarPorEdificio?edificioId=${edificioId}`, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }  

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/porcentualAutomatico/Modificar", "post", data, okFunc, errorFunc);
    }

  
}