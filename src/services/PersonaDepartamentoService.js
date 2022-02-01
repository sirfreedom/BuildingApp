import { BaseService } from "./BaseService";

export class PersonaDepartamentoService extends BaseService {
    
    static listarPropietarios(edificioId, callback) {
        this.handleResponse("api/personaDepartamento/ListarPropietarios?edificioId=" + edificioId , "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static agregar(data, okFunc, errorFunc) {
        this.handleResponse("api/personaDepartamento/Agregar", "post", data, okFunc, errorFunc);
    }

    static modificar(data, okFunc, errorFunc) {
        this.handleResponse("api/personaDepartamento/Modificar", "post", data, okFunc, errorFunc);
    }

    static borrar(data, okFunc, errorFunc) {
        this.handleResponse("api/personaDepartamento/Borrar", "post", data, okFunc, errorFunc);
    }
}