var express = require('express');
var router = express.Router();

var chatController = require('../controllers/chatController');

/* GET chat. */
router.get('/', chatController.index);

module.exports = router;