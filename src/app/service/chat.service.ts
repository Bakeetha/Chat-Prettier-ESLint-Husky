import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
import { io, Socket } from 'socket.io-client';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: any;

  constructor() {
    // this.socket = io('http://localhost:3000'); // Assuming your Socket.IO server is running on localhost:3000

    this.socket = io('http://10.10.11.226:3000'); // Replace 'http://10.10.11.226:3000' with the IP address of your Node.js server
    // this.socket = io('http://<server-ip>:3000'); // Replace <server-ip> with the IP address or hostname of your Socket.IO server
    // this.socket = io('http://10.10.12.170:4200'); // Replace <server-ip> with the IP address or hostname of your Socket.IO server and <server-port> with the port it's listening on

    // Handle errors when subscribing to getMessage observable
    this.getMessage()
      .pipe(
        catchError((error) => {
          console.error('Error occurred in getMessage:', error);
          return throwError(error);
        }),
      )
      .subscribe((data: { sender: string; content: string }) => {
        console.log('Message received:', data);
      });
  }

  sendMessage(data: { sender: string; content: string }) {
    this.socket.emit('message', data);
  }
  sendFile(fileContent: ArrayBuffer) {
    // Emit an event to the server with the file content
    console.log('File received:', fileContent);
    this.socket.emit('file', fileContent);
  }
  getMessage(): Observable<{ sender: string; content: string }> {
    return new Observable<{ sender: string; content: string }>((observer) => {
      this.socket.on('message', (data: { sender: string; content: string }) => {
        observer.next(data);
      });
    });
  }
}

// sendMessage(message: { sender: string, text: string }) {
//   this.socket.emit('message', message);
// }

// getMessages(): Observable<any> {
//   return new Observable((observer) => {
//     this.socket.on('message', (data: any) => {
//       observer.next(data);
//     });
//   });
// }

// sendMessage(message: string) {
//   this.socket.emit('message', message);
// }

// getMessage(): Observable<string> {
//   return new Observable<string>(observer => {
//     this.socket.on('message', (data: string) => {
//       observer.next(data);
//     });
//   });
// }
