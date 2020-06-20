import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
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
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  socketToggleBool : boolean = false;

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document,public dialog: MatDialog) {}

  ngOnInit() {
    /*var self = this;
    var socket = new WebSocket("ws://complex-design-django.herokuapp.com/wsnotif");
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
    }*/
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
    return this.http.get<any>('https://complex-design-django.herokuapp.com/api/post/', httpOptions1).subscribe(
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
    return this.http.post<any>('https://complex-design-django.herokuapp.com/api/post/', formData, httpOptions).subscribe(
            (result) => {
                let data = JSON.parse(result);
                var story={
                  "content": data['content'],
                  "time": data['time'],
                  "image": data['image'],
                  "video": data['video'],
                  "pk": data['pk']
                }
                console.log(story);
                this.storydata.unshift(story);
                this.file = null;
                this.embedCode = "";
                /*var ev={
                  "target":{
                    "value":''
                  }
                }
                this.doTextareaValueChange(ev)*/
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
    return this.http.delete<any>('https://complex-design-django.herokuapp.com/api/post/'+story.pk+'/').subscribe(
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

  socketToggle(){
    this.socketToggleBool = this.socketToggleBool == true? false : true;
    this.notifdata = [];
    this.notifno = 0;
    this.duplicatestorydata = [];
    this.displaynewstorybtn =false;


    var i = -1
    var j=-1
    var profile_name = [
        "Best bet",
        "Touch lap",
        "AI time",
        "Model lap",
        "Trending Apps",
        "Best Mobile",
        "Feature Phones",
        "Tablet World"
    ]
    var content=[
        "Foldable phones brought new fashion in smart phone industry. Buyers showing more interest in these devices that fits their pockets",
        "Touch screen laptops are amazing. Art work and photoshop work became flexible after the arrival of these laptop. Although their price are high its worth buying them",
        "Halli Labs, a Bangaluru based AI firm was acquired by Google recently. This is the only company acquired by google based on India.",
        "The new 2019 model gets you an attractive, slim chassis, great performance and powerful speakers. New to the latest Envy are a fingerprint sensor and a webcam kill switch for those who value their privacy.  ",
        "Apps have started a revolution, in that they have completely changed the way we use our smartphones. Both Apple's App Store and the Google Play store have over one million apps available for download and purchase.",
        "The iPhone 7 is still the most popular smartphone, despite losing 0.97% share since the start of the year. Overall, the landscape remains rather static",
        "Buy Basic Mobile - List of all feature phones with updated prices from all top brands.Compare basic mobiles by prices and features and choose the best model ",
        "Galaxy Tab S6 seamlessly syncs your Galaxy Smartphone, so you never miss a call when it comes in. It also allows you to reply to urgent text messages, so you're never out of the loop.",
    ]
    var data=["Hi, How are you?...",
    "I have scheduled you a...",
    "Nice to meet you...",
    "Urgent! Come in the main office",
    "Task assigned...",
    "Promotion applied...",
    "Amount credited...",
    "New challenges...",
    "Stay away from Corona...",
    "Wash your hands often..",
    "Task deadline reached...",
    "Welcome you onboard..."]
    var imageurls=[
    "https://boygeniusreport.files.wordpress.com/2019/02/screen-shot-2019-02-11-at-12.11.04-pm.png",
    "https://cdn.pixabay.com/photo/2014/05/02/21/49/home-office-336373_1280.jpg",
    "https://www.un.org/sites/un2.un.org/files/styles/large-article-image-style-16-9/public/field/image/azoulay.jpg?itok=9kVglYrd",
    "https://assets.pcmag.com/media/images/677293-hp-elitebook-dragonfly-01.jpg?thumb=y&width=600&height=600",
    "https://img.etimg.com/thumb/width-640,height-480,imgsize-268807,resizemode-1,msid-70533809/why-mobile-apps-require-access-to-your-dataand-device-tools.jpg",
    "https://www.askifa.ng/wp-content/uploads/2020/02/iphonexr.jpg",
    "https://www.beeindia.in/wp-content/uploads/2019/01/Best-Keypad-Phone-In-India-800x385.jpg",
    "https://sm.pcmag.com/t/pcmag_in/photo/k/keyboard/keyboard_qfm1.1080.jpg"]

    var x = setInterval(fn=>{
      if(!this.socketToggleBool) clearInterval(x);
      var n = Math.floor(Math.random() * 24) + 1;
      i = i+1
      i = i%12
      j = j+1
      j = j%8
      var notifData = {
                    "number":n,
                    "data":data[i]   
                  }   
      var storyData = { 
                    "profile_name":profile_name[j],
                    "time": n+' hrs',
                    "content":content[j],
                    "image":imageurls[j]
                  }
                  
      ++this.notifno;
      this.displayNotif = true;
      this.notifdata.push(notifData);
      this.duplicatestorydata.unshift(storyData);
      this.displaynewstorybtn = true;
    },5000)
            
  }

  ngOnDestroy(){
    this.storydata = [];
  }
}
