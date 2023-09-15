import { EntityManager } from "typeorm";
import { Customer, CustomerService, Product, ProductCategory, ProductCategoryService, ProductService } from "@medusajs/medusa";
import { IEventBusService } from "@medusajs/types";

export default class FeatureCreationSubscriber {
  protected readonly manager_: EntityManager;

  constructor(
    {
      manager,
      eventBusService,
    }: {
      manager: EntityManager;
      eventBusService: IEventBusService;
    }
  ) {
    this.manager_ = manager;

    eventBusService.subscribe(ProductService.Events.CREATED, this.handleProductCreated);
    eventBusService.subscribe(CustomerService.Events.CREATED, this.handleCustomerCreated);
    eventBusService.subscribe(ProductCategoryService.Events.CREATED, this.handleProductCategoryCreated);
  }

  handleCustomerCreated = async (data: Customer): Promise<any> => {
    throw new Error("Not Implemented");
  }

  handleProductCreated = async (data: Product): Promise<any> => {
    throw new Error("Not Implemented");
  }

  handleProductCategoryCreated = async (data: ProductCategory): Promise<any> => {
    throw new Error("Not Implemented");
  }
}
