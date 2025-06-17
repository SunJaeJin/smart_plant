const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰에서 JWT 추출

    if (token == null) return res.sendStatus(401); // 토큰이 없는 경우 401 Unauthorized 반환

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // 토큰 검증 실패 시 403 Forbidden 반환
        req.user = user; // 검증 성공 시 사용자 정보를 req.user에 저장
        next(); // 다음 미들웨어로 진행
    });
};

module.exports = { authenticateToken };