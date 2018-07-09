const express = require('express');
const router = express.Router({});

/**
 * GET request
 */
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling GET request to /products"
    })
});

/**
 * POST request
 */
router.post('/', (req, res, next) => {

});

/**
 * GET request
 */
router.get('/:productId', (req, res, next) => {
    let product_id = req.params.productId;
    if (product_id === 'productId') {
        res.status(200).json({
            message: "Handling get request to /products/productId",
            product_id: req.params.productId
        })
    } else {
        res.status(200).json({
            message: "You have not provided product id",
            product_id: parseInt(req.params.productId)
        })
    }
});

module.exports = router;