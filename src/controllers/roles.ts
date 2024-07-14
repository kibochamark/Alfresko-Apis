import { createrole, deleterole, getrole, getroles, updaterole } from "db";
import express from "express";

export async function getRoles(req: express.Request, res: express.Response) {
    try {
        
        const roles = await getroles()

        return res.status(200).json(roles).end()

    } catch (err) {

        res.status(500).json({
            error: err?.message
        });
    }
}
export async function getRole(req: express.Request, res: express.Response) {
    const id = req.query.id as string;

    if(!id){
        return res.status(400).json({
            error:"id missing in query"
        }).end()
    }
    try {
        
        const role = await getrole(parseInt(id))

        return res.status(200).json(role).end()

    } catch (err) {

        res.status(500).json({
            error: err?.message
        });
    }
}

export async function deleteRole(req: express.Request, res: express.Response) {
    try {
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                error: "Id missing in query"
            });
        }

        await deleterole(parseInt(id))

        return res.status(204).json().end()

    } catch (err) {

        res.status(500).json({
            error: err?.message || "Failed to delete role"
        });
    }
}

export async function createRole(req: express.Request, res: express.Response) {
    const { name, description } = req.body;


    if (!name || !description) {
        return res.status(400).json({
            error: "Name or description missing in schema"
        }).end();
    }

    try {
        const role = await createrole({ name: name, description: description });
        if (!role) {
            return res.status(400).json({
                error: "failed to add role"
            }).end()
        }
        return res.status(201).json(role).end()
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to create role"
        }).end();
    }
}


export async function updateRole(req: express.Request, res: express.Response) {
    const { name, description } = req.body;
    const id = req.query.id as string

    if(!id){
        return res.status(400).json({
            error: "Id missing in query"
        }).end()
    }



    try {
        const role = await updaterole({ name: name, description: description }, parseInt(id));
        if (!role) {
            return res.status(400).json({
                error: "failed to update role"
            }).end()
        }
        return res.status(201).json(role).end()
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to update role"
        }).end();
    }
}