import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuotationService } from './quotations.service';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from './quotations.guard';
import { UsersService } from '../users/users.service';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: `https://korpay-app.vercel.app`, // Permitir conexões de qualquer origem
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})
export class QuotationsGateway implements OnModuleInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, Socket>();

  constructor(
    private readonly quotationService: QuotationService,
    private readonly wsAuthGuard: WsAuthGuard,
    private readonly usersService: UsersService,
  ) {}

  onModuleInit() {
    this.startSendingUpdates();
  }

  async handleConnection(client: any) {
    try {
      const userEmail = await this.wsAuthGuard.canActivate(client);
      this.clients.set(userEmail, client);
    } catch (e) {
      if (e instanceof WsException) {
        client.emit('error', { message: e.message });
      }
      client.disconnect(true);
    }
  }

  async startSendingUpdates() {
    setInterval(async () => {
      const quotations = await this.quotationService.getLastQuotations();
      if (quotations !== null) {
        for (const [email, client] of this.clients.entries()) {
          const user = await this.usersService.getUserByEmail(email);
          if (!user) continue;

          const dataToSend = {
            quote_id: quotations.quote_id,
            fx_rate: parseFloat(quotations.fx_rate) * user.spread,
            expires_in: quotations.expires_in,
          };

          client.emit('quotationsUpdate', {
            msg: 'Quotations updated',
            data: dataToSend,
          });
        }
      }
    }, 5000);
  }
}
