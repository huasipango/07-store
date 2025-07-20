import { defineAction } from 'astro:actions';
import { db, eq, Product } from 'astro:db';
import { z } from 'astro:schema';
import { getSession } from 'auth-astro/server';
import { v4 as UUID } from "uuid";

const MAX_FILE_SIZE = 5_000_000; // 5 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/JPG", "image/webm"];

export const createUpdateProduct = defineAction({
    accept: "form",
    input: z.object({
        id: z.string().optional(),
        description: z.string(),
        gender: z.string(),
        price: z.number(),
        sizes: z.string(),
        slug: z.string(),
        stock: z.number(),
        tags: z.string(),
        title: z.string(),
        type: z.string(),
        imageFiles: z.array(
            z.instanceof(File)
                .refine(file => file.size <= MAX_FILE_SIZE, {
                    message: `File size must be less than ${MAX_FILE_SIZE / 1_000_000} MB`
                })
                .refine(file => {
                    console.log(file);

                    return ACCEPTED_IMAGE_TYPES.includes(file.type)
                }, `Accepted image types are: ${ACCEPTED_IMAGE_TYPES.join(", ")}`
                )
        ).optional(),
    }),
    handler: async (form, { request }) => {
        const session = await getSession(request);
        const user = session?.user;

        if (!user) {
            throw new Error("Unauthorized: User session not found.");
        }

        const { id = UUID(), imageFiles, ...rest } = form;
        rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

        const product = {
            id,
            user: user.id!,
            ...rest
        };

        if (!form.id) // Si no hay ID, es un nuevo producto
            await db.insert(Product).values(product);
        else
            await db.update(Product).set(product).where(eq(Product.id, id));

        console.log({ imageFiles });


        return product;
    }
});