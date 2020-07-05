import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class HandedoutController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Deliveryman ID not provided' });
    }

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman ID does not exists' });
    }

    const deliveries = await Order.findAll({
      where: { deliveryman_id: id, end_date: { [Op.not]: null } },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'rua',
            'numero',
            'complemento',
            'cidade',
            'cep',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'name', 'path'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
      order: ['created_at'],
    });

    if (!deliveries) {
      return res.json({ message: 'You have no deliveries yet' });
    }

    return res.json(deliveries);
  }
}

export default new HandedoutController();
