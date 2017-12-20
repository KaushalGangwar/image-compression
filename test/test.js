"use strict";
const chai = require("chai");
const assert  = chai.assert;
const describe = require('mocha').describe;
const users = require("../routes/users");
const supertest = require("supertest").agent("http://localhost:3012");
const authentication = require('../authentication/authenctication');
const patch = require('../routes/apply_path');

describe("Image Compression", () => {
    it("Generate access token of user", function() {
        return supertest
            .post("/login_user")
            .send({ user_id: "Hello", password: "123" })
            .then(res => {
                return assert.equal(res.body.success, true);
            });
    });

    it("Compress Image", () => {
        return supertest
            .post("/compress_image")
            .send({
                access_token:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMTIzNDU2IiwiaWF0IjoxNTEzODczNDIyfQ.SfhB-EsROMfd8sDo8jt8SY21MgfVnOZop-ndb740txc",
                url:
                    "https://upload.wikimedia.org/wikipedia/en/f/fc/Thor_poster.jpg"
            })
            .then(res => {
                return assert.equal(res.statusCode, 200);
            });
    });
    it("Validate Access Token", () => {
        return authentication.verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMTIzNDU2IiwiaWF0IjoxNTEzODczNDIyfQ.SfhB-EsROMfd8sDo8jt8SY21MgfVnOZop-ndb740txc").then(result => {
            assert.equal(result, undefined);
        }).catch(error => {
            assert.ifError(error);
        });
    })
    it("Apply Patch", () => {
        return supertest.post("/patch").send({
            access_token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMTIzNDU2IiwiaWF0IjoxNTEzODczNDIyfQ.SfhB-EsROMfd8sDo8jt8SY21MgfVnOZop-ndb740txc",
            obj : {"firstName":"Albert","contactDetails":{"phoneNumbers":[]}},
            patch_obj :  [{"op":"add","path":"/lastName","value":"Wester"},{"op":"add","path":"/contactDetails/phoneNumbers/0","value":{"number":"555-123"}}]
        }).then(res => {
            return assert.equal(res.body.success, true);
        }).catch(res => {
            return assert.equal(res.body.success, false);
        })

    });
    it("Generate Token", () => {
        return users.generateToken("kg", "12345").then(result => {
            return assert.isString(result)
        })
    });
});
