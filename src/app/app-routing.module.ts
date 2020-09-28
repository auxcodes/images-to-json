import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImagesToJsonComponent } from './pages/images-to-json/images-to-json.component';


const routes: Routes = [
  { path: '', component: ImagesToJsonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
