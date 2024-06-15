import { AuthenticationWorkflowService } from '../../../../../domain/services/workflows/auth/AuthenticationWorkflowService'
import { Injectable } from '@nestjs/common'
import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  namespace: 'api/v1/ws/dialogs',
  cors: {
    origin: '*'
  }
})
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server

  private clients: Map<string, Socket> = new Map()

  constructor(private readonly authenticationService: AuthenticationWorkflowService) {}

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const token = client.handshake.headers.bearer as string
    if (!token) {
      client.disconnect()
    }
    try {
      const account = await this.authenticationService.getConnectedAccount(token)
      this.clients.set(account.id, client)
    } catch {
      client.disconnect()
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    // Remove the client from the map on disconnect
    this.clients.forEach((value, key) => {
      if (value === client) {
        this.clients.delete(key)
      }
    })
  }

  @SubscribeMessage('private-message')
  async handlePrivateMessage(@MessageBody() data: string): Promise<void> {
    const parsedData = JSON.parse(data)
    const recipientSocket = this.clients.get(parsedData.recipient)
    if (recipientSocket) {
      recipientSocket.emit('private-message', {
        from: parsedData.sender,
        message: parsedData.message
      })
    }
  }
}
