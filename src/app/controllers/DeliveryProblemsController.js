import * as Yup from 'yup';
import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import CancelationMail from '../jobs/CancelationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { delivery_id } = req.params;

    if (!delivery_id) {
      return res.status(401).json({ error: 'Id not provided' });
    }

    const order = await Order.findByPk(delivery_id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const { description } = req.body;

    const { id } = await DeliveryProblems.create({ delivery_id, description });

    return res.json({ id, delivery_id, description });
  }

  async show(req, res) {
    const { delivery_id } = req.params;

    if (!delivery_id) {
      return res.status(401).json({ error: 'Id not provided' });
    }

    const delivery = await Order.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Order not found' });
    }

    const problems = await DeliveryProblems.findAll({
      where: { delivery_id },
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'delivery',
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
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!problems) {
      return res.status(400).json({ message: 'The order has no problems' });
    }

    return res.json(problems);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await DeliveryProblems.findAll({
      attributes: ['description'],
      include: [
        {
          model: Order,
          as: 'delivery',
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
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (!deliveries) {
      return res
        .status(400)
        .json({ message: 'Não há nenhuma entrega com problemas' });
    }

    return res.json(deliveries);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Id not provided' });
    }

    const { delivery_id } = await DeliveryProblems.findByPk(id);

    if (!delivery_id) {
      return res.status(400).json({ error: 'Problem not found' });
    }

    const order = await Order.findByPk(delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'rua', 'numero', 'complemento', 'cidade', 'cep'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order has already canceled' });
    }

    await order.update({ canceled_at: new Date() });

    await Queue.add(CancelationMail.key, { order });

    return res.json(order);
  }
}

export default new DeliveryProblemsController();
