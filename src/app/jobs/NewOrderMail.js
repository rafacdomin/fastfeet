import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Você recebeu uma nova entrega',
      template: 'newOrder',
      context: {
        deliveryman: deliveryman.name,
        product,
        name: recipient.name,
        rua: recipient.rua,
        numero: recipient.numero,
        complemento: recipient.complemento,
        cidade: recipient.cidade,
        cep: recipient.cep,
      },
    });
  }
}

export default new NewOrderMail();
