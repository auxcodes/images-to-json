import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserFieldComponent } from './shared/components/user-field/user-field.component';
import { UserFieldInputComponent } from './shared/components/user-field-input/user-field-input.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    UserFieldComponent,
    UserFieldInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
