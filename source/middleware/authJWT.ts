const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.JWTSECRET
//ts-ignore
const authenticateJWT = (req: { headers: { authorization: any; }; user: any; }, res: { sendStatus: (arg0: number) => void; }, next: () => void) => {
    const authHeader: String = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT;