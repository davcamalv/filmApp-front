import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Genre } from '../models/genre';
import { MediaContent } from '../models/mediaContent';
import { MediaContentService } from '../services/mediaContent.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private mediaContentService: MediaContentService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) { }

  name: string = "";
  username: string = "";
  email: string = "-";
  avatar: string = "/assets/avatars/1.png";
  birthDate: string = "-";
  genres: Genre[] = [];
  watchList: MediaContent[] = [];
  mediaContentPageNumber: number = 0;
  existsMediaContent = true;

  ngOnInit(): void {
    this.updateMediaContent();
    this.getProfile();
  }

  updateMediaContent(){
    this.mediaContentService.findMediaContentByUser({pageNumber:this.mediaContentPageNumber, pageSize:10}).subscribe(
      data => {
          if(data.length == 0){
            this.existsMediaContent = false;
          }
          this.watchList = this.watchList.concat(data);
          this.mediaContentPageNumber = this.mediaContentPageNumber + 1;
        },
      err => {
      }
    );
  }

  getProfile(){
    this.userService.getProfile().subscribe(
      data => {
          this.name = data.name;
          this.username = data.username;
          if(data.email != undefined) {
            this.email = data.email;
          }
          if(data.avatar != undefined) {
            this.avatar = data.avatar;
          }
          if(data.birthDate != undefined) {
            this.birthDate = data.birthDate;
          }
          this.genres = data.genres;
        },
      err => {
      }
    );
  }

}
