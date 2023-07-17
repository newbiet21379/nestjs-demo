import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOrdersController } from './service-orders.controller';
import { OrdersService } from './orders.service';

describe('ServiceOrdersController', () => {
  let serviceOrdersController: ServiceOrdersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceOrdersController],
      providers: [OrdersService],
    }).compile();

    serviceOrdersController = app.get<ServiceOrdersController>(ServiceOrdersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceOrdersController.getHello()).toBe('Hello World!');
    });
  });
});
