import {Lifetime} from "awilix"
import {ProductCategory, TransactionBaseService} from "@medusajs/medusa";
import {IEventBusService} from "@medusajs/types";
import axios from "axios";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import {ProductPreviewType} from "../types/product-preview";
import {QueryRunner} from "typeorm";

export default class FeaturesService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly eventBusService_: IEventBusService;
    private productRepo_ = ProductRepository

    constructor(
        {
            eventBusService,
            productRepository
        }: {
            productRepository: any;
            eventBusService: IEventBusService;
        },
        options: Record<string, unknown>
    ) {
        // @ts-ignore
        super(...arguments)

        this.eventBusService_ = eventBusService;
        this.productRepo_ = productRepository;
    }

    async createEmbedding(input: string) {
        const axiosResponse = await axios.post(
            "http://localhost:5000/", `data=${input}`
        )
        return axiosResponse?.data?.at(0).join(',') ?? [].join(',');
    }

    createCategoryFeatures(category: ProductCategory) {
        return this.createEmbedding(category.name);
    }

    async retrieveForCustomer(customerId: any) {
        const queryRunner = await this.activeManager_.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const product: ProductPreviewType[] = await queryRunner
            .query(`
                    SELECT 
                       p.id,
                       p.title,
                       p.handle,
                       p.thumbnail
                     FROM SP_GET_TOP_SIMILAR_USER_PRODUCTS($1) p LIMIT 10
            `, [customerId]);
        const results =  this.getProductWithVariants(product, queryRunner);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return results;
    }


    async retrieveForContent(productId: any) {
        const queryRunner = await this.activeManager_.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const product: ProductPreviewType[] = await queryRunner
            .query(`
                    SELECT 
                       p.id,
                       p.title,
                       p.handle,
                       p.thumbnail
                     FROM SP_GET_TOP_SIMILAR_PRODUCTS($1) p LIMIT 10
            `, [productId]);
        console.log("did get product similar");
        const results =  this.getProductWithVariants(product, queryRunner);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return results;
    }

    private async getProductWithVariants(product: ProductPreviewType[], queryRunner: QueryRunner) {
        return await Promise.all(product.map(async (v): Promise<ProductPreviewType> => {
            const result = await queryRunner.query(`     
            SELECT ma.amount,ma.currency_code as currency, pv.title as variant_name FROM 
                money_amount ma
            JOIN product_variant_money_amount pvma on pvma.money_amount_id = ma.id
            JOIN product_variant pv on pv.id = pvma.variant_id
            JOIN product p on p.id = pv.product_id
            WHERE p.id=$1;
`, [v.id]);
            return {
                ...v,
                variant_pricing: result
            }
        }));
    }
}
