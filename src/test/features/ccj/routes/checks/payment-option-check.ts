import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import '../../../../routes/expectations'

import { Paths } from 'ccj/paths'

import { PaymentType } from 'ccj/form/models/ccjPaymentOption'

import * as idamServiceMock from '../../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

const externalId = claimStoreServiceMock.sampleClaimObj.externalId

export function checkPaymentOptionGuard (app: any, method: string, page: string, allowedPaymentType: PaymentType) {
  PaymentType.except(allowedPaymentType).forEach(paymentType => {
    it(`should redirect to payment options page when payment option is ${paymentType.displayValue.toLocaleLowerCase()}`, async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      claimStoreServiceMock.resolveRetrieveClaimByExternalId()
      draftStoreServiceMock.resolveFind('ccj', {
        paymentOption: {
          option: {
            value: paymentType.value,
            displayValue: paymentType.displayValue
          }
        }
      })

      await request(app)[method](page)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })))
    })
  })
}
