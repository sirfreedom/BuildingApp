import { BaseService } from "./BaseService";

export class CuentaBancariaService extends BaseService {
    static listar(callback) {
        this.handleResponse("api/CuentaBancariaEdificio/ListarAutocomplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }
}