import {EntityManager, QueryRunner} from "typeorm";
import {
    Product,
    ProductCategory,
    ProductCategoryService, ProductService
} from "@medusajs/medusa";
import {IEventBusService} from "@medusajs/types";
import FeaturesService from "../services/features";

export default class FeatureCreationSubscriber {
    private featuresService: FeaturesService;
    private queryRunner: QueryRunner;
    private categoryService: ProductCategoryService;
    private productService: ProductService;

    constructor(
        {
            manager,
            eventBusService,
            featuresService,
            productCategoryService,
            productService
        }: {
            productService: ProductService;
            manager: EntityManager;
            eventBusService: IEventBusService;
            featuresService: FeaturesService,
            productCategoryService: ProductCategoryService
        }
    ) {
        this.queryRunner = manager.connection.createQueryRunner();
        this.featuresService = featuresService;
        this.categoryService = productCategoryService;
        this.productService = productService;
        eventBusService.subscribe(ProductCategoryService.Events.CREATED, this.handleProductCategoryCreated);
        eventBusService.subscribe(ProductCategoryService.Events.UPDATED, this.handleProductCategoryUpdated);
        eventBusService.subscribe(ProductService.Events.CREATED, this.handleProductChanged);
        eventBusService.subscribe(ProductService.Events.UPDATED, this.handleProductChanged);
    }


    handleProductChanged = async (data: Product) : Promise<any> => {
        const product = await this.productService.retrieve(data.id);
        await this.queryRunner.connect();
        await this
            .queryRunner
            .query(`
                UPDATE features."product_features"
                SET  name_embeddings = $1
                WHERE "productId"= $2;
            `, [`[${await this.featuresService.createEmbedding(product.title)}]`, data.id])
    }

    handleProductCategoryUpdated = async (data: ProductCategory): Promise<any> => {
        const category = await this.categoryService.retrieve(data.id);
        await this.queryRunner.connect();
        await this
            .queryRunner
            .query(`
                UPDATE features."category_features"
                SET  vector = $1,
                     "uniqueName" = $3 
                WHERE "categoryId"= $2;
            `, [`[${await this.featuresService.createEmbedding(category.name)}]`, data.id,  category.name + ' ' + category.id])
    }

    handleProductCategoryCreated = async (data: ProductCategory): Promise<any> => {
        const category = await this.categoryService.retrieve(data.id);
        await this.queryRunner.connect();
        await this
            .queryRunner
            .query(`
                INSERT INTO features."category_features" ("categoryId", "uniqueName", "metadata","vector") 
                VALUES ($1, $2, $3, $4);
            `, [category.id, category.name + ' ' + category.id, JSON.stringify({
                id: category.id,
                name: category.name,
                parent_category: category.parent_category
            }), `[${await this.featuresService.createEmbedding(category.name)}]`])
    }

}
