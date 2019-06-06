/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
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

/// <reference path="../../../_all.ts" />

module ISightApp {
    export interface IUserOnboardingService {
        getCurrentUserOrgs(): ng.IPromise<any>;
        switchUserOrg(orgId: number): ng.IPromise<any>;
        getGrafanaCurrentOrgAndRole(): ng.IPromise<any>;
        getGrafanaCurrentVersion(): ng.IPromise<any>;
    }

    export class UserOnboardingService implements IUserOnboardingService {
        static $inject = ['$q', '$resource', '$cookies', 'restCallHandlerService'];
        constructor(private $q: ng.IQService, private $resource, private $cookies, private restCallHandlerService: IRestCallHandlerService) {
        }

        getCurrentUserOrgs(): ng.IPromise<any> {
            var restHandler = this.restCallHandlerService;
            return restHandler.get("ACCESS_GROUP_MANAGEMENT_GET_CURRENT_USER_ORGS");
        }

        switchUserOrg(orgId: number): ng.IPromise<any> {
            var restHandler = this.restCallHandlerService;
            return restHandler.post("ACCESS_GROUP_MANAGEMENT_SWITCH_ORGS", { "orgId": orgId }, { 'Content-Type': 'application/x-www-form-urlencoded' });
        }

        getGrafanaCurrentOrgAndRole(): ng.IPromise<any> {
            var restHandler = this.restCallHandlerService;
            return restHandler.get("GRAPANA_CURRENT_ROLE_ORG");
        }

        getGrafanaCurrentVersion(): ng.IPromise<any> {
            var restHandler = this.restCallHandlerService;
            return restHandler.get("GET_GRAFANA_VERSION");
        }

    }
}