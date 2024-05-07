import {Router} from 'express'
import multer from 'multer';

import { AuthUserController} from './controllers/user/AuthUserController'
import { CreateUserController } from './controllers/user/CreateUserController';
import { DetailUserControler } from './controllers/user/DetailUserContoller';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { ListCategoryController } from './controllers/category/ListCategoryController';
import { CreateProductController } from './controllers/products/CreateProductController';
import { ListByCategoryController } from './controllers/products/ListByCategoryController';
import { CreateOrderController } from './controllers/order/CreateOrderController';
import { RemoveOrderController } from './controllers/order/RemoveOrderController';
import { AddItemController } from './controllers/order/AddItemController';
import { RemoveItemController } from './controllers/order/RemoveItemController';
import { SendOrderController } from './controllers/order/SendOrderController';
import { ListOrderController } from './controllers/order/ListOrderController';
import { DetailOrderController } from './controllers/order/DetailOrderController';
import { FinishOrderController } from './controllers/order/FinishOrderController';

import uploadConfig from './config/multer'


const router = Router();

// Multer é utilizado para armazenar os arquivos de fotos em uma pasta
const upload = multer(uploadConfig.upload("./tmp"));


        // -- ROTAS DE USERS -- 
router.post('/users', new CreateUserController().handle);

//-- ROTA DE LOGIN --
router.post('/session', new AuthUserController().handle)

//-- ROTA PARA BUSCAR OS DADOS DO USUÁRIO LOGADO --
router.get('/userinfo', isAuthenticated, new DetailUserControler().handle)


        //-- ROTA PARA AS CATEGORIAS --
router.post('/category', isAuthenticated, new CreateCategoryController().handle);

//-- ROTA PARA LISTAR AS CATEGORIAS --
router.get('/category', isAuthenticated, new ListCategoryController().handle);


        //-- ROTA DE PRODUTOS --
router.post('/product', isAuthenticated, upload.single('file'), new CreateProductController().handle)

router.get('/category/product', isAuthenticated, new ListByCategoryController().handle)


        //-- ROTA DE ORDENS --
router.post('/order', isAuthenticated, new CreateOrderController().handle);

//Removendo uma 
router.delete('/order', isAuthenticated, new RemoveOrderController().handle)

//adicionando itens as ordens
router.post('/order/add', isAuthenticated, new AddItemController().handle)

//Removendo itens da lista
router.delete('/order/remove', isAuthenticated, new RemoveItemController().handle)

// atualizando o status para true do draft
router.put('/order/send', isAuthenticated, new SendOrderController().handle)

//rotas para retornar os pedidos enviados para a cozinha
router.get('/orders', isAuthenticated, new ListOrderController().handle)

// rota para listar todos os detalhes do pedido
router.get('/orders/details', isAuthenticated, new DetailOrderController().handle)

//rota para finalizar o pedido.
router.put('/order/finish', isAuthenticated, new FinishOrderController().handle)

export {router};