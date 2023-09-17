import {EntityManager, QueryRunner} from "typeorm";
import {
    ProductCategory,
    ProductCategoryService
} from "@medusajs/medusa";
import {IEventBusService} from "@medusajs/types";
import FeaturesService from "../services/features";

export default class FeatureCreationSubscriber {
    private featuresService: FeaturesService;
    private queryRunner: QueryRunner;

    constructor(
        {
            manager,
            eventBusService,
            featuresService
        }: {
            manager: EntityManager;
            eventBusService: IEventBusService;
            featuresService: FeaturesService
        }
    ) {
        this.queryRunner = manager.connection.createQueryRunner();
        this.featuresService = featuresService;
        eventBusService.subscribe(ProductCategoryService.Events.CREATED, this.handleProductCategoryCreated);
    }

    handleProductCategoryCreated = async (data: ProductCategory): Promise<any> => {
        await this.queryRunner.connect();
        await this
            .queryRunner
            .query(`
                INSERT INTO features."category_features" ("categoryId", "uniqueName", "metadata","vector") 
                VALUES ($1, $2, $3, $4);
            `, [data.id, data.name + ' ' + data.id, JSON.stringify({
                id: data.id,
                name: data.name,
                parent_category: data.parent_category
            }), `[${await this.featuresService.createEmbedding(data.name)}]`])
    }

}
