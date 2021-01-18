import Token from '../models/token';

export default {
    getTokens: async (req: any, res: any) => {
        const tokens = await Token.find({ownerId: req.user.sub}).exec();

        try {
            console.log(tokens);
            res.json(tokens);
        } catch (err) {
            console.log(err);
            res.error;
        }
    },

    createToken: async (req: any, res: any) => {
        const rToken = req.body.token;

        rToken.ownerId = req.user.sub;

        const nToken = new Token({...rToken});
        nToken.save();

        console.log(`New token "${rToken.name}" created.`);

        res.json(nToken);
    }
}