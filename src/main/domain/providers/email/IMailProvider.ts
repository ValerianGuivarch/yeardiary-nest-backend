export interface IMailProvider {
  sendMail(p: { to: string[]; subject: string; html: string }): Promise<void>
}
