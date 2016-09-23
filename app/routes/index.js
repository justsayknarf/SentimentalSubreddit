'use strict';

var path = process.cwd();
var express = require("express");
var router = express.Router();

// root route
router.get("/", function(req, res){
	console.log("HIT INDEX ROUTE");
    res.sendFile(path + "/public/index.html");
});

module.exports = router;