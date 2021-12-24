export const conmutadorMenu = [{
    id: '1',
    text: 'Configuración',
    expanded: true,
    items: [
        {
            id: '1_1',
            text: 'Administrador',
            expanded: true
        }, {
            id: '1_2',
            text: 'Datos de edificio',
            expanded: true
        },
        {
            id: '1_3',
            text: 'Liquidaciones',
            expanded: true,
            items: [
                {
                    id: '1_3_1',
                    text: 'Liquidación de Expensas',
                    expanded: true
                },
                {
                    id: '1_3_2',
                    text: 'Interés y fecha de vencimiento',
                    expanded: true
                },
                {
                    id: '1_3_3',
                    text: 'Formato de caja',
                    expanded: true
                },
                {
                    id: '1_3_4',
                    text: 'Prorrateo de expensas',
                    expanded: true
                },
                {
                    id: '1_3_5',
                    text: 'Mis expensas',
                    expanded: true
                }
            ]
        },
        {
            id: '1_4',
            text: 'Recibos',
            expanded: true,
            items: [
                {
                    id: '1_4_1',
                    text: 'Recibos de expensas',
                    expanded: true
                },
                {
                    id: '1_4_2',
                    text: 'Opciones adicionales',
                    expanded: true
                }
            ]
        },
        {
            id: '1_5',
            text: 'Sueldos',
            expanded: true
        },
        {
            id: '1_6',
            text: 'Configuración adicional',
            expanded: true,
            items: [
                {
                    id: '1_6_1',
                    text: 'Gastos',
                    expanded: true
                },
                {
                    id: '1_6_2',
                    text: 'Intimación de pago',
                    expanded: true
                },
                {
                    id: '1_6_3',
                    text: 'Porcentuales',
                    expanded: true
                },
                {
                    id: '1_6_4',
                    text: 'Proveedores',
                    expanded: true
                },
                {
                    id: '1_6_5',
                    text: 'Cobranzas',
                    expanded: true
                },
                {
                    id: '1_6_6',
                    text: 'Informe 438',
                    expanded: true
                }
            ]
        }
    ]
}];