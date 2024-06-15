export class EmailToken {
  id: string
  accountId: string
  token: string
  expirationDate: Date
  createdDate: Date

  constructor(p: EmailToken) {
    this.id = p.id
    this.accountId = p.accountId
    this.token = p.token
    this.expirationDate = p.expirationDate
    this.createdDate = p.createdDate
  }

  static toEmailTokenToCreate(p: {
    accountId: string
    token: string
    expirationDate: Date
    createdDate: Date
  }): EmailTokenToCreate {
    return {
      accountId: p.accountId,
      token: p.token,
      expirationDate: p.expirationDate,
      createdDate: p.createdDate
    }
  }
}

export type EmailTokenToCreate = Omit<EmailToken, 'id'>
