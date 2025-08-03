import { defineAction } from 'astro:actions';
import { db, eq, Product, ProductImage } from 'astro:db';
import { z } from 'astro:schema';

const newProduct = {
    id: "",
    description: "Nueva descripcion",
    gender: "men",
    price: 100,
    sizes: "XS,S,M",
    slug: "nuevo-producto",
    stock: 0,
    tags: "shirt,men,nuevo",
    title: "Nuevo Producto",
    type: "shirts",
}

export const getProductBySlug = defineAction({
    accept: "json",
    input: z.string(),
    handler: async (slug) => {

        if (slug === "new") {
            return {
                product: newProduct,
                images: [],
            }
        }

        const [product] = await db
            .select()
            .from(Product)
            .where(eq(Product.slug, slug));

        if (!product) {
            throw new Error(`Product with slug "${slug}" not found`);
        }

        const images = await db
            .select()
            .from(ProductImage)
            .where(eq(ProductImage.product, product.id));

        return {
            product,
            images: images, // Return the images associated with the product
        };
    }
});