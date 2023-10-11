import {Router, Request, Response} from "express";
import customRouteHandler from "./custom-route-handler";
import {authenticateCustomer, requireCustomerAuthentication, wrapHandler} from "@medusajs/medusa";
import FeaturesService from "../../../services/features";

// Initialize a custom router
const router = Router();

export function attachStoreRoutes(storeRouter: Router) {
    // Attach our router to a custom path on the store router
    storeRouter.use("/custom", router);

    // Define a GET endpoint on the root route of our custom path
    router.get("/", wrapHandler(customRouteHandler));

    async function recommenderCustomerRouteHandler(req: Request, res: Response) {
        console.log('connected user', req.user)
        if (req.user && req.user.customer_id) {
            const id = req.user.customer_id;
            const featureService: FeaturesService = req.scope.resolve("featuresService");
            const results = await featureService.retrieveForCustomer(id);
            console.log(req.user.customer_id, results)
            res.status(200).json({
                recommended: results
            });
        } else {
            res.status(200).json({
                recommended: []
            })
        }
    }

    async function recommenderProductRouteHandler(req: Request, res: Response) {
        const id = req.params.id;

        const featureService: FeaturesService = req.scope.resolve("featuresService");
        console.log("request ok");
        const results = await featureService.retrieveForContent(id);
        console.log("results",results);
        res.status(200).json({
            recommended: results
        });
    }
    router.get("/recommended/product/:id", wrapHandler(recommenderProductRouteHandler));
    router.get("/recommended", authenticateCustomer(),wrapHandler(recommenderCustomerRouteHandler));
}
