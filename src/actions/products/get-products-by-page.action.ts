import type { ProductWithImages } from '@/interfaces';
import { defineAction } from 'astro:actions';
import { count, db, eq, Product, ProductImage, sql } from 'astro:db';
import { z } from 'astro:schema';

export const getProductsByPage = defineAction({
    accept: "json",
    input: z.object({
        page: z.number().optional().default(1), // Default to page 1 if not provided
        limit: z.number().optional().default(12) // Default to 12 items per page
    }),
    handler: async ({ page, limit }) => {

        page = page <= 0 ? 1 : page; // Ensure page is at least 1

        const [totalRecords] = await db.select({ count: count() }).from(Product);
        const totalPages = Math.ceil(totalRecords.count / limit); // Calculate total pages

        if (page > totalPages) {
            return {
                products: [] as ProductWithImages[],
                totalPages: totalPages,
            }
        }

        const productsQuery = sql`
select a.*,
(select GROUP_CONCAT(image,',') from 
	(select * from ${ProductImage} where product = a.id limit 2)
) as images
from ${Product} a
LIMIT ${limit} OFFSET ${(page - 1) * limit};
`;

        const { rows } = await db.run(productsQuery);

        return {
            products: rows as unknown as ProductWithImages[],
            totalPages: totalPages,
        }
    }
});