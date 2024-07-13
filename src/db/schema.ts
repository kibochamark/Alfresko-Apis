
import { integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { InferModel, SQL, relations } from "drizzle-orm";

// Roles Table
export const roles = pgTable("roles", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

// Profiles Table
export const profiles = pgTable("profiles", {
    id: serial('id').primaryKey(),
    user_type: text('user_type').notNull(),
    name: text('name').notNull(),
    phone: varchar('phone'),
    address: text('address'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

// Users Table
export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    role_id: integer('role_id').references(() => roles.id).notNull(),
    profile_id: integer('profile_id').references(() => profiles.id).unique(),
    email: text('email').notNull().unique(),
    password: varchar('password').notNull(),
    salt: varchar('salt').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

// Permissions Table
export const permissions = pgTable("permissions", {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

// RefreshTokens Table
export const refreshTokens = pgTable("refresh_tokens", {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id).notNull(),
    token: text('token').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});


// RolePermissions Table
export const rolePermissions = pgTable("role_permissions", {
    role_id: integer('role_id').references(() => roles.id).notNull(),
    permission_id: integer('permission_id').references(() => permissions.id).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
    pk: primaryKey(table.role_id, table.permission_id)
}));

// Relations
export const userRelations = relations(users, ({ one, many }) => ({
    profile: one(profiles),
    role: one(roles),
    refreshTokens: many(refreshTokens)
}));

export const roleRelations = relations(roles, ({ many }) => ({
    role_permissions: many(rolePermissions),
    users: many(users)
}));

export const permissionRelations = relations(permissions, ({ many }) => ({
    role_permissions: many(rolePermissions)
}));

export const rolePermissionRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.role_id],
        references: [roles.id]
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permission_id],
        references: [permissions.id]
    })
}));


// export const posts = pgTable("posts", {
//     id: serial('id').primaryKey(),
//     title: text('title').notNull().unique(),
//     content: text('content').notNull(),
//     imagepath:varchar("imagepath"),
//     author_id: integer("author_id").references(() => users.id, { onDelete: "cascade" }),
//     slug: text("slug").notNull(),  // keep slug as a text field
//     created_at: timestamp("created_at").defaultNow(),
//     updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
// });

// export const postsRelations = relations(posts, ({ one, many }) => ({
//     author: one(users, {
//         fields: [posts.author_id],
//         references: [users.id],
//     }),
//     comments: many(comments),
//     categories: many(postsToCategories),
// }));

// export const comments = pgTable("comments", {
//     id: serial('id').primaryKey(),
//     post_id: integer("post_id").references(() => posts.id, { onDelete: "cascade" }),
//     author_id: integer("author_id").references(() => users.id, { onDelete: "cascade" }),
//     content: text("content"),
//     created_at: timestamp("created_at").defaultNow(),
//     updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
// });

// export const commentsRelations = relations(comments, ({ one }) => ({
//     post: one(posts, {
//         fields: [comments.post_id],
//         references: [posts.id],
//     }),
//     author: one(users, {
//         fields: [comments.author_id],
//         references: [users.id],
//     }),
// }));

// export const category = pgTable("category", {
//     id: serial('id').primaryKey(),
//     name: text('name').notNull().unique(),
//     slug: text("slug"),
//     created_at: timestamp("created_at").defaultNow(),
//     update_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
// });

// export const categoryRelation = relations(category, ({ many }) => ({
//     postCategories: many(postsToCategories),
// }));

// export const postsToCategories = pgTable(
//     'posts_to_categories',
//     {
//         post_id: integer('post_id').notNull().references(() => posts.id, { onDelete: "cascade" }),
//         category_id: integer('category_id').notNull().references(() => category.id, { onDelete: "cascade" }),
//     },
//     (t) => ({
//         pk: primaryKey({ columns: [t.post_id, t.category_id] }),
//     }),
// );


// export const postTocategoriesRelations = relations(postsToCategories, ({ one }) => ({
//   postCategories: one(posts, {
//     fields: [postsToCategories.post_id],
//     references: [posts.id],
//   }),
//   categories: one(category, {
//     fields: [postsToCategories.category_id],
//     references: [category.id],
//   }),
// }));

export type User = InferModel<typeof users>;
// Define Role type
export type Role = InferModel<typeof roles>;

// Define Profile type
export type Profile = InferModel<typeof profiles>;

// Define Permission type
export type Permission = InferModel<typeof permissions>;

// Define RolePermission type
export type RolePermission = InferModel<typeof rolePermissions>;

export type RefreshToken = InferModel<typeof refreshTokens>;

// export type Post = InferModel<typeof posts>;
// export type Comment = InferModel<typeof comments>;
// export type Category = InferModel<typeof category, 'insert'>;
// export type NewComment = InferModel<typeof comments, 'insert'>;
// export type NewPost = InferModel<typeof posts, 'insert'>;
// export type NewUser = InferModel<typeof users, 'insert'>;
// export type Postcategorytable = InferModel<typeof postsToCategories, 'insert'>;
