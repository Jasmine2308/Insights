/*******************************************************************************
* Copyright 2019 Cognizant Technology Solutions
* 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
* use this file except in compliance with the License.  You may obtain a copy
* of the License at
* 
 *   http://www.apache.org/licenses/LICENSE-2.0
* 
 * Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
* License for the specific language governing permissions and limitations under
* the License.
******************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { DomSanitizer, BrowserModule, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { UserOnboardingService } from '@insights/app/modules/user-onboarding/user-onboarding-service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmationMessageDialog } from '@insights/app/modules/application-dialog/confirmation-message-dialog';
import { AddGroupMessageDialog } from '@insights/app/modules/user-onboarding/add-group-message-dialog';
import { MessageDialogService } from '@insights/app/modules/application-dialog/message-dialog-service';
import { DataSharedService } from '@insights/common/data-shared-service';
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-user-onboarding',
  templateUrl: './user-onboarding.component.html',
  styleUrls: ['./user-onboarding.component.css', './../home.module.css']
})
export class UserOnboardingComponent implements OnInit {

  mainContentMinHeightWoSbTab: string = 'min-height:' + (window.innerHeight - 146 - 48) + 'px';
  iframeStyleAdd = "{'height': 1500 +'px '+ '!important' }";
  userListUrl: SafeResourceUrl;
  framesize: any;
  adduserSaveEnable: boolean = false;
  showAddUserDetail: boolean = false;
  showThrobber: boolean = false;
  adminOrgDataArray = [];
  readOnlyOrg: boolean = false;
  userPropertyList = {};
  role: any;
  isEmailIncorrect: boolean = false;
  isNameIncorrect: boolean = false;
  isUsernameIncorrect: boolean = false;
  isPasswordIncorrect: boolean = false;
  isRoleIncorrect: boolean = false;
  isOrgIncorrect: boolean = false;
  selectedUser: any;
  oldSelectedUser: any;
  listFilter: any;
  searchValue: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //userDataSource: any = [];
  userDataSource = new MatTableDataSource<any>();
  MAX_ROWS_PER_TABLE = 10;
  displayedColumns = [];
  isbuttonenabled: boolean = false;
  isSaveEnable: boolean = false;
  showDetail: boolean = false;
  displayAccessGroupDetail: boolean = false;
  accessGroupName: String = "";
  grafanaUrl: String = "";
  showApplicationMessage: String = "";
  selectedAdminOrg: any;
  isSelectedUserId: any = -1;
  searchInput: any;
  usernamestore: any;
  regex = new RegExp("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$)")

  additionalProperties = ['name', 'email', 'username', 'password', 'role', 'org'];
  roleRecord = [
    { value: 'Editor', name: 'Editor' },
    { value: 'Admin', name: 'Admin' },
    { value: 'Viewer', name: 'Viewer' }
  ];

  constructor(private router: Router, private userOnboardingService: UserOnboardingService, private sanitizer: DomSanitizer,
    public dialog: MatDialog, public messageDialog: MessageDialogService, private dataShare: DataSharedService) {
    var self = this;


    this.framesize = window.frames.innerHeight;
    var orgId2 = this.dataShare.getStoragedProperty("orgId");

    var receiveMessage = function (evt) {
      var height = parseInt(evt.data);
      if (!isNaN(height)) {
        self.framesize = (evt.data + 20);
      }
    }
    window.addEventListener('message', receiveMessage, false);
    this.getApplicationDetail();
  }

  private newMethod() {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //console.log("In ngAfterViewInit")
    this.userDataSource.paginator = this.paginator;
  }

  async getApplicationDetail() {
    this.adminOrgDataArray = [];

    let adminOrgsResponse = await this.userOnboardingService.getCurrentUserOrgs();
    //console.log(adminOrgsResponse);
    if (adminOrgsResponse.data != undefined && adminOrgsResponse.status == "success") {
      var orgId2 = this.dataShare.getStoragedProperty("orgId");
      //console.log(" orgId2 === " + orgId2);
      for (var orgData of adminOrgsResponse.data) {
        //console.log(orgData)
        if ((orgData.role) === 'Admin') {
          this.adminOrgDataArray.push(orgData);
          if (orgId2 == orgData.orgId) {
            var record = orgData;
            //console.log("Selected === " + orgData);
            this.selectedAdminOrg = record;
          }
        }
      }
      this.isSaveEnable = false;
    }

    //console.log(this.selectedAdminOrg);
    this.loadUsersInfo(this.selectedAdminOrg);

  }

  loadUsersInfo(selectedAdminOrg) {
    //console.log(selectedAdminOrg);
    this.isSaveEnable = false;
    this.showThrobber = true;
    var self = this;
    self.userDataSource = new MatTableDataSource();
    this.userOnboardingService.getOrganizationUsers(selectedAdminOrg.orgId).then(function (usersResponseData) {
      if (usersResponseData.data != undefined && usersResponseData.status == "success") {
        //console.log(usersResponseData.data);
        self.showDetail = true;
        self.showThrobber = false;
        self.displayedColumns = ['radio', 'Login', 'Email', 'Seen', 'Role'];
        //console.log(usersResponseData.data);
        self.userDataSource.data = usersResponseData.data; //new MatTableDataSource( )
        self.userDataSource.paginator = self.paginator;
        //console.log(self.userDataSource);
        //console.log(self.userDataSource.data);
      } else {
        self.messageDialog.showApplicationsMessage("Unable to load data", "WARN");
      }
    });
  }

  statusEdit(element) {
    //console.log("After radio check " + JSON.stringify(element) + "" + this.isSaveEnable);
    if (element != undefined) {

      this.oldSelectedUser = this.selectedUser;

      if (this.isSaveEnable) {
        var title = "Cancel Changes";
        var dialogmessage = "Are you sure you want to discard your changes?";
        const dialogRef = this.messageDialog.showConfirmationMessage(title, dialogmessage, "", "ALERT", "30%");
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'yes') {
            this.selectedUser = undefined;
            this.isSelectedUserId = -1;
            this.loadUsersInfo(this.selectedAdminOrg);
          } else {
            this.selectedUser = this.oldSelectedUser;
          }
        });
      } else {
        this.isbuttonenabled = true;
      }
    }
  }


  clubProperties(jsonData, isArray) {
    if (isArray) {
      var length = jsonData.length;
      for (let i = 0; i < length; i++) {
        let propString = undefined;
        for (let key of Object.keys(jsonData[i])) {
          if (this.additionalProperties.indexOf(key) > -1) {
          } else {
            if (propString == undefined) {
              propString = key + " <b> : </b>" + jsonData[i][key];
            } else {
              propString += "" + "<br>" + key + " <b> : </b>" + jsonData[i][key];
            }
          }
        }
        jsonData[i]['propertiesString'] = propString;
      }
    } else {
      let propString = undefined;
      for (let key of Object.keys(jsonData)) {
        if (this.additionalProperties.indexOf(key) > -1) {
        } else {
          if (propString == undefined) {
            propString = key + " <b> : </b>" + jsonData[key];
          } else {
            propString += "" + "<br>" + key + " <b> : </b>" + jsonData[key];
          }
        }
      }
      jsonData['propertiesString'] = propString;
    }
    return jsonData;
  }





  saveUser(newName, email, username, pass) {
    this.isEmailIncorrect = false;
    this.isUsernameIncorrect = false;
    this.isPasswordIncorrect = false;
    this.isNameIncorrect = false;
    this.isRoleIncorrect = false;
    console.log(this.role);
    var userBMparameter;
    this.userPropertyList = {};
    //  this.userPropertyList = this.clubProperties(this.userPropertyList, false);

    this.userPropertyList['name'] = newName;
    this.userPropertyList['email'] = email;
    this.userPropertyList['username'] = username;
    this.userPropertyList['password'] = pass;
    this.userPropertyList['role'] = this.role;
    this.userPropertyList['org'] = this.selectedAdminOrg;
    //  console.log(this.userPropertyList)
    //console.log(this.selectedAdminOrg)
    userBMparameter = JSON.stringify(this.userPropertyList);

    //console.log(userBMparameter)
    var checkname = this.regex.test(email);
    if (!checkname) {
      this.isEmailIncorrect = true;
    }
    if (username == undefined) {
      this.isUsernameIncorrect = true;
    }
    if (pass == undefined) {
      this.isPasswordIncorrect = true;
    }
    if (newName == undefined) {
      this.isNameIncorrect = true;
    }
    if (this.role == undefined) {
      this.isRoleIncorrect = true;
    }
    if (!this.isRoleIncorrect && !this.isNameIncorrect && !this.isPasswordIncorrect && !this.isUsernameIncorrect && !this.isEmailIncorrect) {
      this.userOnboardingService.addUserInOrg(newName, email, username, this.role, this.selectedAdminOrg.orgId, this.selectedAdminOrg.name, pass)
        .subscribe(data => {
          //console.log(data)
          console.log(data.message)
          console.log(data)
          if (data.message == "User added to organization") {
            this.messageDialog.showApplicationsMessage("User has been added", "SUCCESS");
          }
          else if (data.message == " user exists in currrent org with same role " + this.role) {
            this.messageDialog.showApplicationsMessage("User exsits in org.", "ERROR");
          }
          else if (data.message == " user exists in currrent org with different  role Viewer" || " user exists in currrent org with different  role Admin" || " user exists in currrent org with different  role Editor") {

            var title = "ERROR";
            //  console.log(this.deleteRelation);
            var dialogmessage = data.message + ". Are you sure you want to update the role?"
            const dialogRef = this.messageDialog.showConfirmationMessage(title, dialogmessage, this.role, "ALERT", "40%");
            dialogRef.afterClosed().subscribe(result => {
              if (result == 'yes') {
                this.showDetail = true;
                this.showAddUserDetail = false;
                /*  let navigationExtras: NavigationExtras = {
                   skipLocationChange: true,
 
                 };
                 this.router.navigate(['InSights/Home/accessGroupManagement'], navigationExtras); */
              }

            })
            //this.messageDialog.showApplicationsMessage(data.message, "ERROR");

          }

          else if (data.message == "failed to create user") {
            this.messageDialog.showApplicationsMessage("Failed to create user.", "ERROR");
          }
          else if (data.message == "email already exists") {
            this.messageDialog.showApplicationsMessage("Email address already exists.", "ERROR");
          }
          else if (data.message == " username already exists") {
            this.messageDialog.showApplicationsMessage("Username already exists.", "ERROR");
          }
        })



    }

    // console.log(JSON.parse(userBMparameter))   // this.callEditOrSaveDataAPI(userBMparameter);



  }
  adduserenableSave() {
    this.adduserSaveEnable = true
  }


  searchData(searchUser) {
    var count = 0;
    console.log(this.userDataSource.data)
    for (var element of this.userDataSource.data) {
      var emailcheck = (element.email);
      var usernamecheck = element.login
      this.searchInput = searchUser
      console.log(searchUser)
      if (this.searchInput == emailcheck) {
        count = count + 1;
        break;

      }
      else if (this.searchInput == usernamecheck) {
        count = count + 1;
        break;

      }
    }
    if (count == 1) {
      var dialogmessage = " User already exists in " + "<b>" + this.selectedAdminOrg.name

      this.messageDialog.showApplicationsMessage(dialogmessage, "SUCCESS");
    }
    else {
      this.messageDialog.showApplicationsMessage("No User Found.", "ERROR");
    }
  }



  editUserData() {
    //console.log(this.selectedUser.userId);
    this.isSaveEnable = true;
    this.isSelectedUserId = this.selectedUser.userId;
  }

  deleteOrgUser() {
    //console.log("result " + this.selectedUser.login);
    if (this.selectedUser != undefined) {
      var self = this;
      var title = "Delete User";
      var dialogmessage = "Are you sure we want to delete this <b> " + this.selectedUser.login + " </b> user from organization ?";
      const dialogRef = self.messageDialog.showConfirmationMessage(title, dialogmessage, "", "ALERT", "30%");
      dialogRef.afterClosed().subscribe(result => {
        //console.log(result);
        if (result == 'yes') {
          self.userOnboardingService.deleteUserOrg(this.selectedUser.orgId, this.selectedUser.userId, this.selectedUser.role)
            .then(function (deleteResponse) {
              if (deleteResponse.message = "User removed from organization") {
                self.isSaveEnable = false;
                self.showApplicationMessage = deleteResponse.message;
                self.messageDialog.showApplicationsMessage(deleteResponse.message, "SUCCESS");
              } else {
                self.showApplicationMessage = "Unable to update user Data";
                self.messageDialog.showApplicationsMessage("Unable to Delete user Data", "WARN");
              }
            });
          self.loadUsersInfo(this.selectedAdminOrg);
        }
        this.loadUsersInfo(this.selectedAdminOrg);
      });
    }
  }

  async saveData() {
    console.log(this.selectedUser);
    //console.log(" Organization " + "  " + this.selectedAdminOrg)

    let editResponse = await this.userOnboardingService.editUserOrg(this.selectedUser.orgId, this.selectedUser.userId, this.selectedUser.role);
    if (editResponse.message = "Organization user updated") {
      this.isSaveEnable = false;
      this.showApplicationMessage = " Role of <b> " + this.selectedUser.login + " </b> have been updated successfully to <b> " + this.selectedUser.role + " </b> in <b> " + this.selectedAdminOrg.name + " </b>";
      this.messageDialog.showApplicationsMessage(this.showApplicationMessage, "SUCCESS");
    } else {
      this.showApplicationMessage = "Unable to update user Data";
      this.messageDialog.showApplicationsMessage(this.showApplicationMessage, "WARN");
    }
    this.selectedUser = undefined;
    this.isSelectedUserId = -1;
  }

  applyFilter(filterValue: string) {
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

  displayaccessGroupCreateField() {

    this.displayAccessGroupDetail = !this.displayAccessGroupDetail;
    if (this.accessGroupName != undefined) {
      var self = this;
      var isSessionExpired = this.dataShare.validateSession();
      if (!isSessionExpired) {
        const dialogRef = this.dialog.open(AddGroupMessageDialog, {
          panelClass: 'DialogBox',
          width: '50%',
          height: '50%',
          disableClose: true,
          data: {
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != undefined && result != 'no') { //'yes'
            self.userOnboardingService.createOrg(result)
              .then(function (createOrgResponse) {
                if (createOrgResponse.message = "Organization created") {
                  self.isSaveEnable = false;
                  self.showApplicationMessage = createOrgResponse.message;
                  self.messageDialog.showApplicationsMessage(createOrgResponse.message, "SUCCESS");
                } else {
                  self.showApplicationMessage = "Unable create Organization";
                  self.messageDialog.showApplicationsMessage("Unable to Create Organization", "WARN");
                }
              });
            self.loadUsersInfo(this.selectedAdminOrg);
            setTimeout(() => {
              self.showApplicationMessage = "";
            }, 2000);
          }
        });
      }
      setTimeout(() => {
        this.showApplicationMessage = "";
      }, 2000);
    }
  }
  addGlobalUser() {
    this.showAddUserDetail = true
    this.showDetail = false;
  }
}


