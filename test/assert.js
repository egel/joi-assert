'use strict';

var Joi = require('joi');
var assert = require('chai').assert;

var joiAssert = require('../index');

describe('assert', function () {

	describe('string', function () {

		describe('pass', function () {

			it('basic', function () {
				var schema = Joi.string();
				var input = 'abc';

				joiAssert(input, schema);
			});

			it('return valid', function () {
				var schema = Joi.string();
				var input = 'abc';

				var actual = joiAssert(input, schema);
				assert.strictEqual(actual, input);
			});
		});

		describe('error', function () {
			it('single basic', function () {
				var schema = Joi.string();
				var input = 123;

				assert.throws(function () {
					joiAssert(input, schema);
				}, 'string: value must be a string');
			});

			it('single message', function () {
				var schema = Joi.string();
				var input = 123;

				assert.throws(function () {
					joiAssert(input, schema, 'my test');
				}, 'my test: string: value must be a string');
			});
		});
	});

	describe('object', function () {

		describe('pass', function () {

			it('basic', function () {
				var schema = Joi.object({
					foo: Joi.string()
				});
				var input = {
					foo: 'abc'
				};

				joiAssert(input, schema);
			});

			it('return value', function () {
				var schema = Joi.object({
					foo: Joi.string()
				});
				var input = {
					foo: 'abc'
				};

				var actual = joiAssert(input, schema);
				assert.deepEqual(actual, input);
			});

			it('return stripped value', function () {
				var schema = Joi.object({
					foo: Joi.string()
				}).options({
					stripUnknown: true
				});
				var input = {
					foo: 'abc',
					bar: 123
				};
				var expected = {
					foo: 'abc'
				};

				var actual = joiAssert(input, schema);
				assert.deepEqual(actual, expected);
			});
		});

		describe('error', function () {
			it('single', function () {
				var schema = Joi.object({
					foo: Joi.string()
				});

				assert.throws(function () {
					joiAssert({
						foo: 123
					}, schema);
				}, 'object: foo must be a string');
			});

			it('single message', function () {
				var schema = Joi.object({
					foo: Joi.string()
				});

				assert.throws(function () {
					joiAssert({
						foo: 123
					}, schema, 'my test');
				}, 'my test: object: foo must be a string');
			});

			it('single described', function () {
				var schema = Joi.object({
					foo: Joi.string()
				}).description('hoge');

				assert.throws(function () {
					joiAssert({
						foo: 123
					}, schema);
				}, 'hoge: foo must be a string');
			});

			it('single deep described', function () {
				var schema = Joi.object({
					foo: Joi.object({
						buzz: Joi.string()
					})
				}).description('hoge');

				assert.throws(function () {
					joiAssert({
						foo: {
							buzz: 123
						}
					}, schema);
				}, 'hoge: [foo.buzz] buzz must be a string');
			});

			it('multi basic', function () {
				var schema = Joi.object({
					foo: Joi.string(),
					bar: Joi.string()
				}).options({
					abortEarly: false
				});

				assert.throws(function () {
					joiAssert({
						foo: 123,
						bar: 123
					}, schema);
				}, 'object(2) foo must be a string, bar must be a string');
			});

			it('multi message', function () {
				var schema = Joi.object({
					foo: Joi.string(),
					bar: Joi.string()
				}).options({
					abortEarly: false
				});

				assert.throws(function () {
					joiAssert({
						foo: 123,
						bar: 123
					}, schema, 'my test');
				}, 'my test: object(2) foo must be a string, bar must be a string');
			});

			it('multi described', function () {
				var schema = Joi.object({
					foo: Joi.string(),
					bar: Joi.string()
				}).options({
					abortEarly: false
				}).description('hoge');

				assert.throws(function () {
					joiAssert({
						foo: 123,
						bar: 123
					}, schema);
				}, 'hoge(2) foo must be a string, bar must be a string');
			});

			it('multi many', function () {
				var strReq = Joi.string().required();
				var schema = Joi.object({
					value0: strReq,
					value1: strReq,
					value2: strReq,
					value3: strReq,
					value4: strReq,
					value5: strReq,
					value6: strReq,
					value8: strReq,
					value9: strReq
				}).options({
					abortEarly: false
				}).description('hoge');

				assert.throws(function () {
					joiAssert({}, schema);
				}, 'hoge(9) value0 is required, value1 is required, value2 is required, value3 is required... (showing 4 of 9)');
			});
		});
	});
});
