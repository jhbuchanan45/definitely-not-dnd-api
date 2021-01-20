import { isNamedExportBindings } from 'typescript';
import token from '../models/token';
import Token from '../models/token';

export default {
    get: async (req: any, res: any) => {
        
        try {
            const tokens = await Token.find({ ownerId: req.user.sub }).exec();
            console.log(tokens);
            res.json(tokens);
        } catch (err) {
            console.log(err);
            res.error;
        }
    },

    create: async (req: any, res: any) => {
        const rToken = req.body.token;

        rToken.ownerId = req.user.sub;

        try {
            const nToken = new Token({ ...rToken });
            nToken.save();

            console.log(`New token "${rToken.name}" created.`);

            res.json(nToken);
        } catch (error) {
            console.log(error);
            res.error;
        }
    },

    getById: async (req: any, res: any, next: any) => {
        const tokenID = req.params.tokenID;

        try {
            const token = await Token.findById(tokenID, (token) => token); 
            console.log(token);       
            res.json(token);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    update: async (req: any, res: any, next: any) => {
        const tokenID = req.params.tokenID;
        const eToken = req.body.token;

        Token.findByIdAndUpdate(tokenID, {...eToken}, {new: true}, (err, token) => {
            if (err) {
                console.log(err);
                next(err);
            } else {
                console.log("Updated token, ", token);
                res.json(token);
            }
        })
    },

    delete: async (req: any, res:any, next: any) => {
            const tokenID = req.params.tokenID;

            try {
                const token = await Token.findByIdAndDelete(tokenID, {}, (err, docs) => {
                    if (err){ 
                        console.log(err);
                        next(err);
                    } 
                    else { 
                        console.log("Deleted : ", docs); 
                        res.status(204).end("Deleted Token");
                    } 
                });

            } catch (error) {
                console.log(error);
                next(error);
            }
        }
}