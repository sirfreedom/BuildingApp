import React, { Component } from "react";
import { Button } from "devextreme-react/button";
import { Popup } from "devextreme-react/popup";
import { ScrollView } from "devextreme-react/scroll-view";
import TextField from "@material-ui/core/TextField";
import {
  Column,
  ColumnChooser,
  CustomRule,
  Editing,
  Export,
  Form,
  GroupPanel,
  Lookup,
  Paging,
  RequiredRule,
  StringLengthRule,
  SearchPanel,
  Popup as PopupGrid,
} from "devextreme-react/data-grid";
import dxCheckBox from "devextreme/ui/check_box";
import { SelectBox } from "devextreme-react/select-box";
import { Item } from "devextreme-react/form";
import ADAGrid from "../Grid/ADAGrid";

import { ABMPersonasService } from "../../services/ABMPersonas";
import { Notifier } from "../Grid/Notifier";
import {
  Card,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { TipoIdentificadorService } from "../../services/TipoIdentificadorService";
import ValidacionEmail from "../../utils/ValidacionEmail";
import { DireccionIndex } from "../Direccion/DireccionIndex";
import { CheckBox } from "devextreme-react";
import { confirm } from 'devextreme/ui/dialog';
import $ from 'jquery';
// import { Size } from "devextreme-react/bar-gauge";

export class ABMPersonasIndex extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      today: new Date(),
      buttonSubmit: false,
      tipoPersonaId: 1,
      tipoIdentPersonaAsociadaId: 1,
      tipoIdentificadorId: 1,
      popupVisible: true,
      setData: false,
      selectTextOnEditStart: true,
      startEditAction: "click",
      nombre: this.props.nuevo === true ? true : false,
      validationMail: true,
      inputInvalido: false,
      inputInvalidoAso: false,
      filaTel: {},
      filaMail: {},
      direAso: {
        direccionId: 0,
        calle: "",
        numero: "",
        piso: "",
        departamento: "",
        codigoPostal: "",
        lat: "",
        long: "",
        pais: "",
        provincia: "",
        localidad: "",
        direccionFormateada: "",
        direccionApiGoogle: "",
      },
      nuevoAso: false,
      data: {
        departamentoId: this.props.departamentoId || 0,
        edificioId: this.props.edificioId || 0,
        unidad: this.props.unidad || 0,
        codDepartamento: this.props.codDepartamento || 0,
        piso: this.props.piso || 0,
        titulo: this.props.titulo || "Nuevo título",
        subTitulo: this.props.subtitulo || "Nuevo subtítulo",
        nuevo: this.props.nuevo || false,
      },

      listTipo: [],
      listTipoAux: [],
      listEstados: [],
      listTipoPersonas: [
        {
          tipoPersonaId: "",
          descripcion: "",
        },
      ],

      dataDepartamento: {
        personaDepartamentoId: 0,
        personaId: 0,
        departamentoId: this.props.departamentoId || 0,
        tipoPersonaId: 1,
        liqPorMail: true,
        observaciones: "",
        nombre: "",
        apellido: "",
        cbu: 0,
        tipoIdentificadorId: 1,
        identificador: 0,
        extranjero: false,
        estadoPersonaDepartamentoId: 0,
        propietarios: [
          {
            personaDepartamentoId: 0,
            unidad: this.props.unidad,
            codDepartamento: this.props.codDepartamento,
            piso: this.props.piso,
            liqPorMail: true,
            observaciones: "",
            estadoPersonaDepartamentoId: 0,
          },
        ],

        personasAsociadas: [],
        telefonos: [],
        mails: [],
        direccion: {
          direccionId: 0,
          calle: "",
          numero: "",
          piso: "",
          departamento: "",
          codigoPostal: "",
          lat: "",
          long: "",
          pais: "",
          provincia: "",
          localidad: "",
          direccionFormateada: "",
          direccionApiGoogle: "",
        },
      },

      telAso: [],
      mailAso: [],
      mostrarPopupDireccion: false,
      idPersonaAsociadaEditando: 0,
      idDireccion: 0,

      nuevaDireccionAso: false,
    };

    this.resuelveEstado = this.resuelveEstado.bind(this);
    this.cargaInicial = this.cargaInicial.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.storeTelefono = this.storeTelefono.bind(this);
    this.storeMails = this.storeMails.bind(this);
    //this.onSavingDataTelefono = this.onSavingDataTelefono.bind(this);
    this.onSavingDataPropietarioDe = this.onSavingDataPropietarioDe.bind(this);
    this.resuelveTel = this.resuelveTel.bind(this);
    this.resuelveMail = this.resuelveMail.bind(this);
    this.formSave = this.formSave.bind(this);
    this.doneClick = this.doneClick.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
    this.closePopupDireccion = this.closePopupDireccion.bind(this);
    this.confirmarDireccion = this.confirmarDireccion.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.refrescar = this.refrescar.bind(this);
    this.saveChangeIdentificador = this.saveChangeIdentificador.bind(this);
    this.resuelveIdentificadorPersona =
      this.resuelveIdentificadorPersona.bind(this);
    this.resuelveDireccion = this.resuelveDireccion.bind(this);
    this.confirmarDireccionAso = this.confirmarDireccionAso.bind(this);
    this.obtenerPersonaEditando = this.obtenerPersonaEditando.bind(this);
    this.doneAddClick = this.doneAddClick.bind(this);
    //this.notificarInputInvalido = this.notificarInputInvalido.bind(this);
    this.onEditingStartForm = this.onEditingStartForm.bind(this);
    this.onInitNewRowPersonaAsociada =
      this.onInitNewRowPersonaAsociada.bind(this);
    this.onEditDataMail = this.onEditDataMail.bind(this);
    this.onInitNewRowMail = this.onInitNewRowMail.bind(this);
    this.onInitNewRowTelAso = this.onInitNewRowTelAso.bind(this);
    this.resuelveUF = this.resuelveUF.bind(this);
    this.onContextMenuItems = this.onContextMenuItems.bind(this);
    this.onEditCanceled = this.onEditCanceled.bind(this);
    //this.onSavingMail = this.onSavingMail.bind(this);
    this.onSavingTelAso = this.onSavingTelAso.bind(this);
    this.onEditorPrepared = this.onEditorPrepared.bind(this);
    this.onPhoneNumberRowRemoving = this.onPhoneNumberRowRemoving.bind(this);
    this.onEmailRowRemoving = this.onEmailRowRemoving.bind(this);

    this.cargaInicial(this.state.data.departamentoId);
  }

  cargaInicial(id) {
    let promises = [];
    if (this.props.nuevo === true) {
      let listEstados;
      let listTipo;
      let listTipoPersonas;

      promises.push(
        ABMPersonasService.listaDepartamentos((data) => {
          listEstados = data;
        })
      );

      promises.push(
        TipoIdentificadorService.listarAutocomplete((data) => {
          listTipo = data;
        })
      );

      promises.push(
        ABMPersonasService.listarTiposPersonas((data) => {
          listTipoPersonas = data;
        })
      );

      Promise.all(promises).then(() => {
        if (promises !== null && promises !== undefined && promises !== "") {
          return this.setState({
            listEstados,
            listTipo,
            listTipoPersonas,
            setData: true,
          });
        } else {
          return this.setState({
            listEstados,
            listTipo,
            listTipoPersonas,
            setData: false,
          });
        }
      });
    } else {
      let dataDepartamento;
      let listEstados;
      let listTipo;
      let listTipoPersonas;

      promises.push(
        ABMPersonasService.buscar(id, (data) => {
          dataDepartamento = data;
        })
      );

      promises.push(
        ABMPersonasService.listaDepartamentos((data) => {
          listEstados = data;
        })
      );

      promises.push(
        TipoIdentificadorService.listarAutocomplete((data) => {
          listTipo = data;
        })
      );

      promises.push(
        ABMPersonasService.listarTiposPersonas((data) => {
          listTipoPersonas = data;
        })
      );

      if (this.state.dataDepartamento.nombre === "") {
        promises.push(
          ABMPersonasService.buscar(id, (data) => {
            this.setState({ dataDepartamento: data });
          })
        );
      }

      Promise.all(promises).then(() => {
        if (promises !== null && promises !== undefined && promises !== "") {
          return this.setState({
            dataDepartamento,
            listEstados,
            listTipo,
            listTipoPersonas,
            setData: true,
          });
        } else {
          return this.setState({
            dataDepartamento,
            listEstados,
            listTipo,
            listTipoPersonas,
            setData: false,
          });
        }
      });
    }
  }

  closePopup() {
    this.setState({ popupVisible: false });
  }

  resuelveEstado(e) {
    if (
      e.estadoPersonaDepartamentoId !== undefined &&
      e.estadoPersonaDepartamentoId !== ""
    ) {
      return this.state.listEstados[
        parseInt(e.estadoPersonaDepartamentoId) - 1
      ].descripcion.toString();
    } else {
    }
  }

  resuelveCel(e) {
    const telefonoCelular = (telefono) => telefono.telefonoCelular;
    return (
      e.telefonos?.filter(telefonoCelular).map(telefonoCelular).join(", ") || ""
    );
  }

  resuelveTel(e) {
    const numeroLocal = (telefono) => telefono.numeroLocal;
    return e.telefonos?.filter(numeroLocal).map(numeroLocal).join(", ") || "";
  }
  resuelveMail(e) {
    if (e.mails === undefined) {
      return;
    } else {
      if (e.mails[0] !== undefined) {
        return e.mails[0].mail;
      } else {
        return "";
      }
    }
  }

  resuelveIdentificadorPersona(e) {
    if (e === this.state.dataDepartamento.personasAsociadas.tipoPersonaId) {
      return true;
    } else {
      return false;
    }
  }

  resueveDireccion(e) {
    if (e.hasOwnProperty("direccion")) {
      return e.direccion?.direccionApiGoogle;
    } else {
      return "";
    }
  }

  onSelectTextOnEditStartChanged(args) {
    this.setState({
      selectTextOnEditStart: args.value,
    });
  }
  onStartEditActionChanged(args) {
    this.setState({
      startEditAction: args.value,
    });
  }

  onChangeEmail = (e) => {
    let email = e.value;
    let bool = ValidacionEmail(email);

    if (bool === false) {
      Notifier.mostrarNotificacion(
        "Mail incorrecto, por favor revise " /*resp.Message*/,
        "error",
        3000
      );
    }
    this.setState({ validationMail: bool });

    return bool;
  };

  onChangeEmailAso = (e) => {
    let email = e.value;
    let bool = ValidacionEmail(email);
    if (bool === false) {
      Notifier.mostrarNotificacion(
        "Mail incorrecto en Persona Asociada, el mail no se ha guardado " /*resp.Message*/,
        "error",
        3000
      );
    }
    return bool;
  };

  handleChange(e) {
    const { name, value } = e.target;
    if (value !== "" && value !== " ") {
      let data = { ...this.state.dataDepartamento, ...{ [name]: value } };
      this.setState({ dataDepartamento: data });
      if (this.state.dataDepartamento.nombre !== "") {
        this.setState({ inputInvalido: false, [name]: false });
      } else {
        this.setState({ [name]: false });
      }
    } else {
      this.setState({ [name]: true });
      if (this.state.inputInvalido === false) {
        this.setState({ inputInvalido: true });
      }
    }
  }

  onValueChanged(args) {
    let data = {
      ...this.state.dataDepartamento,
      ...{ extranjero: args.value },
    };
    this.setState({
      dataDepartamento: data,
    });
  }

  saveChangeIdentificador(e) {
    let filtrado = this.state.listTipo.find((tipo) => tipo.id === e.value);
    if (filtrado !== undefined) {
      let data = {
        ...this.state.dataDepartamento,
        ...{ tipoIdentificadorId: filtrado.id },
      };
      this.setState({
        dataDepartamento: data,
      });
    }
  }

  formSave(e) {
    this.setState({ inputInvalidoAso: false });
    e.changes.forEach((change) => {
      if (change.data.hasOwnProperty("nombre")) {
        if (
          change.data.nombre === null ||
          change.data.nombre === undefined ||
          change.data.nombre === ""
        ) {
          return this.notificarInputInvalidoAso("Nombre");
        }
      }

      if (this.state.inputInvalidoAso !== true) {
        this.onSavingDataPersonaAsociadaData(e);
      }
    });
  }

  doneClick() {
    let allGoodTel = true;
    let allGoodMail = true;
    document.getElementsByClassName("card")[0].click();
    this.state.dataDepartamento.telefonos.map((t) => {
      if (t.hasOwnProperty("telefonoPersonaId") === true) {
        if (
          (t.telefonoCelular === "" || t.telefonoCelular === null) &&
          (t.numeroLocal === "" || t.numeroLocal === null)
        ) {
          Notifier.mostrarNotificacion(
            "Uno o más teléfonos son erróneos o vacíos, revise sus datos " /*resp.Message*/,
            "error",
            3000
          );
          allGoodTel = false;
          return t;
        } else {
          return t;
        }
      } else {
        if (
          t.hasOwnProperty("telefonoCelular") ||
          t.hasOwnProperty("numeroLocal")
        ) {
          if (
            (t.telefonoCelular === "" || t.telefonoCelular === null) &&
            (t.numeroLocal === "" || t.numeroLocal === null)
          ) {
            Notifier.mostrarNotificacion(
              "Uno o más teléfonos son erróneos o vacíos, revise sus datos " /*resp.Message*/,
              "error",
              3000
            );
            allGoodTel = false;
            return t;
          } else {
            return t;
          }
        } else {
          allGoodTel = false;
          Notifier.mostrarNotificacion(
            "Uno o más teléfonos son erróneos o vacíos, revise sus datos " /*resp.Message*/,
            "error",
            3000
          );
          return t;
        }
      }
    });

    this.state.dataDepartamento.mails.map((m) => {
      if (m.hasOwnProperty("mailPersonaId") === true) {
        if (m.mail === "" || m.telefonoCelular === null) {
          Notifier.mostrarNotificacion(
            "Uno o más correos son erróneos o vacíos, revise sus datos " /*resp.Message*/,
            "error",
            3000
          );

          allGoodMail = false;
          return m;
        } else {
          return m;
        }
      } else {
        Notifier.mostrarNotificacion(
          "Uno o más mails son erróneos o vacíos, revise sus datos " /*resp.Message*/,
          "error",
          3000
        );
        allGoodMail = false;
        return m;
      }
    });

    if (allGoodMail === true && allGoodTel === true) {
      if (
        this.state.inputInvalido !== true &&
        this.state.inputInvalidoAso !== true &&
        this.state.validationMail !== false
      ) {
        if (this.state.data.nuevo !== true) {
          let data = this.state.dataDepartamento;
          this.setState({ buttonSubmit: true });
          ABMPersonasService.actualizaPersona(
            data,
            (resp) => {
              Notifier.mostrarNotificacion(
                "Operación exitosa",
                "success",
                3000
              );
              ABMPersonasService.buscar(
                this.state.dataDepartamento.departamentoId,
                (data) => {
                  this.setState({
                    dataDepartamento: data,
                    popupVisible: false,
                    buttonSubmit: false,
                  });
                }
              );
            },
            (error) => {
              this.setState({ buttonSubmit: false });
              Notifier.mostrarNotificacion(
                "Ocurrión un error al almacenar los datos, por favor inténtelo nuevamente " /*resp.Message*/,
                "error",
                3000
              );
            }
          );
        } else {
          this.doneAddClick();
          return;
        }
      } else {
        if (this.state.validationMail === false) {
          Notifier.mostrarNotificacion(
            "Error: mail incorrecto, por favor revise",
            "error",
            3000
          );
        } else {
          Notifier.mostrarNotificacion(
            "Error: revise sus datos, recuerde que Nombre no puede ser vacío ",
            "error",
            3000
          );
        }
      }
    } else {
      if (allGoodMail !== true) {
        Notifier.mostrarNotificacion(
          "Error: revise su información en mails ",
          "error",
          3000
        );
      } else {
        Notifier.mostrarNotificacion(
          "Error: revise su información en teléfonos ",
          "error",
          3000
        );
      }
    }
  }

  doneAddClick() {
    this.setState({ buttonSubmit: true });
    if (
      this.state.inputInvalido !== true &&
      this.state.inputInvalidoAso !== true &&
      this.state.validationMail !== false
    ) {
      let data = this.state.dataDepartamento;
      ABMPersonasService.agregar(
        data,
        (resp) => {
          Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
          ABMPersonasService.buscar(
            this.state.dataDepartamento.departamentoId,
            (data) => {
              this.setState({
                dataDepartamento: data,
                popupVisible: false,
                buttonSubmit: false,
              });
            }
          );
        },
        (resp) => {
          Notifier.mostrarNotificacion(
            "Ocurrión un error al almacenar los datos, por favor inténtelo nuevamente " /*resp.Message*/,
            "error",
            3000
          );
        }
      );

      let newData = { ...this.state.data, nuevo: false };
      this.setState({ data: newData });
    } else {
      if (this.state.validationMail === false) {
        Notifier.mostrarNotificacion(
          "Error: mail incorrecto en Propietario Principal o Personas Asociadas",
          "error",
          3000
        );
        this.setState({ buttonSubmit: false });
      } else {
        Notifier.mostrarNotificacion(
          "Error: revise sus datos, recuerde que Nombre no puede ser vacío ",
          "error",
          3000
        );
        this.setState({ buttonSubmit: false });
      }
    }
  }

  refrescar() {
    ABMPersonasService.buscar(this.state.data.departamentoId, (data) => {
      this.setState({ dataDepartamento: data, mostrarPopupDireccion: false });
    });
  }

  closePopupDireccion() {
    this.setState({
      mostrarPopupDireccion: false,
    });
  }

  confirmarDireccion(dataDir) {
    let data = { ...this.state.dataDepartamento, direccion: dataDir };
    this.setState({ dataDepartamento: data, mostrarPopupDireccion: false });
  }

  confirmarDireccionAso(dataDir) {
    /*Busca la persona asociada y almacena la nueva dirección */
    if (this.state.idPersonaAsociadaEditando === 0) {
      this.setState({
        direAso: dataDir,
        nuevoAso: true,
        idPersonaAsociadaEditando: 0,
        mostrarPopupDireccion: false,
      });
    } else {
      this.state.dataDepartamento.personasAsociadas.map((per) => {
        if (per.personaId === this.state.idPersonaAsociadaEditando) {
          if (per.direccion == null) {
            per.direccion = dataDir;
          } else {
            per.direccion.calle = dataDir.calle;
            per.direccion.codigoPostal = dataDir.codigoPostal;
            per.direccion.departamento = dataDir.departamento;
            per.direccion.direccionApiGoogle = dataDir?.direccionApiGoogle;
            per.direccion.direccionFormateada = dataDir.direccionFormateada;
            per.direccion.lat = dataDir.lat;
            per.direccion.long = dataDir.long;
            per.direccion.localidad = dataDir.localidad;
            per.direccion.numero = dataDir.numero;
            per.direccion.pais = dataDir.pais;
            per.direccion.piso = dataDir.piso;
            per.direccion.provincia = dataDir.provincia;
            this.setState({
              direAso: per.direccion,
              mostrarPopupDireccion: false,
            });
          }
          return per;
        } else {
          return per;
        }
      });
    }
  }

  borrarDireccion() {
    Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
    this.refrescar();
  }

  handleClick = () => {
    this.setState({ mostrarPopupDireccion: true });
  };

  obtenerPersonaEditando(e) {
    if (e.hasOwnProperty("direccion")) {
      if (e.direccion === null || e.direccion?.direccionApiGoogle === "") {
        this.state.dataDepartamento.personasAsociadas.map((per) => {
          if (per.personaId === e.personaId) {
            per.direccion = {
              direccionId: 0,
              calle: "",
              numero: "",
              piso: "",
              departamento: "",
              codigoPostal: "",
              lat: "",
              long: "",
              pais: "",
              provincia: "",
              localidad: "",
              direccionFormateada: "",
              direccionApiGoogle: "",
            };
            this.setState({
              nuevaDireccionAso: true,
              idPersonaAsociadaEditando: e.personaId,
            });
            return "";
          }
          return "";
        });
      } else {
        if (e.personaId === undefined) {
          this.setState({
            nuevaDireccionAso: true,
            idPersonaAsociadaEditando: 0,
            idDireccion: 0,
          });
        } else {
          this.setState({
            nuevaDireccionAso: false,
            idPersonaAsociadaEditando: e.personaId,
            idDireccion: e.direccion.direccionId,
          });
        }
      }
    } else {
      if (e.personaId === undefined) {
        this.setState({
          nuevaDireccionAso: true,
          idPersonaAsociadaEditando: 0,
          idDireccion: 0,
        });
      }
    }
  }

  resuelveDireccion(e) {
    if (e.hasOwnProperty("direccion")) {
      if ((e !== undefined) & (e.direccion !== null)) {
        let dire = e.direccion.direccionApiGoogle
          ? e.direccion.direccionApiGoogle !== " , , , , "
            ? e.direccion.direccionApiGoogle
            : ""
          : "";
        return dire;
      } else {
        return "";
      }
    } else {
      return this.state.direAso?.direccionApiGoogle;
    }
  }
  /* notificarInputInvalido(e) {
    Notifier.mostrarNotificacion(
      "ERROR, el dato " + e + " es vacío o hay un error en él",
      "error",
      3000
    );
  }*/

  notificarInputInvalidoAso(e) {
    Notifier.mostrarNotificacion(
      "ERROR, el dato " + e + " es vacío o hay un error en él",
      "error",
      3000
    );
    this.setState({ inputInvalidoAso: true });
    return;
  }

  resuelveUF(e) {
    if (
      e.unidad !== undefined &&
      e.codDepartamento !== undefined &&
      e.piso !== undefined
    ) {
      return `${e.unidad
        .toString()
        .padStart(4, "0")} ${e.codDepartamento
        .toString()
        .padStart(4, "0")} ${e.piso.toString().padStart(4, "0")}`;
    } else {
      return "0000 0000 0000";
    }
  }

  onEditorPrepared(e) {
    if (e.caption === "Liq. Por mail" && e.row.isNewRow !== undefined) {
      let selectBoxConciliado = dxCheckBox.getInstance(e.editorElement);
      selectBoxConciliado.option("value", true);
    }
    if (e.caption === "Extranjero" && e.row.isNewRow !== undefined) {
      let selectBoxHabilitado = dxCheckBox.getInstance(e.editorElement);
      selectBoxHabilitado.option("value", false);
    }
  }

  /******/
  onSavingTelAso(e) {
    e.changes.forEach((change) => {
      switch (change.type) {
        case "insert":
          if (
            change.data.hasOwnProperty("telefonoCelular") !== false ||
            change.data.hasOwnProperty("numeroLocal") !== false
          ) {
            this.state.telAso.concat([
              {
                telefonoPersonaId: 0,
                numeroLocal: change.data.numeroLocal ?? "",
                telefonoCelular: change.data.telefonoCelular ?? "",
                observaciones: change.data.observaciones ?? "",
              },
            ]);

            let data = {
              ...this.state.dataDepartamento,
              ...{ telefonos: this.state.telAso },
            };
            this.setState({
              dataDepartamento: data,
            });
          } else {
            e.cancel = true;
            Notifier.mostrarNotificacion(
              "Error: Todos los datos telefónicos ingresados son vacíos",
              "error",
              3000
            );
          }
          break;
        case "update":
          if (
            change.data.hasOwnProperty("telefonoCelular") !== false &&
            change.data.telefonoCelular !== ""
          ) {
            this.state.telAso.map((tel) => {
              if (tel.telefonoPersonaId !== change.key.telefonoPersonaId) {
                return tel;
              } else {
                tel.numeroLocal =
                  change.data.numeroLocal ?? change.key.numeroLocal;
                tel.telefonoCelular =
                  change.data.telefonoCelular ?? change.key.telefonoCelular;
                tel.observaciones =
                  change.data.observaciones ?? change.key.observaciones;
                return tel;
              }
            });
            let data2 = {
              ...this.state.dataDepartamento,
              ...{ telefonos: this.state.telAso },
            };
            this.setState({
              dataDepartamento: data2,
            });
          } else {
            if (
              change.data.hasOwnProperty("numeroLocal") !== false &&
              change.data.numeroLocal !== ""
            ) {
              this.state.telAso.map((tel) => {
                if (tel.telefonoPersonaId !== change.key.telefonoPersonaId) {
                  return tel;
                } else {
                  tel.numeroLocal =
                    change.data.numeroLocal ?? change.key.numeroLocal;
                  tel.telefonoCelular =
                    change.data.telefonoCelular ?? change.key.telefonoCelular;
                  tel.observaciones =
                    change.data.observaciones ?? change.key.observaciones;
                  return tel;
                }
              });
              let data2 = {
                ...this.state.dataDepartamento,
                ...{ telefonos: this.state.telAso },
              };
              this.setState({
                dataDepartamento: data2,
              });
            } else {
              e.cancel = true;
              Notifier.mostrarNotificacion(
                "Error: Todos los datos telefónicos ingresados son vacíos",
                "error",
                3000
              );
            }
          }

          break;

        default:
          break;
      }
    });
  }

  storeTelefono(e) {
    this.setState({ filaTel: e });
  }

  storeMails(e) {
    this.setState({ filaMail: e });
  }

  onSavingDataPropietarioDe(e) {
    e.changes.forEach((change) => {
      switch (change.type) {
        case "update":
          let updateObjeto = {
            personaDepartamentoId:
              this.state.dataDepartamento.personaDepartamentoId,
            personaId: this.state.dataDepartamento.personaId,
            departamentoId: this.state.dataDepartamento.departamentoId,
            tipoPersonaId: this.state.dataDepartamento.tipoPersonaId,
            liqPorMail: this.state.dataDepartamento.liqPorMail,
            observaciones: this.state.dataDepartamento.observaciones,
            nombre: this.state.dataDepartamento.nombre,
            apellido: this.state.dataDepartamento.apellido,
            cbu: this.state.dataDepartamento.cbu,
            tipoIdentificadorId:
              this.state.dataDepartamento.tipoIdentificadorId,
            identificador: this.state.dataDepartamento.identificador,
            extranjero: this.state.dataDepartamento.extranjero,
            estadoPersonaDepartamentoId:
              this.state.dataDepartamento.estadoPersonaDepartamentoId,
            direccion: this.state.dataDepartamento.direccion,
            mails: this.state.dataDepartamento.mails,
            telefonos: this.state.dataDepartamento.telefonos,
            personasAsociadas: this.state.dataDepartamento.personasAsociadas,
            propietarios: this.state.dataDepartamento.propietarios.map(
              (pro) => {
                if (
                  pro.personaDepartamentoId !== change.key.personaDepartamentoId
                ) {
                  return pro;
                } else {
                  pro.observaciones =
                    change.data.observaciones ?? change.key.observaciones;
                  pro.estadoPersonaDepartamentoId =
                    change.data.estadoPersonaDepartamentoId ??
                    change.key.estadoPersonaDepartamentoId;
                  return pro;
                }
              }
            ),
          };

          this.setState({ dataDepartamento: updateObjeto });
          break;
        default:
          break;
      }
    });
  }

  onSavingDataPersonaAsociadaData(e) {
    e.changes.forEach((change) => {
      switch (change.type) {
        case "update":
          let updateObjeto = {
            personaDepartamentoId:
              this.state.dataDepartamento.personaDepartamentoId,
            personaId: this.state.dataDepartamento.personaId,
            departamentoId: this.state.dataDepartamento.departamentoId,
            tipoPersonaId: this.state.dataDepartamento.tipoPersonaId,
            liqPorMail: this.state.dataDepartamento.liqPorMail,
            observaciones: this.state.dataDepartamento.observaciones,
            nombre: this.state.dataDepartamento.nombre,
            apellido: this.state.dataDepartamento.apellido,
            cbu: this.state.dataDepartamento.cbu,
            tipoIdentificadorId:
              this.state.dataDepartamento.tipoIdentificadorId,
            identificador: this.state.dataDepartamento.identificador,
            extranjero: this.state.dataDepartamento.extranjero,
            estadoPersonaDepartamentoId:
              this.state.dataDepartamento.estadoPersonaDepartamentoId,
            direccion: this.state.dataDepartamento.direccion,
            mails: this.state.dataDepartamento.mails,
            telefonos: this.state.dataDepartamento.telefonos,
            personasAsociadas:
              this.state.dataDepartamento.personasAsociadas.map((per) => {
                if (per.personaId !== change.key.personaId) {
                  return per;
                } else {
                  per.tipoPersonaId = change.key.tipoPersonaId;
                  per.liqPorMail =
                    change.data.liqPorMail || change.key.liqPorMail;
                  per.observaciones =
                    change.data.observaciones || change.key.observaciones;
                  per.nombre = change.data.nombre || change.key.nombre;
                  per.apellido = change.data.apellido || change.key.apellido;
                  per.cbu = change.key.cbu;
                  per.tipoIdentificadorId = change.key.tipoIdentificadorId;
                  per.identificador = change.key.identificador;
                  per.extranjero =
                    change.data.extranjero || change.key.extranjero;
                  per.estadoPersonaDepartamentoId =
                    change.key.estadoPersonaDepartamentoId;

                  per.telefonos = this.state.telAso;

                  if (change.data.hasOwnProperty("mail")) {
                    if (per.mails !== []) {
                      per.mails = [
                        {
                          mail: change.data.mail,
                          fechaUltimaModificacion:
                            this.state.today.toISOString(),
                          mailPersonaId: 0,
                          tMarcaFecha: this.state.today.toISOString(),
                        },
                      ];
                    } else {
                      per.mails[0].mail = change.data.mail;
                    }
                  }

                  return per;
                }
              }),
            propietarios: this.state.dataDepartamento.propietarios,
          };

          this.setState({ dataDepartamento: updateObjeto });
          break;

        case "insert":
          if (change.data.hasOwnProperty("nombre") === false) {
            return this.notificarInputInvalidoAso("Nombre");
          } else {
            let insertObjeto = {
              personaDepartamentoId:
                this.state.dataDepartamento.personaDepartamentoId,
              personaId: this.state.dataDepartamento.personaId,
              departamentoId: this.state.dataDepartamento.departamentoId,
              tipoPersonaId: this.state.dataDepartamento.tipoPersonaId,
              liqPorMail: this.state.dataDepartamento.liqPorMail,
              observaciones: this.state.dataDepartamento.observaciones,
              nombre: this.state.dataDepartamento.nombre,
              apellido: this.state.dataDepartamento.apellido,
              cbu: this.state.dataDepartamento.cbu,
              tipoIdentificadorId:
                this.state.dataDepartamento.tipoIdentificadorId,
              identificador: this.state.dataDepartamento.identificador,
              extranjero: this.state.dataDepartamento.extranjero,
              estadoPersonaDepartamentoId:
                this.state.dataDepartamento.estadoPersonaDepartamentoId,
              direccion: this.state.dataDepartamento.direccion,
              mails: this.state.dataDepartamento.mails,
              telefonos: this.state.dataDepartamento.telefonos,
              personasAsociadas:
                this.state.dataDepartamento.personasAsociadas.concat([
                  {
                    personaDepartamentoId: 0,
                    personaId: 0,
                    departamentoId: this.props.departamentoId,
                    tipoPersonaId: change.data.tipoPersonaId ?? 1,
                    liqPorMail: change.data.liqPorMail || change.key.liqPorMail,
                    observaciones:
                      change.data.observaciones ||
                      change.key.observaciones ||
                      "",
                    nombre: change.data.nombre || change.key.nombre || "",
                    apellido: change.data.apellido || change.key.apellido || "",
                    cbu: change.data.cbu || change.key.cbu || 0,
                    tipoIdentificadorId: this.state.tipoIdentificadorId,
                    identificador:
                      change.data.identificador ||
                      change.key.identificador ||
                      "",
                    extranjero: change.data.extranjero || change.key.extranjero,
                    estadoPersonaDepartamentoId:
                      change.data.estadoPersonaDepartamentoId ||
                      change.key.estadoPersonaDepartamentoId ||
                      1,

                    direccion: change.data.hasOwnProperty("direccion")
                      ? this.state.nuevoAso === true
                        ? this.state.direAso
                        : this.state.dataDepartamento.personasAsociadas[
                            change.key.personaId
                          ].direccion
                      : this.state.direAso,

                    telefonos: this.state.telAso,

                    mails: change.data.hasOwnProperty("mail")
                      ? [
                          {
                            mail: change.data.mail || change.key.mail,
                            fechaUltimaModificacion:
                              this.state.today.toISOString(),
                            mailPersonaId: 0,
                            tMarcaFecha: this.state.today.toISOString(),
                          },
                        ]
                      : [],
                  },
                ]),
              propietarios: this.state.dataDepartamento.propietarios,
            };

            ABMPersonasService.actualizaPersona(
              insertObjeto,
              (resp) => {
                Notifier.mostrarNotificacion(
                  "operación exitosa",
                  "success",
                  3000
                );
                /*ABMPersonasService.buscar(
                  this.state.dataDepartamento.departamentoId,
                  (data) => {
                    this.setState({ dataDepartamento: data });
                  }
                );*/
              },
              (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
              }
            );
          }

          break;
        default:
          break;
      }
    });
  }

  onEditingStartForm(e) {
    this.obtenerPersonaEditando(e);
    this.setState({
      idPersonaAsociadaEditando: e.data.personaId ?? 0,
      tipoIdentPersonaAsociadaId: e.data.tipoIdentificadorId,
      telAso: e.data.telefonos ?? [],
      mailAso: e.data.mails ?? [],
      direAso: e.data.direccion,
    });
  }

  creaDepaLocal() {
    let depart = {
      personaDepartamentoId: 0,
      personaId: 0,
      departamentoId: this.props.departamentoId || 0,
      tipoPersonaId: 1,
      liqPorMail: true,
      observaciones: "",
      nombre: "",
      apellido: "",
      cbu: 0,
      tipoIdentificadorId: 1,
      identificador: 0,
      extranjero: false,
      estadoPersonaDepartamentoId: 0,
      propietarios: [
        {
          personaDepartamentoId: 0,
          unidad: this.props.unidad === undefined ? 0 : this.props.unidad,
          codDepartamento:
            this.props.codDepartamento === undefined
              ? ""
              : this.props.codDepartamento,
          piso: this.props.piso === undefined ? "" : this.props.piso,
          liqPorMail: true,
          observaciones: "",
          estadoPersonaDepartamentoId: 0,
        },
      ],

      personasAsociadas: [],
      telefonos: [],
      mails: [],
      direccion: {
        direccionId: 0,
        calle: "",
        numero: "",
        piso: "",
        departamento: "",
        codigoPostal: "",
        lat: "",
        long: "",
        pais: "",
        provincia: "",
        localidad: "",
        direccionFormateada: "",
        direccionApiGoogle: "",
      },
    };
    let newData = { ...this.state.data, nuevo: true };
    this.setState({ dataDepartamento: depart, data: newData });
  }

  onInitNewRowTelAso(e) {
    e.data.telefonoPersonaId = 0;
    e.data.observaciones = null;
  }

  onInitNewRowMail(e) {
    e.data.fechaUltimaModificacion = this.state.today.toISOString();
    e.data.tMarcaFecha = this.state.today.toISOString();
    e.data.mailPersonaId = 0;
  }

  onInitNewRowPersonaAsociada(e) {
    this.setState({
      idPersonaAsociadaEditando: 0,
      telAso: [],
      mailAso: [],
      direAso: {
        direccionId: 0,
        calle: "",
        numero: "",
        piso: "",
        departamento: "",
        codigoPostal: "",
        lat: "",
        long: "",
        pais: "",
        provincia: "",
        localidad: "",
        direccionFormateada: "",
        direccionApiGoogle: "",
      },
    });
  }

  onEditDataMail(e) {
    e.data.fechaUltimaModificacion = this.state.today.toISOString();
  }

  onContextMenuItems(e) {}

  onEditCanceled(e) {
    /*ABMPersonasService.buscar(this.state.data.departamentoId, (data) => {
      this.setState({ dataDepartamento: data, mostrarPopupDireccion: false });
    });*/
  }

  
  onPhoneNumberRowRemoving(e) {
    let index = e.component.getRowIndexByKey(e.key);
    let rowEl = e.component.getRowElement(index);
    $(rowEl).addClass("rowToDelete"); 
    let res = confirm("¿Desea borrar el teléfono celular: " + e.key.telefonoCelular + "?",
      "Propietario: " + this.state.dataDepartamento.nombre);
    let d = $.Deferred();
    
    e.cancel = d.promise();
    res.done((dialogResult) => {
      $(rowEl).removeClass("rowToDelete");
      if (!dialogResult)
        d.resolve(true)
      else
        d.resolve() 
    });
  }

  
  onEmailRowRemoving(e) {
    let index = e.component.getRowIndexByKey(e.key);
    let rowEl = e.component.getRowElement(index);
    $(rowEl).addClass("rowToDelete"); 
    let res = confirm("¿Desea borrar el email: " + e.key.mail + "?",
      "Propietario: " + this.state.dataDepartamento.nombre);
    let d = $.Deferred();
    
    e.cancel = d.promise();
    res.done((dialogResult) => {
      $(rowEl).removeClass("rowToDelete");
      if (!dialogResult)
        d.resolve(true)
      else
        d.resolve() 
    });
  }

  render() {
    if (!this.state.setData) {
      return <div></div>;
    } else {
      if (this.state.dataDepartamento === undefined) {
        this.creaDepaLocal();
      }
      return (
        <Popup
          deferRendering={true}
          className={"popup"}
          visible={this.state.popupVisible}
          onHiding={this.closePopup}
          onHidden={this.props.closePopupAbmPersonas}
          showCloseButton={true}
          dragEnabled={true}
          closeOnOutsideClick={false}
          showTitle={true}
          title={
            this.props.nuevo === true
              ? "Alta Nuevo Propietario"
              : "Modificación Propietario"
          }
          height={"650px"}
        >
          <ScrollView
            width="100%"
            height="100%"
            style={{ position: "relative" }}
          >
            <div
              style={{
                background: "#FFF",
                boxShadow: "1px 1px 10px #00000033",
                display: "flex",
                justifyContent: "space-around",
                padding: "20px 10px",
                position: "sticky",
                top: "0",
                zIndex: 100,
              }}
            >
              <div>
                <h3 className={"titleStyle"}>{this.props.titulo}</h3>
                <h3 className={"titleStyle"}>{this.props.subTitulo}</h3>
              </div>
              <Button
                style={{
                  alignSelf: "end",
                  margin: "10px",
                  width: "25%",
                }}
                type="success"
                text="Guardar Datos"
                onClick={
                  this.state.data.nuevo === true
                    ? this.doneAddClick
                    : this.doneClick
                }
                disabled={this.state.buttonSubmit}
              />
            </div>
            <h6 style={{ marginTop: "18px" }}>Propietario pincipal</h6>
            <Card className={"card"} title={"Propietario Principal"}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          autoComplete="off"
                          fullWidth
                          required={true}
                          name="nombre"
                          label="Nombre"
                          title="Nombre"
                          defaultValue={
                            this.state.dataDepartamento === undefined
                              ? ""
                              : this.state.dataDepartamento.nombre
                          }
                          onChange={this.handleChange}
                          type="text"
                          error={this.state.nombre}
                          multiline
                        ></TextField>
                      </TableCell>
                      <TableCell>
                        <h6>Tipo de Identificador</h6>
                        <SelectBox
                          dataSource={this.state.listTipo}
                          displayExpr="descripcion"
                          valueExpr="id"
                          defaultValue={
                            this.state.dataDepartamento === undefined
                              ? null
                              : this.state.dataDepartamento.tipoIdentificadorId
                          }
                          // defaultValue={this.state.listTipo !== [] ? (
                          //   this.state.listTipo[
                          //     this.state.dataDepartamento.tipoIdentificadorId -
                          //       1
                          //   ].id !== undefined
                          //     ? this.state.listTipo[
                          //         this.state.dataDepartamento
                          //           .tipoIdentificadorId - 1
                          //       ].id
                          //     : null) : null
                          // }
                          onValueChanged={this.saveChangeIdentificador}
                        ></SelectBox>
                      </TableCell>
                      <TableCell>
                        <TextField
                          autoComplete="off"
                          required={false}
                          name="identificador"
                          margin="normal"
                          label="Identificador"
                          title="Identificador"
                          defaultValue={
                            this.state.dataDepartamento === undefined
                              ? ""
                              : this.state.dataDepartamento.identificador
                          }
                          onChange={this.handleChange}
                          type="text"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          autoComplete="off"
                          inputProps={{
                            readOnly: false,
                          }}
                          required={false}
                          name="cbu"
                          margin="normal"
                          label="CBU"
                          title="CBU"
                          defaultValue={
                            this.state.dataDepartamento === undefined
                              ? ""
                              : this.state.dataDepartamento.cbu
                          }
                          onChange={this.handleChange}
                          type="text"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="tableBody">
                      <TableCell>
                        <TextField
                          autoComplete="off"
                          fullWidth
                          required={false}
                          multiline
                          name="direccion"
                          label="Dirección"
                          title="Direccion"
                          type="text"
                          value={
                            this.state.dataDepartamento !== undefined
                              ? (this.state.dataDepartamento.direccion !==
                                  null) &
                                (this.state.dataDepartamento.direccion !==
                                  undefined) &
                                (this.state.dataDepartamento.direccion
                                  ?.direccionApiGoogle !==
                                  " , , , , ")
                                ? this.state.dataDepartamento.direccion
                                    ?.direccionApiGoogle
                                : ""
                              : ""
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <h6>Cambiar Dirección</h6>
                        <Button onClick={this.handleClick}>Cambiar</Button>
                        {this.state.mostrarPopupDireccion === true &&
                        this.state.dataDepartamento.direccion !== null ? (
                          <DireccionIndex
                            direccionId={
                              this.state.dataDepartamento.direccion.direccionId
                            }
                            closePopupDireccion={this.closePopupDireccion}
                            confirmarDireccion={this.confirmarDireccion}
                            borrarDireccion={this.borrarDireccion}
                          />
                        ) : this.state.mostrarPopupDireccion === true &&
                          this.state.dataDepartamento.direccion === null ? (
                          <DireccionIndex
                            closePopupDireccion={this.closePopupDireccion}
                            confirmarDireccion={this.confirmarDireccion}
                            borrarDireccion={this.borrarDireccion}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <TextField
                          autoComplete="off"
                          required={false}
                          name="observaciones"
                          margin="normal"
                          label="Observaciones"
                          title="Observaciones"
                          defaultValue={
                            this.state.dataDepartamento === undefined
                              ? ""
                              : this.state.dataDepartamento.observaciones
                          }
                          onChange={this.handleChange}
                          type="text"
                          multiline
                        />
                      </TableCell>
                      <TableCell name="extranjero">
                        <CheckBox
                          name="extranjero"
                          defaultValue={
                            this.state.dataDepartamento === undefined
                              ? ""
                              : this.state.dataDepartamento.extranjero
                          }
                          checked={
                            this.state.dataDepartamento !== undefined
                              ? this.state.dataDepartamento.extranjero === true
                                ? true
                                : false
                              : false
                          }
                          text="Extranjero"
                          onValueChanged={this.onValueChanged}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            <Card className={"card"} title={"Propietario Principal"}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow style={{ width: "100%" }}>
                      <TableCell style={{ width: "50%" }}>
                        <h6>Teléfonos</h6>
                        <ADAGrid
                          items={
                            this.state.dataDepartamento !== undefined
                              ? this.state.dataDepartamento.telefonos
                              : []
                          }
                          key="TelefonosDepartamento"
                                                    stateStoringEnabled={false}
                          showBorders={false}
                          width="auto"
                          height="auto"
                          editingMode={"cell"}
                          onRowUpdated={this.storeTelefono}
                          allowDeleting={true}
                          onContextMenuPreparing={this.onContextMenuItems}
                          onRowRemoving={this.onPhoneNumberRowRemoving}
                        >
                          <ColumnChooser enabled={false} />
                          <Export enabled={true} />
                          <GroupPanel visible={false} />
                          <SearchPanel visible={false} />
                          <Column
                            caption="Número Local"
                            dataField="numeroLocal"
                            fixed="true"
                          ></Column>
                          <Column
                            caption="Teléfono Celular"
                            dataField="telefonoCelular"
                            fixed="true"
                          ></Column>
                          <Column
                            caption="Observaciones"
                            dataField="observaciones"
                            fixed="true"
                          ></Column>
                        </ADAGrid>
                      </TableCell>
                      <TableCell style={{ width: "50%" }}>
                        <h6>Mails</h6>
                        <ADAGrid
                          items={
                            this.state.dataDepartamento !== undefined
                              ? this.state.dataDepartamento.mails
                              : []
                          }
                          key="MailsDepartamento"
                                                    stateStoringEnabled={false}
                          showBorders={false}
                          width="auto"
                          height="auto"
                          editingMode={"cell"}
                          onRowUpdated={this.storeMails}
                          onInitNewRow={this.onInitNewRowMail}
                          //onSaving={this.onSavingMail}
                          //onChange={this.onSavingMail}
                          allowDeleting={true}
                          onContextMenuPreparing={this.onContextMenuItems}
                          onRowRemoving={this.onEmailRowRemoving}
                        >
                          <ColumnChooser enabled={false} />
                          <Export enabled={true} />
                          <GroupPanel visible={false} />
                          <SearchPanel visible={false} />
                          <Paging enabled={false} />
                          <Column caption="Mail" dataField="mail">
                            <RequiredRule />
                            <StringLengthRule max="100" />
                            <CustomRule
                              validationCallback={this.onChangeEmail}
                              dataField="mail"
                              message="Email inválido!!!"
                            />
                          </Column>
                          <Column
                            caption="Última Modificación"
                            dataField="fechaUltimaModificacion"
                            allowEditing={false}
                            dataType={"datetime"}
                          ></Column>
                        </ADAGrid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <h6>Propietario de</h6>
                        <ADAGrid
                          items={
                            this.state.dataDepartamento !== undefined
                              ? this.state.dataDepartamento.propietarios
                              : []
                          }
                          //key="propietario"
                                                    stateStoringEnabled={false}
                          showBorders={false}
                          onSaving={this.onSavingDataPropietarioDe}
                          onChange={this.onSavingDataPropietarioDe}
                          width="auto"
                          height="auto"
                          editingMode={"cell"}
                          allowDeleting={false}
                          allowAdding={false}
                          onContextMenuPreparing={this.onContextMenuItems}
                        >
                          <ColumnChooser enabled={false} />
                          <Export enabled={true} />
                          <GroupPanel visible={false} />
                          <SearchPanel visible={false} />
                          <Paging enabled={false} />
                          <Column
                            allowEditing={false}
                            caption="U.F."
                            calculateCellValue={this.resuelveUF}
                          ></Column>
                          <Column
                            allowEditing={true}
                            caption="LiqPorEmail"
                            dataField="liqPorMail"
                            value="liqPorMail"
                          ></Column>
                          <Column
                            allowEditing={true}
                            caption="Observaciones"
                            dataField="observaciones"
                          ></Column>
                        </ADAGrid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <h6>Personas asociadas</h6>
                        <ADAGrid
                          onEditCanceled={this.onEditCanceled}
                          allowDeleting={true}
                          columnWidth="auto"
                          height="auto"
                          items={
                            this.state.dataDepartamento !== undefined
                              ? this.state.dataDepartamento.personasAsociadas
                              : []
                          }
                          key="asociados"
                                                    stateStoringEnabled={false}
                          onSaving={this.formSave}
                          onEditingStart={this.onEditingStartForm}
                          onEditorPrepared={this.onEditorPrepared}
                          onInitNewRow={this.onInitNewRowPersonaAsociada}
                          showBorders={false}
                          width="auto"
                          onContextMenuPreparing={this.onContextMenuItems}
                        >
                          <ColumnChooser enabled={false} />
                          <Export enabled={true} />
                          <GroupPanel visible={false} />
                          <SearchPanel visible={false} />
                          <Paging enabled={false} />
                          <Editing
                            mode="popup"
                            allowUpdating={true}
                            allowAdding={true}
                            allowDeleting={false}
                          >
                            <PopupGrid
                              title="Personas Asociadas"
                              showTitle={true}
                              width={"70%"}
                            />
                            <Form>
                              <Item itemType="group" colCount={2} colSpan={2}>
                                <Item
                                  caption="Tipo persona"
                                  dataField="tipoPersonaId"
                                />
                                <Item dataField="nombre" isRequired={true} />
                                <Item dataField="tipoIdentificadorId" />
                                <Item dataField="identificador" />

                                <Item
                                  caption="Direccion"
                                  dataField="direccion"
                                  calculateCellValue={
                                    this.state.direAso !== undefined &&
                                    this.state.direAso !== null
                                      ? this.state.direAso
                                          ?.direccionApiGoogle !== " , , , , "
                                        ? this.state.direAso?.direccionApiGoogle
                                        : ""
                                      : ""
                                  }
                                  disabled="disabled"
                                  multiline
                                />

                                <Item>
                                  <Button onClick={this.handleClick}>
                                    Cambiar Dirección
                                  </Button>
                                  {this.state.mostrarPopupDireccion === true &&
                                  this.state.nuevaDireccionAso === false ? (
                                    <DireccionIndex
                                      direccionId={this.state.idDireccion}
                                      closePopupDireccion={
                                        this.closePopupDireccion
                                      }
                                      confirmarDireccion={
                                        this.confirmarDireccionAso
                                      }
                                      borrarDireccion={this.borrarDireccion}
                                    />
                                  ) : this.state.mostrarPopupDireccion ===
                                      true &&
                                    this.state.nuevaDireccionAso === true ? (
                                    <DireccionIndex
                                      direccionId={
                                        this.state.direAso.direccionId
                                      }
                                      closePopupDireccion={
                                        this.closePopupDireccion
                                      }
                                      confirmarDireccion={
                                        this.confirmarDireccionAso
                                      }
                                      borrarDireccion={this.borrarDireccion}
                                    />
                                  ) : null}
                                </Item>
                                <Item itemType="group" colCount={2}>
                                  <Item
                                    dataField="liqPorMail"
                                    defaultValue={false}
                                    editorType="dxCheckBox"
                                  />
                                  <Item
                                    dataField="extranjero"
                                    defaultValue={false}
                                    editorType="dxCheckBox"
                                  />
                                </Item>
                                <Item dataField="observaciones" multiline />
                                <Item dataField="estadoPersonaDepartamentoId" />
                              </Item>
                              <Item>
                                <ADAGrid
                                  items={this.state.mailAso}
                                  key="mailPersonaId"
                                                                    stateStoringEnabled={false}
                                  showBorders={false}
                                  width="auto"
                                  height="auto"
                                  editingMode={"cell"}
                                  onRowUpdated={this.onEditDataMail}
                                  onInitNewRow={this.onInitNewRowMail}
                                  allowDeleting={true}
                                  onContextMenuPreparing={
                                    this.onContextMenuItems
                                  }
                                  onRowRemoving={this.onEmailRowRemoving}
                                >
                                  <ColumnChooser enabled={false} />
                                  <Export enabled={true} />
                                  <GroupPanel visible={false} />
                                  <SearchPanel visible={false} />
                                  <Paging enabled={false} />
                                  <Column
                                    caption="Mail"
                                    dataField="mail"
                                    isRequired={true}
                                  >
                                    <RequiredRule />
                                    <StringLengthRule max="100" />
                                    <CustomRule
                                      validationCallback={this.onChangeEmailAso}
                                      dataField="mail"
                                      message="Email inválido!!!"
                                    />
                                  </Column>
                                  <Column
                                    caption="Última Modificación"
                                    dataField="fechaUltimaModificacion"
                                    allowEditing={false}
                                    dataType={"datetime"}
                                  ></Column>
                                </ADAGrid>
                              </Item>

                              <Item>
                                <ADAGrid
                                  items={this.state.telAso}
                                  key="telefonoPersonaId"
                                                                    stateStoringEnabled={false}
                                  showBorders={false}
                                  columnWidth="auto"
                                  width="auto"
                                  height="auto"
                                  allowDeleting={true}
                                  editingMode={"cell"}
                                  onInitNewRow={this.onInitNewRowTelAso}
                                  onSaving={this.onSavingTelAso}
                                  onChange={this.onSavingTelAso}
                                  onContextMenuPreparing={
                                    this.onContextMenuItems
                                  }
                                  onRowRemoving={this.onPhoneNumberRowRemoving}
                                >
                                  <ColumnChooser enabled={false} />
                                  <Export enabled={true} />
                                  <GroupPanel visible={false} />
                                  <SearchPanel visible={false} />
                                  <Column
                                    caption="Teléfono Celular"
                                    dataField="telefonoCelular"
                                  ></Column>
                                  <Column
                                    caption="Teléfono Local"
                                    dataField="numeroLocal"
                                  ></Column>
                                  <Column
                                    caption="Observaciones"
                                    dataField="estadoPersonaDepartamentoId"
                                  ></Column>
                                </ADAGrid>
                              </Item>
                            </Form>
                          </Editing>
                          <Column
                            caption="Tipo persona"
                            dataField="tipoPersonaId"
                          >
                            <Lookup
                              dataSource={this.state.listTipoPersonas}
                              displayExpr="descripcion"
                              valueExpr="tipoPersonaId"
                            ></Lookup>
                          </Column>
                          <Column
                            caption="Nombre"
                            dataField="nombre"
                            isRequired={true}
                            allowSorting={true}
                          ></Column>

                          <Column
                            caption="Identificador"
                            dataField="identificador"
                          ></Column>
                          <Column
                            caption="Tipo Identificador"
                            dataField="tipoIdentificadorId"
                            visible={false}
                            enabled={false}
                          >
                            <Lookup
                              dataSource={this.state.listTipo}
                              valueExpr="id"
                              displayExpr="descripcion"
                            ></Lookup>
                          </Column>
                          <Column
                            caption="Direccion"
                            dataField="direccion"
                            calculateCellValue={this.resuelveDireccion}
                          />
                          <Column
                            caption="Teléfono Celular"
                            dataField="telefonoCelular"
                            calculateCellValue={this.resuelveCel}
                          ></Column>

                          <Column
                            caption="Teléfono Local"
                            dataField="numeroLocal"
                            calculateCellValue={this.resuelveTel}
                          ></Column>
                          <Column
                            caption="Mail"
                            dataField="mail"
                            calculateCellValue={this.resuelveMail}
                          >
                            <RequiredRule />
                            <StringLengthRule max="100" />
                            <CustomRule
                              validationCallback={this.onChangeEmailAso}
                              dataField="mail"
                              message="Email inválido!!!"
                            />
                          </Column>
                          <Column
                            caption="Liq. Por mail"
                            dataField="liqPorMail"
                            editorType="dxCheckBox"
                          ></Column>
                          <Column
                            caption="Estado"
                            dataField="estadoPersonaDepartamentoId"
                          >
                            <Lookup
                              dataSource={this.state.listEstados}
                              valueExpr={"id"}
                              displayExpr={"descripcion"}
                            />
                          </Column>
                          <Column
                            caption="Observaciones"
                            dataField="observaciones"
                          ></Column>
                          <Column
                            caption="Extranjero"
                            dataField="extranjero"
                            editorType="dxCheckBox"
                          ></Column>
                        </ADAGrid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </ScrollView>
        </Popup>
      );
    }
  }
}
