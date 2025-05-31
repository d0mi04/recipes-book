const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('👉 Authorization header:', authHeader);

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: '🤷‍♀️ Authorization token is missing!',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // dane użytkownika z tokena: userId i email
        
        next();
    } catch (err) {
        return res.status(403).json({
            message: '❌ invalid token or token timeout!',
        });
    }
}

module.exports = verifyToken;