import { Request, Response } from 'express';
import { categories } from '../db/schema';
import { createQuote, createcategory, createconfigoption, deleteConfigOption, deleteQuote, getCategories, getCategoryById, getConfigoptionswithvalues, getConfigoptionswithvaluesbyproductid, getQuoteById, getQuotes, getconfigoptionbyproductid, getconfigoptions, updateCategory, updateQuote, updateconfigoption } from '../db';
import { deleteCategory } from '../db/index';
import Joi from 'joi';


const getSchema = Joi.object({
    id: Joi.number().integer().positive().required()
})


const createQuoteSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    dimensions: Joi.string().required(),
    canopyType: Joi.string().required(),
    rooffeature: Joi.string().required(),
    wallfeatures: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
        })
    ).required(),
    backside: Joi.string().required(),
    additionalfeatures: Joi.string().required(),
    installation: Joi.boolean().default(false),
})
const updateQuoteSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    dimensions: Joi.string().required(),
    canopyType: Joi.string().required(),
    rooffeature: Joi.string().required(),
    wallfeatures: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
        })
    ).required(),
    backside: Joi.string().required(),
    additionalfeatures: Joi.string().required(),
    installation: Joi.boolean().default(false),
})


export const retrievecquotes = async (req: Request, res: Response) => {
    try {

        const retrievedquotes = await getQuotes()
        return res.status(200).json(retrievedquotes).end()
    } catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end()
    }

}

export const retrievequote = async (req: Request, res: Response) => {
    try {
        const { error, value } = getSchema.validate(req.params, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const { id } = value;
        const retrievequote = await getQuoteById(parseInt(id))
        return res.status(200).json(retrievequote).end()
    } catch (e: any) {
        return res.status(500).json({
            error: e.message
        }).end()
    }

}



export const removequote = async (req: Request, res: Response) => {
    try {
        const { error, value } = getSchema.validate(req.params, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const { id } = value;
        await deleteQuote(parseInt(id))
        return res.status(204).end()
    } catch (e: any) {
        return res.status(500).json({
            error: e.message
        }).end()
    }

}



export const newquote = async (req: Request, res: Response) => {
    try {
        const { error, value } = createQuoteSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const createdquote = await createQuote(value)
        if (!createQuote) return res.status(400).json({
            error: "failed to create resource"
        }).end()
        return res.status(201).json({
            message: "success",
            data: createdquote
        }).end()
    } catch (error) {
        return res.status(500).json({
            error: error?.message
        }).end()
    }

}

export const updatequote= async (req: Request, res: Response) => {
    try {
        const { error, value } = updateQuoteSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const {
            id,
            name,
            email,
            phone,
            address,
            dimensions,
            canopyType,
            rooffeature,
            wallfeatures,

            backside,
            additionalfeatures,
            installation
        } = value


        const updatedquote = await updateQuote(parseInt(id), {
            name,
            email,
            phone,
            address,
            dimensions,
            canopyType,
            rooffeature,
            wallfeatures,

            backside,
            additionalfeatures,
            installation,

        })

        if (!updatedquote) return res.status(400).json({
            error: "failed to update resource or it does not exist"
        }).end()

        return res.status(201).json({
            message: "success",
            data: updatedquote
        }).end()
    } catch(e:any) {
        return res.status(500).json({
            error: e.message
        }).end()
    }

}