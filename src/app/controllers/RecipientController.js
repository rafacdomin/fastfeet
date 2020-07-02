import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.string().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required().min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erorr: 'Validation fails' });
    }

    const { name, rua, numero, complemento, estado, cidade, cep } = req.body;

    const recipient = await Recipient.create({
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    });

    return res.json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, rua, numero, complemento, estado, cidade, cep } = req.body;
    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const newRecipient = await recipient.update({
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    });

    return res.json(newRecipient);
  }
}

export default new RecipientController();
