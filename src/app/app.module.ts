import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClickOutsideDirectiveDirective } from './click-outside-directive.directive';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ClickOutsideDirectiveDirective,
    VideoModalComponent,
    SanitizeHtmlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule,
    NgbPopoverModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[
    VideoModalComponent
  ]
})
export class AppModule { }
