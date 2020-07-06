import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancelationMail {
  get key() {
    return 'CancelationMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancelation',
      context: {
        deliveryman: order.deliveryman.name,
        retirada: order.start_date
          ? format(
              parseISO(order.start_date),
              "'dia' dd 'de' MMMM', às' HH:mm'h",
              {
                locale: pt,
              }
            )
          : null,
        product: order.product,
        name: order.recipient.name,
        rua: order.recipient.rua,
        numero: order.recipient.numero,
        complemento: order.recipient.complemento,
        cidade: order.recipient.cidade,
        cep: order.recipient.cep,
      },
    });
  }
}

export default new CancelationMail();
