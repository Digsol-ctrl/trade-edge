import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // attach minimal user info to request to avoid leaking password
            req.user = { id: user.id, name: user.name, email: user.email };
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }       
    }
    
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
}

export default protect;