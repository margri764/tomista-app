import { CommonModule } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WebcamImage, WebcamInitError, WebcamModule, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-take-picture-modal',
  standalone: true,
  imports: [CommonModule, WebcamModule, MaterialModule],
  templateUrl: './take-picture-modal.component.html',
  styleUrl: './take-picture-modal.component.scss'
})
export class TakePictureModalComponent {

      // toggle webcam on/off
      public showWebcam = true;
      public allowCameraSwitch = true;
      public multipleWebcamsAvailable = false;
      public deviceId: string;
      public videoOptions: MediaTrackConstraints = {
        width: {ideal: 500},
        height: {ideal: 500}
      };
      public errors: WebcamInitError[] = [];
    
      // latest snapshot
      public webcamImage: WebcamImage;
    
      // webcam snapshot trigger
      private trigger: Subject<void> = new Subject<void>();
      // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
      private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
    

      constructor(
                     public dialogRef: MatDialogRef<TakePictureModalComponent>,

                  )
      {

      }
      
      public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
      }
    
      public get nextWebcamObservable(): Observable<boolean|string> {
        return this.nextWebcam.asObservable();
      }

      public triggerSnapshot(): void {
        this.trigger.next();
      }
    
      public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
      }
    
      public handleImage(webcamImage: WebcamImage): void {
        console.info('received webcam image', webcamImage);
        this.webcamImage = webcamImage;
        this.showWebcam = false;
        this.dialogRef.close(webcamImage.imageAsDataUrl);
      }
    
      // closeCamera() {
      //   this.showWebcam = false;
      // }

      // closeDialog(){
      //   this.dialogRef.close()
      // }
    
    

}
