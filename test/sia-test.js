// sia-test.js: test SiaWrapper functionality
const expect = require('chai').expect
const nock = require('nock')
const SiadWrapper = require('../js/sia.js')

// TODO: test SiadWrapper.start() process logic.

describe('apiCall tests', function() {
	this.timeout(10000)

	const testversion = { version: '0.5.1' }
	const testerror = { err: 'Test Error' }
	it('/daemon/version call works as expected', function(done) {
		nock('http://localhost:9980')
			.get('/daemon/version')
			.reply(200, testversion)

		SiadWrapper.call('/daemon/version', function(err, data) {
			expect(err).to.not.exist
			expect(data).to.deep.equal(testversion)
			expect(SiadWrapper.isRunning()).to.be.true
			done()
		})
	})
	it('isRunning works as expected', function(done) {
		nock('http://localhost:9980')
			.get('/daemon/version')
			.reply(200, testversion)

		SiadWrapper.ifRunning(function() { done() }, function() { expect.fail() })
	})
	it('statusCode error handling works as expected', function(done) {
		nock('http://localhost:9980')
			.get('/error')
			.reply(500, testerror)

		SiadWrapper.call('/error', function(err, data) {
			expect(err).to.deep.equal(testerror)
			expect(data).to.not.exist
			expect(SiadWrapper.isRunning()).to.be.true
			done()
		})
	}) 
	it('request error handling works as expected', function(done) {
		nock('http://localhost:9980')
			.get('/error')
			.replyWithError(testerror)

		SiadWrapper.call('/error', function(err, data) {
			expect(err).to.deep.equal(testerror)
			expect(data).to.not.exist
			expect(SiadWrapper.isRunning()).to.be.false
			done()
		})
	})
})