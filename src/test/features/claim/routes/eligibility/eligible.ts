import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../../routes/hooks'
import '../../../../routes/expectations'
import { checkAuthorizationGuards } from '../checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../../main/app'

import * as idamServiceMock from '../../../../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim eligibility: eligible page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.eligibilityEligiblePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

      await request(app)
        .get(ClaimPaths.eligibilityEligiblePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('You can use this service'))
    })
  })
})
