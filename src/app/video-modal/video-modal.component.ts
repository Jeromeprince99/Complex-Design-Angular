import { Component, OnInit  } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material/dialog'; 

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss']
})
export class VideoModalComponent implements OnInit {

  embedCode : any="";
  
  constructor(public dialogRef: MatDialogRef<VideoModalComponent>) {}
  
  ngOnInit() {
  }

  enterEmbedCode(ev) {
    try {
      this.embedCode = ev.target.value;
    } catch(e) {
      console.info('could not set textarea-value');
    }
  }

  submit():void{
    this.dialogRef.close(this.embedCode);
  }


}
