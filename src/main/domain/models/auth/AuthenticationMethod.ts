export abstract class AuthenticationMethod {
  id: string
  accountId: string

  protected constructor(p: AuthenticationMethod) {
    this.id = p.id
    this.accountId = p.accountId
  }
}
