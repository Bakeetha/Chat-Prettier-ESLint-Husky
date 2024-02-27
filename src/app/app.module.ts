import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from './service/chat.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AppComponent, ChatComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [ChatService],
  bootstrap: [AppComponent],
})
export class AppModule {}
