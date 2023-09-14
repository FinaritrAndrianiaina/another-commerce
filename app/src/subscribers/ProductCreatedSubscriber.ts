import { EntityManager } from "typeorm";
import { Product, ProductService } from "@medusajs/medusa";
import { IEventBusService } from "@medusajs/types";

export default class ProductCreatedSubscriber {
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
  }

  handleProductCreated = async (data: Product): Promise<any> => {
    const categories = data.categories.map((v)=>v.name)
    return true;
  }
}
