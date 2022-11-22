const express = require('express');

const routing = express.Router();
const control = require('../controller/control');

routing.post('/login', control.loginauth);
routing.post('/salesorder',control.addsalesorder);
routing.post('/receipt',control.addreceipt);
routing.get('/salesorder',control.getsalesorder);
routing.get('/receipt',control.getreceipt);
routing.get("/voucher/:user/:start/:end",control.getvoucher);

routing.all('*', control.invalid);

module.exports = routing;
