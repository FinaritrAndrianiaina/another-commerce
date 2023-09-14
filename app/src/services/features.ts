import { Lifetime } from "awilix"
import { Customer, Product, ProductCategory, TransactionBaseService } from "@medusajs/medusa";
import { IEventBusService } from "@medusajs/types";

export default class FeaturesServices extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly eventBusService_: IEventBusService

  constructor(
      { eventBusService }: { eventBusService: IEventBusService },
      options: Record<string, unknown>
  ) {
    // @ts-ignore
    super(...arguments)
    // this.activeManager_.queryRunner.query('');
    this.eventBusService_ = eventBusService
  }

  createEmbedding(input: string) {
    throw new Error('Not implemented');  
  }

  createProductFeatures(product: Product) {
    throw new Error('Not implemented');
  }

  createCustomerFeatures(customer: Customer) {
    throw new Error('Not implemented');
  }

  createCategoryFeatures(category: ProductCategory) {
    throw new Error('Not implemented');
  }


  // SELECT AVG(n) FROM (VALUES (1), (2), (3), (4)) AS t(n);
  queryCalculateListAVG(inputs: any[]) {
    throw new Error('Not implemented');  
  }

  selectProductFeaturesForCentroid(product: Product) {
    throw new Error('Not implemented');  
  }

  selectCategoryFeaturesForCentroid(category: ProductCategory) {
    throw new Error('Not implemented');  
  }

  selectCustomerFeaturesForCentroid(category: ProductCategory) {
    throw new Error('Not implemented');  
  }
}
