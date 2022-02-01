import { BaseService } from "./BaseService";

export class ChequeService extends BaseService {

    static listarCheques(callback) {
        this.handleResponse("api/Cheque/ListarChequesEnCarteraAutoComplete", "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

}