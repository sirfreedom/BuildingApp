import { BaseService } from "./BaseService";

export class ABMPersonasService extends BaseService {
  static buscar(id, callback) {
    //console.log("ID: ", id);
    return this.handleResponse(
        "/api/PersonaDepartamento/Buscar?departamentoId=" + id,
      "get",
      null,
      response => response.json().then(data => callback(data))
    );
  }

  static listaDepartamentos(callback) {
    return this.handleResponse(
      "/api/PersonaDepartamento/ListarEstadosPersonaDepartamento",
    "get",
    null,
    response => response.json().then(data =>{ 
      callback(data)})
  );

  }

  static listarTiposPersonas(callback) {
    return this.handleResponse(
      "/api/PersonaDepartamento/ListarTiposPersonas",
    "get",
    null,
    response => response.json().then(data =>{ 
      callback(data)})
  );

  }

  static actualizaPersona(data, okFunc, errorFunc) {
    this.handleResponse("/api/PersonaDepartamento/Modificar", "post", data, okFunc, errorFunc)
  }

  static agregar(data, okFunc, errorFunc) {
    return this.handleResponse("api/PersonaDepartamento/Agregar", "post", data, okFunc, errorFunc);
}


}
