import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'profile-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  
  avatarSelected: string = "";
  avatars: string[] = ["/assets/avatars/1.png", "/assets/avatars/2.png", "/assets/avatars/3.png", 
  "/assets/avatars/4.png", "/assets/avatars/5.png", "/assets/avatars/6.png", "/assets/avatars/7.png",
  "/assets/avatars/8.png"];
  constructor(
    public dialogRef: MatDialogRef<AvatarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    
  }

  cancel(): void {
    this.dialogRef.close();
  }

  selectAvatar(avatar: string) {
    this.avatarSelected = avatar;
  }

  save(): void {
    this.userService.changeAvatar(this.avatarSelected).subscribe(
      data => {
        this.toastr.success('Se ha guardado correctamente el nuevo avatar');
        this.dialogRef.close();
      },
      err => {
        this.toastr.error('Ha ocurrido un error al guardar el nuevo avatar');
      }
    );
  }

}