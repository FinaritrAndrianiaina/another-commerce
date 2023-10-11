// src/loaders/my-loader.ts

import {AwilixContainer} from 'awilix'
import {faker} from '@faker-js/faker';
import {
    AbstractCartCompletionStrategy,
    CartService,
    CartType,
    CustomerService, IdempotencyKey, IdempotencyKeyService,
    LineItem,
    LineItemService,
    OrderService,
    ProductVariantService
} from "@medusajs/medusa";
import {CartCreateProps} from "@medusajs/medusa/dist/types/cart";
import {EntityManager} from "typeorm";
//
// const cart: CartCreateProps = {
//     customer_id: "",
//     billing_address: {
//         "company": "Andrianiaina",
//         "first_name": "Finaritra",
//         "last_name": "ANDRIANIAINA",
//         "address_1": "test",
//         "address_2": "test",
//         "city": "Antananarivo",
//         "country_code": "it",
//         "province": "test",
//         "postal_code": "ttest",
//         "phone": "034663925",
//         "metadata": null
//     },
//     email: "",
//     region_id: "",
//     context: {
//         "ip": "::1",
//         "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.60"
//     },
//     type: CartType.DEFAULT,
//     country_code: "",
//     discounts: [],
//     gift_cards: [],
//     metadata: {},
//     sales_channel_id: "",
//     shipping_address_id: "",
// }
/**
 *
 * @param container The container in which the registrations are made
 * @param config The options of the plugin or the entire config object
 */
export default async (container: AwilixContainer, config: Record<string, unknown>): Promise<void> => {
    /*
    const manager = container.resolve<EntityManager>('manager');
    const cartService = container.resolve<CartService>('cartService');
    const customerService = container.resolve<CustomerService>('customerService');
    const orderService = container.resolve<OrderService>('orderService');
    const lineItemService = container.resolve<LineItemService>('lineItemService');
    const productVariantService = container.resolve<ProductVariantService>('productVariantService');
    const allVariantId = await productVariantService.list({}, {select: ['id']})
    const idempotencyKeyService: IdempotencyKeyService = container.resolve(
        "idempotencyKeyService"
    )

    manager.transaction(async (eM) => {
        const ordersToFullfill = await orderService.list({}, {select: ['id','shipping_methods']});
        for (const ordersToFullfillElement of ordersToFullfill) {
            await orderService.withTransaction(eM).addShippingMethod(ordersToFullfillElement.id,'so_01HCD4BDSS64B676GBH2WVNG7N');
            await orderService.withTransaction(eM).capturePayment(ordersToFullfillElement.id);
            await orderService.withTransaction(eM).completeOrder(ordersToFullfillElement.id);
        }
    });*/
    /*
          const completionStrat: AbstractCartCompletionStrategy = container.resolve(
              "cartCompletionStrategy"
          )

          for (let i = 0; i < 5; i++) {
              manager.transaction(async (eM) => {
                  const newCustomer = await customerService
                      .withTransaction(eM)
                      .create({
                          email: faker.internet.email(),
                          metadata: {},
                          password: "supersecret",
                          first_name: faker.person.firstName(),
                          last_name: faker.person.lastName(),
                          has_account: true,
                          phone: faker.phone.number()
                      })
                  const newAddress = {
                      "company": faker.company.name(),
                      "first_name": newCustomer.first_name,
                      "last_name": newCustomer.last_name,
                      "address_1": faker.location.streetAddress({useFullAddress: true}),
                      "address_2": faker.location.secondaryAddress(),
                      "city": faker.location.city(),
                      "country_code": "it",
                      "province": faker.location.state(),
                      "postal_code": faker.location.zipCode(),
                      "phone": newCustomer.phone,
                      "metadata": {}
                  };
                  const newCart: CartCreateProps = {
                      customer_id: newCustomer.id,
                      billing_address: newAddress,
                      email: newCustomer.email,
                      region_id: "reg_01HCD4BDECNEDV3CT6609YWC4S",
                      context: {
                          "ip": "::1",
                          "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.60"
                      },
                      type: CartType.DEFAULT,
                      country_code: "",
                      discounts: [],
                      gift_cards: [],
                      metadata: {},
                      sales_channel_id: "sc_01HCD4810YXEB8AF33PR3DB5FS",
                      shipping_address: newAddress,
                  }
                  const createdCart = await cartService
                      .withTransaction(eM)
                      .create(newCart);
                  for (const el of faker.helpers.arrayElements(allVariantId, {min: 2, max: 8})) {
                      const toGenerate = {
                          variant_id: el.id,
                          region_id: "reg_01HCD4BDECNEDV3CT6609YWC4S",
                          quantity: faker.number.int({min: 1, max: 2}),
                          cartid: createdCart.id
                      }
                      const line = await lineItemService
                          .withTransaction(manager)
                          .generate(toGenerate.variant_id, toGenerate.region_id, toGenerate.quantity, {
                              customer_id: newCustomer.id,
                              metadata: {}
                          })
                      const newLineItem = await lineItemService.withTransaction(eM).create(line);
                      await cartService.withTransaction(eM).addOrUpdateLineItems(createdCart.id, newLineItem);
                  }
                  let idempotencyKey: IdempotencyKey
                  try {
                      idempotencyKey = await idempotencyKeyService
                          .withTransaction(eM)
                          .initializeRequest(faker.internet.ip(), "GET", {}, "/order")
                  } catch (error) {
                      console.log(error)
                      return
                  }
                  console.log(idempotencyKey);
                  await cartService.withTransaction(eM).setPaymentSessions(createdCart.id);
                  const {response_code, response_body} = await completionStrat.withTransaction(eM).complete(
                      createdCart.id,
                      idempotencyKey,
                      createdCart.context as any
                  )
                  console.log("finish",i);
              })
          }*/
    /*const productService = container.resolve<ProductService>('productService');
    const featuresService = container.resolve<FeaturesService>('featuresService');
    const manager = container.resolve<EntityManager>('manager');
    const lists = await productService.list({}, {select: ['id', 'title']});
    manager.transaction(async (eM) => {
        const queryRunner = manager.connection.createQueryRunner();
        await queryRunner.connect();

        for (const item of lists) {
            await queryRunner
                .query(`
                UPDATE features."product_features"
                SET  name_embeddings = $1
                WHERE "productId"= $2;
            `, [`[${await featuresService.createEmbedding(item.title)}]`, item.id])
        }
    });*/
}