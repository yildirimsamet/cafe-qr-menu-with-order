import jwt from 'jsonwebtoken';

const auth = (role) => (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next();
    }

    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded) {
            req.user = decoded;

            const roleHierarchy = ['guest', 'waiter', 'admin'];

            if (role && roleHierarchy.indexOf(req.user.role) < roleHierarchy.indexOf(role)) {
                return res.status(403).json({ error: 'Forbidden: insufficient role' });
            }

        }

        return next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid token' });
    }
};

export default auth;

