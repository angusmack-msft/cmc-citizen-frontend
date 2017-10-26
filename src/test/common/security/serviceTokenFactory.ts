/* tslint:disable:no-unused-expression */
delete require.cache[require.resolve('common/security/serviceTokenFactory')]

import * as chai from 'chai'
import * as spies from 'sinon-chai'
import * as sinon from 'sinon'

import { ServiceAuthTokenFactory } from 'common/security/serviceTokenFactory'
import ServiceAuthToken from 'idam/serviceAuthToken'
import IdamClient from 'idam/idamClient'

chai.use(spies)

const expect = chai.expect

const serviceAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImNtYyIsInN1YiI6ImNtYyJ9.Q9-gf315saUt007Gau0tBUxevcRwhEckLHzC82EVGIM' // valid until 1st Jan 2100

describe('ServiceAuthTokenFactory', () => {
  let retrieveServiceTokenFn

  beforeEach(() => {
    retrieveServiceTokenFn = sinon.stub(IdamClient, 'retrieveServiceToken')
      .onFirstCall().returns(new ServiceAuthToken(serviceAuthToken))
      .onSecondCall().throws('Unexpected error')
  })

  afterEach(() => {
    retrieveServiceTokenFn.restore()
  })

  it('should retrieve token from the API for the first time', async () => {
    expect(await ServiceAuthTokenFactory.get()).to.be.deep.equal(new ServiceAuthToken(serviceAuthToken))
    expect(retrieveServiceTokenFn).to.be.called
  })

  it('should retrieve token from the cache for the second time', async () => {
    expect(await ServiceAuthTokenFactory.get()).to.be.deep.equal(new ServiceAuthToken(serviceAuthToken))
    expect(retrieveServiceTokenFn).to.not.be.called
  })
})