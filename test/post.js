/* jshint mocha:true */

require('should');
var request = require('supertest');
var loginTest = require('./common/login')();


describe('create account', function () {
    loginTest.register();
    loginTest.login();
    var agent = loginTest.agent;

});