import * as ko from "knockout";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import * as ResponsiveKnockoutUtils from "ojs/ojresponsiveknockoututils";
import { whenDocumentReady } from "ojs/ojbootstrap";
import { FilePickerElement } from "ojs/ojfilepicker";
import "ojs/ojinputtext";
import "ojs/ojlabel";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojfilepicker";

class RootViewModel {
  smScreen: ko.Observable<boolean>;
  appName: ko.Observable<string>;
  textInput: ko.Observable<string>;
  isDisabled: ko.Observable<boolean>;
  file: ko.Observable<FileList>;

  constructor() {
    // media queries for repsonsive layouts
    let smQuery: string | null = ResponsiveUtils.getFrameworkQuery("sm-only");
    if (smQuery) {
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    }
    this.textInput = ko.observable('');
    this.isDisabled = ko.observable(false);
    this.file = ko.observable();
    // header

    // application Name used in Branding Area
    this.appName = ko.observable("Robotarium EIP Prototype Website");
  }

  public selectListener = (event: FilePickerElement.ojSelect) : void => {
    const files: FileList = event.detail.files;
    this.file(files);
  }

  public submitCode = async () : Promise<void> => {
    this.isDisabled(true);
    console.log(this.textInput());

    if (this.textInput() === '' || this.textInput() == null) {
      let body = {
        "code": this.textInput(),
      }
      let response: Response = await fetch('url', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          "content-type" : "application/json;charset=UTF-8",
          "access-control-allow-origin": "*"
        },
        body: JSON.stringify(body),
      })
    } else {
      const formData: FormData = new FormData();
      formData.append('myFile', this.file().item[0]);
  
      let response = await fetch('url', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          "content-type" : "application/json;charset=UTF-8",
          "access-control-allow-origin": "*"
        },
        body: formData,
      });
      let res = await response.json();
      console.log(res);
    }

    this.isDisabled(false);
  }

}

export default new RootViewModel();