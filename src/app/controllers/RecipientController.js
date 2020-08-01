import { Op } from 'sequelize';
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
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      id,
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    });
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

  async index(req, res) {
    const { page = 1, name = '' } = req.query;

    const recipients = await Recipient.findAll({
      where: { name: { [Op.iLike]: `${name}%` } },
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(recipients);
  }
}

export default new RecipientController();
