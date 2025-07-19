import type { CartItem } from "@/interfaces";
import { defineAction } from "astro:actions";
import { eq, db, inArray, Product, ProductImage } from "astro:db";

export const loadProductsFromCart = defineAction({
  accept: "json",
  handler: async (_, { cookies }) => {
    const cart = JSON.parse(cookies.get("cart")?.value || "[]") as CartItem[];
    console.log("🚀 ~ handler: ~ cart:", cart);

    if (cart.length === 0) return [];

    // Load products
    const productIds = cart.map((item) => item.productId);

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.product))
      .where(inArray(Product.id, productIds));

    console.log("🚀 ~ handler: ~ dbProducts:", dbProducts);

    return cart.map((item) => {
      const dbProduct = dbProducts.find((p) => p.Product.id === item.productId);
      // Product not found
      if (!dbProduct)
        throw new Error(`Product wuth id ${item.productId} not found`);

      const { title, price, sizes, slug } = dbProduct.Product;
      const image = dbProduct.ProductImage.image;

      return {
        id: item.productId,
        title,
        price,
        slug,
        size: item.size,
        quantity: item.quantity,
        image: image.startsWith("http")
          ? image
          : `${import.meta.env.PUBLIC_URL}/images/products/${image}`,
      };
    });
  },
});
