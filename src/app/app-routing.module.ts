import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatGuardService } from './guards/chat-guard.service';
import { IndexComponent } from './index/index.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'chat', component: ChatComponent, canActivate: [ChatGuardService], data: { expectedRol: ['admin', 'user'] }},
  {path: 'profile', component: ProfileComponent, canActivate: [ChatGuardService], data: { expectedRol: ['admin', 'user'] }}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
