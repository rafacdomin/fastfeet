import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/authentication';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import HandedoutController from './app/controllers/HandedoutController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.put(
  '/deliveryman/:id/deliveries/:deliveryId',
  DeliveryController.update
);

routes.get('/deliveryman/:id/handedout', HandedoutController.index);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
