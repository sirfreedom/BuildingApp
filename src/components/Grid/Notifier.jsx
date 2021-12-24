import notify from 'devextreme/ui/notify';

export class Notifier {

    static mostrarNotificacion(message, type, timeout) {

        notify(message, type, timeout);
    
    }
}