/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import { mockReq as req, mockRes as res } from 'sinon-express-mock'

import { PaymentOptionGuard } from 'ccj/guards/paymentOptionGuard'
import { Paths } from 'ccj/paths'

import { Draft } from 'models/draft'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { RoutablePath } from 'common/router/routablePath'

chai.use(spies)
const expect = chai.expect

const externalId = '918ab71b-03db-410d-95b8-4e95c4b6d3f3'

describe('PaymentOptionGuard', () => {
  const next = (e?: any): void => {
    return void 0
  }

  beforeEach(() => {
    res.locals = {
      user: {
        ccjDraft: new Draft<DraftCCJ>(100, 'ccj', new DraftCCJ())
      }
    }
    res.redirect = sinon.spy((location: string): void => {
      return void 0
    })
  })

  function assertRedirectToPaymentOptionsPageWhenPaymentOptionDoesNotMatch (paymentType: PaymentType, path: RoutablePath) {
    PaymentType.except(paymentType).forEach(paymentType => {
      res.locals.user.ccjDraft.document.paymentOption.option = paymentType
      req.path = path.evaluateUri({ externalId: externalId })

      PaymentOptionGuard.requestHandler(req, res, next)
      expect(res.redirect).to.have.been.calledWith(Paths.paymentOptionsPage.evaluateUri({ externalId: externalId }))
    })
  }

  function assertPassToNextMiddlewareWhenPaymentOptionMatches (paymentType: PaymentType, path: RoutablePath) {
    res.locals.user.ccjDraft.document.paymentOption.option = paymentType
    req.path = path.evaluateUri({ externalId: externalId })

    const spy = sinon.spy(next)
    PaymentOptionGuard.requestHandler(req, res, spy)

    chai.expect(spy).to.have.been.called
  }

  it('should throw an exception when draft does not exist', () => {
    res.locals.user.ccjDraft = undefined

    expect(() => PaymentOptionGuard.requestHandler(req, res, next)).to.throw(Error, 'Draft is not available in response local variables')
  })

  it('should redirect to payment options page when details page cannot be displayed', () => {
    assertRedirectToPaymentOptionsPageWhenPaymentOptionDoesNotMatch(PaymentType.INSTALMENTS, Paths.repaymentPlanPage)
    assertRedirectToPaymentOptionsPageWhenPaymentOptionDoesNotMatch(PaymentType.FULL_BY_SPECIFIED_DATE, Paths.payBySetDatePage)
  })

  it('should pass to next middleware when details page can be displayed', () => {
    assertPassToNextMiddlewareWhenPaymentOptionMatches(PaymentType.INSTALMENTS, Paths.repaymentPlanPage)
    assertPassToNextMiddlewareWhenPaymentOptionMatches(PaymentType.FULL_BY_SPECIFIED_DATE, Paths.payBySetDatePage)
  })
})
