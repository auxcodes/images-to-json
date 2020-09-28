import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AceEditorModule } from 'ng2-ace-editor';

import { AppComponent } from './app.component';
import { UserFieldComponent } from './shared/components/user-field/user-field.component';
import { UserFieldInputComponent } from './shared/components/user-field-input/user-field-input.component';
import { OpenJsonFileComponent } from './shared/components/open-json-file/open-json-file.component';
import { FieldSettingsComponent } from './pages/field-settings/field-settings.component';
import { ImageSelectionComponent } from './pages/image-selection/image-selection.component';
import { ImagesToJsonComponent } from './pages/images-to-json/images-to-json.component';
import { JsonOutputComponent } from './pages/json-output/json-output.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFieldComponent,
    UserFieldInputComponent,
    OpenJsonFileComponent,
    FieldSettingsComponent,
    ImageSelectionComponent,
    ImagesToJsonComponent,
    JsonOutputComponent,
    HeaderComponent,
    FooterComponent
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
