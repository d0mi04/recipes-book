const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: '🤷‍♀️ Authorization token is missing!',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // tu jest zapisanie danych użytkownika w req.user
        
        next();
    } catch (err) {
        return res.status(403).json({
            message: '❌ invalid token or token timeout!',
        });
    }
}

module.exports = authMiddleware;