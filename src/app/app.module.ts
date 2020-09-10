import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AceEditorModule } from 'ng2-ace-editor';

import { AppComponent } from './app.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserFieldComponent } from './shared/components/user-field/user-field.component';
import { UserFieldInputComponent } from './shared/components/user-field-input/user-field-input.component';
import { OpenJsonFileComponent } from './shared/components/open-json-file/open-json-file.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    UserFieldComponent,
    UserFieldInputComponent,
    OpenJsonFileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxJsonViewerModule,
    AceEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
