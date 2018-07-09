'use strict';

var express = require('express');
var router = express.Router({});

/**
 * GET request
 */
router.get('/', function (req, res, next) {
    res.status(200).json({
        message: "Handling GET request to /products"
    });
});

/**
 * POST request
 */
router.post('/', function (req, res, next) {
    res.status(200).json({
        message: "Handling POST request to /products"
    });
});

/**
 * GET request
 */
router.get('/:productId', function (req, res, next) {
    var product_id = req.params.productId;
    if (product_id === 'productId') {
        res.status(200).json({
            message: "Handling get request to /products/productId",
            product_id: req.params.productId
        });
    } else {
        res.status(200).json({
            message: "You have not provided product id",
            product_id: parseInt(req.params.productId)
        });
    }
});

module.exports = router;
//# sourceMappingURL=products.js.map