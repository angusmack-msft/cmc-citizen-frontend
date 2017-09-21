export class PaymentSchedule {
  static readonly EACH_WEEK = new PaymentSchedule('EACH_WEEK', 'each week')
  static readonly EVERY_TWO_WEEKS = new PaymentSchedule('EVERY_TWO_WEEKS', 'every two weeks')
  static readonly EVERY_MONTH = new PaymentSchedule('EVERY_MONTH', 'every month')

  constructor (public readonly value: string, public readonly displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): PaymentSchedule[] {
    return [
      PaymentSchedule.EACH_WEEK,
      PaymentSchedule.EVERY_TWO_WEEKS,
      PaymentSchedule.EVERY_MONTH
    ]
  }
}