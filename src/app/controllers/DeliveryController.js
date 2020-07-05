import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class DeliveryController {
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
      where: { deliveryman_id: id, canceled_at: null, end_date: null },
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

  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number(),
      end_date: Yup.date().when('signature_id', (signature_id, field) => {
        return signature_id ? field.required() : field;
      }),
      start_date: Yup.date().when('end_date', (end_date, field) => {
        return end_date ? field.required() : field;
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, deliveryId } = req.params;

    if (!id || !deliveryId) {
      return res.status(400).json({ error: 'Id not provided' });
    }

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    const order = await Order.findByPk(deliveryId);

    if (!order || order.end_date !== null) {
      return res.status(401).json({ error: 'Order not found' });
    }

    if (order.deliveryman_id !== deliveryman.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      id: order_id,
      product,
      end_date,
      start_date,
      signature_id,
    } = await order.update(req.body);

    return res.json({ order_id, product, start_date, end_date, signature_id });
  }
}

export default new DeliveryController();
