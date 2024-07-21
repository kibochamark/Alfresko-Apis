import { Request, Response } from 'express';
import db from '../utils/connection';
import { products, productImages, companyProducts, configurationOptions, configurationValues } from '../db/schema';
import { eq } from 'drizzle-orm';
import { retrieveproducts } from '../db';

// Define the fields to return for products
const productFields = {
    id: products.id,
    name: products.name,
    description: products.description,
    category_id: products.category_id,
    base_price: products.base_price,
    created_at: products.created_at,
    updated_at: products.updated_at,
};

// Define the fields to return for product images
const productImageFields = {
    id: productImages.id,
    product_id: productImages.product_id,
    image_type: productImages.image_type,
    image_url: productImages.image_url,
    created_at: productImages.created_at,
    updated_at: productImages.updated_at,
};

// Define the fields to return for configuration options
const configOptionFields = {
    id: configurationOptions.id,
    product_id: configurationOptions.product_id,
    option_name: configurationOptions.option_name,
    created_at: configurationOptions.created_at,
    updated_at: configurationOptions.updated_at,
};

// Define the fields to return for configuration values
const configValueFields = {
    id: configurationValues.id,
    option_id: configurationValues.option_id,
    value_name: configurationValues.value_name,
    price_adjustment: configurationValues.price_adjustment,
    created_at: configurationValues.created_at,
    updated_at: configurationValues.updated_at,
};

// Fetch all products with related images and configuration options
export const getAllProducts = async (_req: Request, res: Response) => {
    try {
        // const productsList = await db.select({
        //     ...productFields,
        //     images: db.select(productImageFields)
        //         .from(productImages)
        //         .where(eq(productImages.product_id, products.id)) as any, // Cast to any to resolve type issues
        //     configOptions: db.select({
        //         ...configOptionFields,
        //         values: db.select(configValueFields)
        //             .from(configurationValues)
        //             .where(eq(configurationValues.option_id, configurationOptions.id)) as any, // Cast to any to resolve type issues
        //     }).from(configurationOptions)
        //         .where(eq(configurationOptions.product_id, products.id)) as any // Cast to any to resolve type issues
        // }).from(products);
        const productsList = await retrieveproducts()

        res.status(200).json(productsList);
    } catch (error) {
        res.status(500).json({ message: 'Error getting products', error: error.message });
    }
};

// Fetch a product by ID with related images and configuration options
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await db.select({
            ...productFields,
            images: db.select(productImageFields)
                .from(productImages)
                .where(eq(productImages.product_id, Number(id))) as any, // Cast to any to resolve type issues
            configOptions: db.select({
                ...configOptionFields,
                values: db.select(configValueFields)
                    .from(configurationValues)
                    .where(eq(configurationValues.option_id, configurationOptions.id)) as any, // Cast to any to resolve type issues
            }).from(configurationOptions)
                .where(eq(configurationOptions.product_id, Number(id))) as any // Cast to any to resolve type issues
        }).from(products).where(eq(products.id, Number(id)));

        if (!product.length) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error getting product', error: error.message });
    }
};

// Fetch a product by company ID with related images and configuration options
export const getProductByCompanyId = async (req: Request, res: Response) => {
    try {
        const { companyId } = req.params;
        const product = await db.select({
            ...productFields,
            images: db.select(productImageFields)
                .from(productImages)
                .where(eq(productImages.product_id, products.id)) as any, // Cast to any to resolve type issues
            configOptions: db.select({
                ...configOptionFields,
                values: db.select(configValueFields)
                    .from(configurationValues)
                    .where(eq(configurationValues.option_id, configurationOptions.id)) as any, // Cast to any to resolve type issues
            }).from(configurationOptions)
                .where(eq(configurationOptions.product_id, products.id)) as any // Cast to any to resolve type issues
        }).from(products)
          .innerJoin(companyProducts, eq(products.id, companyProducts.product_id))
          .where(eq(companyProducts.company_id, Number(companyId)))
          .limit(1);

        if (!product.length) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error getting product', error: error.message });
    }
};

// Fetch all products by company ID with related images and configuration options
export const getAllProductsByCompanyId = async (req: Request, res: Response) => {
    try {
        const { companyId } = req.params;
        const productsList = await db.select({
            ...productFields,
            images: db.select(productImageFields)
                .from(productImages)
                .where(eq(productImages.product_id, products.id)) as any, // Cast to any to resolve type issues
            configOptions: db.select({
                ...configOptionFields,
                values: db.select(configValueFields)
                    .from(configurationValues)
                    .where(eq(configurationValues.option_id, configurationOptions.id)) as any, // Cast to any to resolve type issues
            }).from(configurationOptions)
                .where(eq(configurationOptions.product_id, products.id)) as any // Cast to any to resolve type issues
        }).from(products)
          .innerJoin(companyProducts, eq(products.id, companyProducts.product_id))
          .where(eq(companyProducts.company_id, Number(companyId)));

        res.status(200).json(productsList);
    } catch (error) {
        res.status(500).json({ message: 'Error getting products', error: error.message });
    }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, category_id, base_price } = req.body;
        const newProduct = await db.insert(products).values({ name, description, category_id, base_price }).returning(productFields);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Update a product by ID
export const updateProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedProduct = await db.update(products).set(req.body).where(eq(products.id, Number(id))).returning(productFields);
        if (!updatedProduct.length) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct[0]);
    } catch (error) {
        res.status  (500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product by ID
export const deleteProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedProduct = await db.delete(products).where(eq(products.id, Number(id))).returning(productFields);
        if (!deletedProduct.length) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted', deletedProduct: deletedProduct[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

// Add an image to a product
export const addProductImage = async (req: Request, res: Response) => {
    try {
        const { product_id, image_type, image_url } = req.body;
        const newImage = await db.insert(productImages).values({ product_id, image_type, image_url }).returning(productImageFields);
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: 'Error adding image', error: error.message });
    }
};
