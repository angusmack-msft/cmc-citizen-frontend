import * as path from 'path'

import { Claim } from 'claims/models/claim'
import { PartyDetailsMapper } from 'app/pdf/mappers/partyDetailsMapper'
import { TheirDetailsMapper } from 'app/pdf/mappers/theirDetailsMapper'
import { ClaimMapper } from 'app/pdf/mappers/claimMapper'
import { NumberFormatter } from 'utils/numberFormatter'

const issueTemplatePath = path.join(__dirname, '..', '..', 'resources', 'pdf', 'issueReceipt.njk')

export class IssueReceipt {

  constructor (public claim: Claim) {
  }

  static get templatePath (): string {
    return issueTemplatePath
  }

  data (): object {
    return {
      claim: ClaimMapper.createClaimDetails(this.claim),
      totalClaimAmount: NumberFormatter.formatMoney(this.claim.totalAmountTillToday),
      claimant: PartyDetailsMapper.createPartyDetails(
        this.claim.claimData.claimant,
        this.claim.claimantEmail
      ),
      defendant: TheirDetailsMapper.createTheirDetails(
        this.claim.claimData.defendant,
        this.claim.claimData.defendant.email
      )
    }
  }
}
