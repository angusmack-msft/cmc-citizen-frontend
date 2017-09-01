import { IsDefined, IsIn } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option'
}

export class PaymentType {
  static readonly IMMEDIATELY = new PaymentType('immediately')
  static readonly BY_INSTALMENTS = new PaymentType('instalments')
  static readonly FULL = new PaymentType('full')

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static all (): PaymentType[] {
    return [
      PaymentType.IMMEDIATELY,
      PaymentType.BY_INSTALMENTS,
      PaymentType.FULL
    ]
  }

  static valueOf (value: string): PaymentType {
    return PaymentType.all()
      .filter(type => type.value === value)
      .pop()
  }
}

export class CCJPaymentOption implements Serializable <CCJPaymentOption> {

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PaymentType.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: PaymentType

  constructor (option?: PaymentType) {
    this.option = option
  }

  static fromObject (value?: any): CCJPaymentOption {
    if (!value) {
      return value
    }
    if (value.option) {
      const option: PaymentType = PaymentType.valueOf(value.option)
      return new CCJPaymentOption(option)
    } else {
      return new CCJPaymentOption()
    }
  }

  deserialize (input?: any): CCJPaymentOption {
    if (input && input.option) {
      this.option = PaymentType.valueOf(input.option.value)
    }
    return this
  }
}