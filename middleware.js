function nameCase(req, res, next) {
    const upperName = req.body.name.toUpperCase();
    req.body.name = upperName;
    next();
}

module.exports = {
    nameCase,
}