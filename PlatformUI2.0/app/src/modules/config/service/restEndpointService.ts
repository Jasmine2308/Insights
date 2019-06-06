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
	export interface IRestEndpointService {
		getServiceHost(): String;
		getelasticSearchServiceHost(): String;
		getNeo4jServiceHost(): String;
		getGrafanaHost(): String;
		getGrafanaHost1(): ng.IPromise<any>;
		getConfigDesc();
	}

	export class RestEndpointService implements IRestEndpointService {
		static $inject = ['$location', '$http', '$cookies', '$resource'];

		constructor(private $location, private $http, private $cookies, private $resource) {
			this.loadUiServiceLocation();	
			this.loadAgentConfigDesc();	
		}

		private loadUiServiceLocation(): void {
			var self = this;
			if (this.serviceHost) {
				this.serviceHost;
			} else {
				let self = this;
				let location = this.$location;
				let uiConfigJsonUrl: string = location.absUrl().replace(location.path(), "");
				if (uiConfigJsonUrl.length > uiConfigJsonUrl.lastIndexOf('/')) {
					uiConfigJsonUrl = uiConfigJsonUrl.substr(0, uiConfigJsonUrl.lastIndexOf('/'));
				}
				uiConfigJsonUrl += "/uiConfig.json"
				var configResource = this.$resource(uiConfigJsonUrl);
				var data = configResource.get().$promise.then(function (data) {
					self.serviceHost = data.serviceHost;
					self.elasticSearchServiceHost = data.elasticSearchServiceHost;
					self.neo4jServiceHost = data.neo4jServiceHost;
					self.grafanaHost = data.grafanaHost;					
				});
				//self.grafanaHost = self.getGrafanaHost();
			}
		}
		
		public loadAgentConfigDesc(): void {
			var self = this;
			let location = this.$location;
			let agentConfigJsonUrl: string = location.absUrl().replace(location.path(), "");
			if (agentConfigJsonUrl.length > agentConfigJsonUrl.lastIndexOf('/')) {
				agentConfigJsonUrl = agentConfigJsonUrl.substr(0, agentConfigJsonUrl.lastIndexOf('/'));
			}
			agentConfigJsonUrl += "/configDesc.json"
			var configResource = this.$resource(agentConfigJsonUrl);
			var data = configResource.get().$promise.then(function (data) {				
				 self.configDesc = data.desriptions;
			});					
			
		}		

		serviceHost: String;
		elasticSearchServiceHost: String;
		neo4jServiceHost: String;
		grafanaHost: String;
		configDesc= {};
				
		public getServiceHost(): String {
			if (!this.serviceHost) {
				this.serviceHost = this.$location.protocol() + "://" + this.$location.host() + ":" + this.$location.port();
			}
			return this.serviceHost;
		}
		
		public getConfigDesc() {				
			return this.configDesc;
		}		
		

		public getelasticSearchServiceHost(): String {
			if (!this.elasticSearchServiceHost) {
				this.elasticSearchServiceHost = this.$location.protocol() + "://" + this.$location.host() + ":9200";
			}
			return this.elasticSearchServiceHost;
		}

		public getNeo4jServiceHost(): String {
			if (!this.neo4jServiceHost) {
				this.neo4jServiceHost = this.$location.protocol() + "://" + this.$location.host() + ":7474";
			}
			return this.neo4jServiceHost;
		}

		public getGrafanaHost() : String {
            if (!this.grafanaHost) {
                this.grafanaHost = this.$location.protocol() + "://" + this.$location.host() + ":3000";
            }
            return this.grafanaHost;
        };		
		

		public getGrafanaHost1(): ng.IPromise<any> {
			var self = this;
			
				var authToken = this.$cookies.get('Authorization');
	            var defaultHeader = {
	                                    'Authorization': authToken
	                                  	                                    
	                                };
	            
				
       
			var restcallUrl = this.$location.protocol() + "://" + this.$location.host() + ":" + this.$location.port() + "/PlatformService/configure/grafanaEndPoint";
					  
			            var resource = self.$resource(restcallUrl,
			                {},
			                {
			                    allData: {
			                        method: 'GET',
			                        headers: defaultHeader
			                    }
			                });
			          return resource.allData().$promise;
			
			
		}
	}
}