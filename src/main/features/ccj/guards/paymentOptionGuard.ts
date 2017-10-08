import * as express from 'express'

import { Paths } from 'ccj/paths'

import { Draft } from 'models/draft'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { UUIDUtils } from 'common/utils/uuidUtils'

const logger = require('@hmcts/nodejs-logging').getLogger('claim/guards/allTasksCompletedGuard')

export class PaymentOptionGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const draft: Draft<DraftCCJ> = res.locals.user.ccjDraft

    if (!draft) {
      throw new Error('Draft is not available in response local variables')
    }

    if (!draft.document.paymentOption || !PaymentOptionGuard.isDetailsPageAvailable(req.path, draft.document.paymentOption.option)) {
      logger.warn('CCJ state guard: requested payment details page cannot be displayed for selected payment option' +
        ' - redirecting to payment option page')
      return res.redirect(Paths.paymentOptionsPage.evaluateUri({ externalId: UUIDUtils.extractFrom(req.path) }))
    }

    next()
  }

  private static isDetailsPageAvailable (path: string, paymentType: PaymentType): boolean {
    switch (paymentType) {
      case PaymentType.INSTALMENTS:
        return path === Paths.repaymentPlanPage.evaluateUri({ externalId: UUIDUtils.extractFrom(path) })
      case PaymentType.FULL_BY_SPECIFIED_DATE:
        return path === Paths.payBySetDatePage.evaluateUri({ externalId: UUIDUtils.extractFrom(path) })
      default:
        return false
    }
  }
}
