import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    const { name, email, avatar_id } = req.body;

    const deliveryman = await Deliveryman.findOne({ where: { email } });

    if (deliveryman) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id } = await Deliveryman.create({ name, email, avatar_id });

    return res.json({ id, name, email, avatar_id });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(deliverymans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id not provided' });
    }

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { name, email, avatar_id } = await deliveryman.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id not provided' });
    }

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();

    return res.json({ message: 'Deliveryman has been removed' });
  }
}

export default new DeliverymanController();
