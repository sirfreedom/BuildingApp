import { BaseService } from "./BaseService";

export class CobranzaService extends BaseService {

    static listarCobranzasPendientes(edificioId, callback) {
        this.handleResponse("api/cobranza/ListarCobranzasPendientes?edificioId=" + edificioId, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static listarCobranzasPaso2(departamentosIds, callback) {
        this.handleResponse("api/cobranza/ListarCobranzasPaso2", "post", departamentosIds,
            response => response.json()
                .then(data => callback(data))
        );
    }

    //static agregar(data, okFunc, errorFunc) {
    //    this.handleResponse("api/personaDepartamento/Agregar", "post", data, okFunc, errorFunc);
    //}

    //static modificar(data, okFunc, errorFunc) {
    //    this.handleResponse("api/personaDepartamento/Modificar", "post", data, okFunc, errorFunc);
    //}

    //static borrar(data, okFunc, errorFunc) {
    //    this.handleResponse("api/personaDepartamento/Borrar", "post", data, okFunc, errorFunc);
    //}
}