import {Lifetime} from "awilix"
import {Customer, Product, ProductCategory, TransactionBaseService} from "@medusajs/medusa";
import {IEventBusService} from "@medusajs/types";
import axios from "axios";

export default class FeaturesService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED
    protected readonly eventBusService_: IEventBusService;

    constructor(
        {
            eventBusService,
        }: {
            eventBusService: IEventBusService;
        },
        options: Record<string, unknown>
    ) {
        // @ts-ignore
        super(...arguments)

        this.eventBusService_ = eventBusService;
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

}
