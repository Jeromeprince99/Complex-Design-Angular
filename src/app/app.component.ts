import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
declare var $: any;

const httpOptions = { 
  headers: new HttpHeaders({
    'Accept': 'application/json',
  }),
  responseType : 'text' as 'json'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit  {
  title = 'Frontend';
  display:boolean = false;
  file: File = null;
  embedCode:any="";
  notifno : number = 0;
  displayNotif : boolean = false;
  notifdata : Array<any> = [];
  storydata : Array<any> = [];
  duplicatestorydata : Array<any> = [];
  displaynewstorybtn : boolean = false;

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document,public dialog: MatDialog) {}

  ngOnInit() {
    this.document.body.style.zoom = "70%";
    var self = this;
    var socket = new WebSocket("ws://localhost:8000/wsnotif");
    socket.onmessage = function(e){
       ++self.notifno;
       self.displayNotif = true;
       var json_data = JSON.parse(e.data);
       self.notifdata.push(json_data['message']);
       self.duplicatestorydata.unshift(json_data['story']);
       self.displaynewstorybtn = true;
    }
    socket.onopen = function(e){
      console.log("open",e)
    }
    socket.onerror = function(e){
      console.log("error",e)
    }
    socket.onclose = function(e){
      console.log("close",e)
    }
    this.performGet();
    $(function () {
      $('[data-toggle="popover"]').popover({html:true})
    })
  }

  performGet(){
    this.storydata=[];
    const httpOptions1 = { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json,charset=utf-8'
      }),
    };
    return this.http.get<any>('http://127.0.0.1:8000/api/post/', httpOptions1).subscribe(
      (result:Array<any>) => {
        for(const data of result){
          console.log(data);
          this.storydata.unshift(data);
        }     
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log("Complete");
      }
    );
  }

  newstory(){
    this.displaynewstorybtn = false;
    this.storydata = this.clone(this.duplicatestorydata);
  }

  clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
    }
    return copy;
  }
 
  createStory():Observable<any>{
    this.performPost()
    return;
  }

  performPost(){
    let formData: FormData = new FormData();
    if(this.file){
      formData.append("image",this.file, this.file.name);
    }   
    formData.append("content",this.textareaValue);
    formData.append("video",this.embedCode);
    return this.http.post<any>('http://127.0.0.1:8000/api/post/', formData, httpOptions).subscribe(
            (result) => {
                let data = JSON.parse(result);
                var story={
                  "profile_name":"Dynamic",
                  "content": data['content'],
                  "time": data['time'],
                  "image": data['image'],
                  "video": data['video'],
                  "pk": data['pk']
                }
                console.log(story);
                this.storydata.unshift(story);
            },
            (error) => {
              console.log(error);
            },
            () => {
              console.log("Complete");
            }
          );
  }

  openDialog(ev): void {
    const dialogRef = this.dialog.open(VideoModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.embedCode = result;
      console.log(this.embedCode);
    });
  }

  textareaValue = '';
  doTextareaValueChange(ev) {
    try {
      this.textareaValue = ev.target.value;
    } catch(e) {
      console.info('could not set textarea-value');
    }
  }

  handleFileInput(files: FileList) {
    let fileItem = files.item(0);
    this.file = fileItem;
  }

  open(){
    this.display = true;  
    this.notifno = 1;
    this.displayNotif = false;
  }
  close(){
    this.display = false;
    this.notifdata  = [];
    this.displayNotif = true;
  }

  deletePost(story):Observable<any>{
    console.log(story);
    this.performDelete(story);
    return;
  }

  performDelete(story){
    return this.http.delete<any>('http://127.0.0.1:8000/api/post/'+story.pk+'/').subscribe(
            (result) => {
                  console.log('deleted');
                  this.performGet();
            },
            (error) => {
              console.log(error);
            },
            () => {
              console.log("Complete");
            }
          );
  } 

  ngOnDestroy(){
    this.storydata = [];
  }
}
