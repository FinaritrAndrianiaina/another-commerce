import {Entity} from "typeorm";


function getCustomerSimilarProductRepository(id: string) {
    @Entity({name: `SP_GET_TOP_SIMILAR_USER_PRODUCTS('${id}')`})
    class CustomerSimilarProduct {
    }

}


export default getCustomerSimilarProductRepository;