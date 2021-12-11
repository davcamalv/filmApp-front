import { Component, OnInit } from '@angular/core';
import { Genre } from '../models/genre';
import { MediaContent } from '../models/mediaContent';
import { MediaContentService } from '../services/mediaContent.service';
import { UserService } from '../services/user.service';
import { GenreService } from '../services/genre.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AvatarComponent } from './avatar.component';
import {FormControl, Validators,AbstractControl } from '@angular/forms';
import { ProfileDetails } from '../models/user';

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
    private toastr: ToastrService,
    private dialog: MatDialog
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
  detailsButton = false;

  selectedGenres: number[] = [];
  fullGenreList: Genre[] = [];
  refreshMediaContent: boolean = true;

  nameFormControl = new FormControl('', { validators: [Validators.required] });
  emailFormControl = new FormControl('', { validators: [Validators.required, Validators.email] });
  birthDateFormControl = new FormControl('', { validators: [this.birthDateValidation()] });

  disabledDetailsSaveButton: boolean = false;

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

  openAvatarDialog(): void {
    if(this.dialog.openDialogs.length==0){
      let dialog = this.dialog.open(AvatarComponent, {
        width: '70%',
      });
      dialog.afterClosed().subscribe(()=>{
        this.getProfile();
      });
    };
  }

  abledDetailsSaveButton(): boolean{
    let valid: boolean = true;
    valid = valid && this.nameFormControl.valid;
    valid = valid && this.birthDateFormControl.valid;
    valid = valid && this.emailFormControl.valid;
    return !valid;
  }

  saveDetails(): void {
    let profileDetails: ProfileDetails = {name: this.nameFormControl.value, email: this.emailFormControl.value, birthDate: this.birthDateFormControl.value};
    this.userService.saveDetails(profileDetails).subscribe(
      data => {
        if(data.email != undefined){
          this.email = data.email;
        }else {
          this.email = "-";
        }
        this.name = data.name;
        if(data.birthDate != undefined){
          this.birthDate = data.birthDate;
        }else {
          this.birthDate = "-";
        }
        this.detailsButton =  false;
        this.toastr.success('Se han guardado correctamente los datos del perfil');
      },
      err => {
        this.toastr.error('Ha ocurrido un error al guardar los datos del perfil');
      }
    );
  }

  birthDateValidation() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      var actual = new Date();
      let res = control.value > actual ? { 'badBirthDateValidation': "La fecha de nacimiento debe ser anterior a la actual" } : null;
      return res;
    };
  }

  getErrorMessageEmail() : string{
    return this.emailFormControl.hasError('required')? "Debes introducir un email":
    this.emailFormControl.hasError('email') ? "El email no cumple con un formato correcto": '';
  }

  getErrorMessageName(): string{
    return this.nameFormControl.hasError('required')? "Debes introducir un nombre":"";
  }

  getErrorMessageBirthDate():string {
    return this.birthDateFormControl.hasError('badBirthDateValidation') ? "La fecha de nacimiento debe ser anterior a la actual":"";
  }
}
