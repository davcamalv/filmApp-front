import { Component, OnInit } from '@angular/core';
import { Genre } from '../models/genre';
import { MediaContent } from '../models/mediaContent';
import { MediaContentService } from '../services/mediaContent.service';
import { UserService } from '../services/user.service';
import { GenreService } from '../services/genre.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private mediaContentService: MediaContentService,
    private userService: UserService,
    private genreService: GenreService,
    private toastr: ToastrService
  ) { 
    toastr.toastrConfig.positionClass = "toast-bottom-right";
  }

  name: string = "";
  username: string = "";
  email: string = "-";
  avatar: string = "/assets/avatars/1.png";
  birthDate: string = "-";
  genres: Genre[] = [];
  watchList: MediaContent[] = [];
  mediaContentPageNumber: number = 0;
  existsMediaContent = true;
  genreButton = false;
  selectedGenres: number[] = [];
  fullGenreList: Genre[] = [];
  refreshMediaContent: boolean = true;

  ngOnInit(): void {
    this.updateMediaContent();
    this.getAllGenres();
    this.getProfile();
  }

  getDefaultGenresSelected(): void {
    this.genreButton = !this.genreButton; 
    this.selectedGenres = [];
    this.genres.forEach(genre => {
      this.selectedGenres.push(genre.id);
    });
  }
  updateMediaContent(): void {
    this.mediaContentService.findMediaContentByUser({pageNumber:this.mediaContentPageNumber, pageSize:10}).subscribe(
      data => {
        this.refreshMediaContent = true;
          if(data.length == 0){
            this.existsMediaContent = false;
          }
          this.watchList = this.watchList.concat(data);
          this.mediaContentPageNumber = this.mediaContentPageNumber + 1;
        },
      err => {
        this.refreshMediaContent = true;
      }
    );
  }

  scrollMediaContentOnBottom(){
    let toWatchList = document.getElementById("to-watch-list-scrollable");
    if(toWatchList != null && this.refreshMediaContent && toWatchList.scrollTop >= (toWatchList.scrollHeight * (1 - (1 / (this.watchList.length / 5)))) && this.existsMediaContent == true){
      this.refreshMediaContent = false;
      this.updateMediaContent();
    }
  }
  getProfile(): void {
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

  getAllGenres(): void {
    this.genreService.findAll().subscribe(
      data => {
          this.fullGenreList = data;
        },
      err => {
      }
    );
  }

  saveGenres(): void {
    this.userService.addGenresToPrincipal(Array.from(this.selectedGenres.values())).subscribe(
      data => {
        this.genres = data.genres;
        this.genreButton = !this.genreButton; 
        this.toastr.success('Se han guardado correctamente los géneros');
      },
      err => {
        this.toastr.error('Ha ocurrido un error al guardar los géneros');
      }
    );
  }

  deleteElementMediaContentList(mediaContent: MediaContent){
    this.mediaContentService.deleteElementMediaContentList(mediaContent.id).subscribe(
      data => {
        this.watchList.splice(this.watchList.indexOf(mediaContent), 1);
        this.toastr.success('Se ha eliminado "' + mediaContent.title + '" de la lista');
      },
      err => {
        this.toastr.error('Ha ocurrido un error al eliminar "' + mediaContent.title + '"');
      }
    );
  }
}
