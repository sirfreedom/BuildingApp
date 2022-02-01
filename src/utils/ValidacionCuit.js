

export default function ValidacionCuit(cuit) {

    // if (cuit.length != 11) 
    //     return false;

    var rv = false;
    var resultado = 0;
    var cuit_nro = cuit.replace("-", "");
    var codes = "6789456789";
    var verificador = parseInt(cuit_nro[cuit_nro.length - 1], 10);
    var x = 0;

    while (x < 10) {
        var digitoValidador = parseInt(codes.substring(x, x + 1), 10);
        if (isNaN(digitoValidador))
            digitoValidador = 0;
        var digito = parseInt(cuit_nro.substring(x, x + 1), 10);
        if (isNaN(digito))
            digito = 0;
        var digitoValidacion = digitoValidador * digito;
        resultado += digitoValidacion;
        x++;
    }

    resultado = resultado % 11;
    rv = (resultado === verificador);

    return rv;
}
