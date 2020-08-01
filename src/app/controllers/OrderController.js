import { Op } from 'sequelize';
import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import Order from '../models/Order';
import File from '../models/File';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import NewOrderMail from '../jobs/NewOrderMail';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number().notRequired(),
      product: Yup.string().required(),
      canceled_at: Yup.date().notRequired(),
      start_date: Yup.date().notRequired(),
      end_date: Yup.date().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const { id, recipient_id, deliveryman_id, product } = await Order.create(
      req.body
    );

    await Queue.add(NewOrderMail.key, { deliveryman, recipient, product });

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async index(req, res) {
    const { page = 1, name = '' } = req.query;

    const orders = await Order.findAll({
      where: { product: { [Op.iLike]: `${name}%` } },
      attributes: [
        'id',
        'product',
        'deliveryman_id',
        'recipient_id',
        'signature_id',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'name', 'path'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'cep', 'cidade', 'rua', 'numero', 'complemento'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'name', 'path'],
            },
          ],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
      order: ['created_at'],
    });

    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
      product: Yup.string(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id not provided' });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await order.update(req.body);

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id not provided' });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    await order.destroy();

    return res.json({ message: 'Order has been removed' });
  }
}

export default new OrderController();
