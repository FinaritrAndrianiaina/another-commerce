import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import {Metadata} from "next"
import RecommendedProducts from "@modules/home/components/recommended-products";

export const metadata: Metadata = {
    title: "Home",
    description:
        "Shop all available models only at the ACME. Worldwide Shipping. Secure Payment.",
}

const Home = () => {
    return (
        <>
            <Hero/>
            <FeaturedProducts />
            <RecommendedProducts/>
        </>
    )
}

export default Home
