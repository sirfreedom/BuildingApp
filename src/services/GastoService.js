import { BaseService } from "./BaseService";

export class GastoService extends BaseService {
    static listarFormasDePagoGasto(callback) {
        return this.handleResponse("api/gasto/ListarFormasDePagoGasto", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }
}