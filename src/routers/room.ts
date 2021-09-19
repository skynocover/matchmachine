import { Room, Client, updateLobby } from 'colyseus';
import { GameState } from '../state/gameState';

export class MyRoom extends Room {
  //the first method to be called when a room is instantiated.
  onCreate(options: any) {
    this.setState(new GameState());
    this.onMessage('type', (client, message) => {
      // handle "type" message
    });

    this.setMetadata({
      ownerName: options.ownerName,
      ownerPhoto: options.ownerPhoto,
      roomId: this.roomId,
    }).then(() => updateLobby(this));

    this.clock.setTimeout(() => {}, 1500);

    this.onMessage('send', (client, data) => {
      console.log('data: ', data);
      console.log('clientId: ', client.id);
      data.clientId = client.id;

      this.broadcast('message', data);
    });
  }

  // a new client connects to our game room
  onJoin(client: Client, options: any) {
    console.log(`client: ${client.sessionId} join`);
  }

  // whenever a client leaves, disconnect and reconnection logic is handled here
  onLeave(client: Client, consented: boolean) {
    console.log(`client: ${client.sessionId} leave`);
  }

  // the last method to be called right before a game room is disposed
  onDispose() {
    console.log(`roomid: ${this.roomId} is dispose`);
  }

  //   onAuth() {} // if uncommont it will use auth
}
