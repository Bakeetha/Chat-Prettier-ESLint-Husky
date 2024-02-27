import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChatService } from 'src/app/service/chat.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  // messages: { sender: string, text: string }[] = [];
  // newMessage: string = '';
  // message: string = '';
  // messages: string[] = [];
  message = '';
  messages: { sender: string; content: string }[] = [];
  currentPort: any;
  currentUserID: any;
  messageForm!: FormGroup;
  // constructor(private chatService: ChatService) { }
  // constructor(private chatService: ChatService) {
  //   this.chatService.getMessage().subscribe((message: string) => {
  //     this.messages.push(message);
  //   });
  // }

  constructor(
    private chatService: ChatService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.chatService
      .getMessage()
      .subscribe((data: { sender: string; content: string }) => {
        this.messages.push(data);
      });
  }
  ngOnInit(): void {
    // this.chatService.getMessages().subscribe((message: { sender: string, text: string }) => {
    //   this.messages.push(message);
    //   console.log('messages',this.messages);
    // });
    this.messageForm = this.formBuilder.group({
      message: [''], // You can add validators here
    });
    // Generate a unique ID for the current user
    this.currentUserID = uuidv4();

    console.log('this.currentUserID', this.currentUserID);
  }
  @ViewChild('containerBody') containerBody!: ElementRef;

  // ngAfterViewInit() {
  //   // Scroll to the bottom when the component is initialized
  //   this.scrollToBottom();
  // }

  ngAfterViewChecked() {
    // Scroll to the bottom in each view check (whenever there are changes in the view)
    this.scrollToBottom();
  }
  // Call this method whenever new messages are added
  // scrollToBottom() {
  //   if (this.containerBody) {
  //     this.containerBody.nativeElement.scrollTop = this.containerBody.nativeElement.scrollHeight;
  //   }
  // }

  scrollToBottom() {
    try {
      this.containerBody.nativeElement.scrollTop =
        this.containerBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
  // Method to check if the message content is an image
  isImage(message: { content: string }): boolean {
    return message.content.startsWith('data:image');
  }

  // Method to handle file selection
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      // Convert the selected file to a data URL and send it as a message
      this.readFileAsDataURL(file).then(dataUrl => {
        this.sendMessage(dataUrl);
      });
    }
  }

  // Method to sanitize the base64-encoded string and display the image in the chat
  sanitizeImage(base64Data: string): SafeUrl {
    // Prepend the data URL prefix to create a valid data URL for the image
    const imageUrl = `data:image/jpeg;base64,${base64Data}`;
    // Sanitize the data URL to prevent security risks
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  // Method to read file as data URL
  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          resolve(event.target.result as string);
        } else {
          reject('Failed to read file.');
        }
      };
      reader.onerror = () => {
        reject('Failed to read file.');
      };
      reader.readAsDataURL(file);
    });
  }

  // sendMessage() {
  //   if (this.message.trim() !== '') {
  //     // const senderId = window.location.port; // Get the port number of the current instance
  //     // this.currentPort = window.location.port;
  //     const senderId = this.currentUserID; // Get the port number of the current instance
  //     this.currentPort = this.currentUserID;
  //     this.chatService.sendMessage({ sender: senderId, content: this.message });
  //     this.message = '';
  //     console.log('this.currentUserID', this.currentUserID);

  //     this.cdRef.detectChanges();
  //     // After adding a new message, scroll to the bottom
  //     setTimeout(() => {
  //       this.scrollToBottom();
  //     }, 0); // Use setTimeout to ensure that scrolling occurs after the new message is added
  //   }
  // }
  // Function to send message
  //  sendMessage() {
  //   const message = this.messageForm.get('message').value;
  //   // Add your logic to send the message
  //   console.log(message);
  // }
  // Method to send a message
  sendMessage(messageContent: string | ArrayBuffer): void {
    if (messageContent && typeof messageContent === 'string') {
      // If messageContent is a string, it's a regular message
      if (messageContent.trim() !== '') {
        const senderId = this.currentUserID;
        this.currentPort = this.currentUserID;
        this.chatService.sendMessage({
          sender: senderId,
          content: messageContent,
        });
        this.message = '';
        console.log('this.currentUserID', this.currentUserID);

        this.cdRef.detectChanges();
        // After adding a new message, scroll to the bottom
        setTimeout(() => {
          this.scrollToBottom();
        }, 0); // Use setTimeout to ensure that scrolling occurs after the new message is added
      }
    } else if (messageContent instanceof ArrayBuffer) {
      // If messageContent is an ArrayBuffer, it's a file
      // You can handle sending files here
      this.chatService.sendFile(messageContent);
    }
  }
}

// sendMessage() {
//   if (this.message.trim() !== '') {
//     this.chatService.sendMessage(this.message);
//     this.message = '';
//   }
// }
// sendMessage() {
//   if (this.newMessage.trim() !== '') {
//     this.chatService.sendMessage({ sender: 'Me', text: this.newMessage });
//     this.newMessage = '';
//     console.log('this.newMessage',this.newMessage);
//   }
// }

// sendMessage() {
//   if (this.message.trim() !== '') {
//     this.chatService.sendMessage({ sender: 'Me', content: this.message });
//     // this.messages.push({ sender: 'Me', content: this.message }); // Display the message instantly on the sender's side
//     this.message = '';
//   }
// }
