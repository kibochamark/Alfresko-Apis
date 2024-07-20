import { Request, Response } from 'express';
import db from '../utils/connection';
import { products, productImages, companyProducts } from '../db/schema';
import { eq } from 'drizzle-orm';

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
    updated_at: productImages.updated_at
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

// Get a product by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await db.select(productFields).from(products).where(eq(products.id, Number(id)));
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const images = await db.select(productImageFields).from(productImages).where(eq(productImages.product_id, Number(id)));
        res.status(200).json({ ...product[0], images });
    } catch (error) {
        res.status(500).json({ message: 'Error getting product', error: error.message });
    }
};

// Update a product by ID
export const updateProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedProduct = await db.update(products).set(req.body).where(eq(products.id, Number(id))).returning(productFields);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product by ID
export const deleteProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedProduct = await db.delete(products).where(eq(products.id, Number(id))).returning(productFields);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted', deletedProduct });
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

// Get all products
export const getAllProducts = async (_req: Request, res: Response) => {
    try {
        const productsList = await db.select(productFields).from(products);
        res.status(200).json(productsList);
    } catch (error) {
        res.status(500).json({ message: 'Error getting products', error: error.message });
    }
};
