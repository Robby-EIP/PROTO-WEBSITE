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
  file1: any;

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
    console.log(files);
    this.file(files);
    this.file1 = event.detail.files;
    console.log(this.file())
  }

  public submitCode = async () : Promise<void> => {
    this.isDisabled(true);
    console.log(this.textInput());

    if (this.textInput() !== '' && this.textInput != null) {
      let body = {
        "code": this.textInput(),
      }
      let response: Response = await fetch('http://localhost:8000/push/rawcode', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          "Content-Type" : "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(body),
      });
      let res = await response.json();
      console.log(res);
      // alert(res);
    } else {
      const formData: FormData = new FormData();
      console.log('data ', this.file())
      console.log('data ', this.file().item)
      console.log('data ', this.file().item[0])
      console.log('data1 ', this.file1);
      console.log('data1 ', this.file1[0]);
      // formData.append('myFile', this.file().item[0]);
      formData.append('myFile', this.file1);
      let response = await fetch('http://localhost:8000/push/filecode', {
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