import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    password: column.text(),
    createdAt: column.date({ default: new Date() }),
    role: column.text({ references: () => Role.columns.id }), // e.g., 'user', 'admin'
  }
})

const Role = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    name: column.text({ unique: true }), // e.g., 'user', 'admin'
  }
})

const Product = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    description: column.text(),
    gender: column.text(),
    price: column.number(),
    sizes: column.text(),
    slug: column.text({ unique: true }), // Unique slug for product URL
    stock: column.number(),
    tags: column.text(),
    title: column.text(),
    type: column.text(),

    user: column.text({ references: () => User.columns.id }), // Reference to User
  }
})

const ProductImage = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    image: column.text({ unique: true }), // Unique image URL or path 

    product: column.text({ references: () => Product.columns.id }), // Reference to Product
  }
})

export default defineDb({
  tables: {
    User,
    Role,
    Product,
    ProductImage,
  }
});
