import express from 'express';
import { getPayloadFromToken } from '../utils/authenticationUtilities';
import { assignPermissionsToRole, createpermission, deletepermission, getpermission, updatepermission } from 'db';

export async function getPermission(req: express.Request, res: express.Response) {
    try {
        const {id} = req.body
        if(!id){
            return res.status(400).json({
                error: "Id missing in schema"
            });
        }

        const permission = await getpermission(parseInt(id))

        return res.status(200).json(permission).end()

    } catch (err) {

        res.status(500).json({
            error: err?.message || "Failed to create permission"
        });
    }
}

export async function deletePermission(req: express.Request, res: express.Response) {
    try {
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                error: "Id missing in query"
            });
        }

        await deletepermission(parseInt(id))

        return res.status(204).json().end()

    } catch (err) {

        res.status(500).json({
            error: err?.message || "Failed to delete permission"
        });
    }
}


export async function createPermission(req: express.Request, res: express.Response) {
    const { name, description } = req.body;


    if (!name || !description) {
        return res.status(400).json({
            error: "Name or description missing in schema"
        }).end();
    }

    try {
        const permission = await createpermission({ name: name, description: description });
        if (!permission) {
            return res.status(400).json({
                error: "failed to add permission"
            }).end()
        }
        return res.status(201).json(permission).end()
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to create permission"
        }).end();
    }
}

export async function updatePermission(req: express.Request, res: express.Response) {
    const { name, description } = req.body;
    const id = req.query.id as string

    if(!id){
        return res.status(400).json({
            error: "Id missing in query"
        }).end()
    }



    try {
        const permission = await updatepermission({ name: name, description: description }, parseInt(id));
        if (!permission) {
            return res.status(400).json({
                error: "failed to update permission"
            }).end()
        }
        return res.status(201).json(permission).end()
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to update permission"
        }).end();
    }
}


export async function assignpermissiontorole(req: express.Request, res: express.Response){
    const { roleId } = req.params;
    const { permissionIds } = req.body;

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({ error: 'permissionIds must be a non-empty array' });
    }

    try {
        await assignPermissionsToRole(parseInt(roleId), permissionIds);
        res.status(200).json({ message: 'Permissions assigned to role successfully' });
    } catch (error) {
        console.error('Error assigning permissions to role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};