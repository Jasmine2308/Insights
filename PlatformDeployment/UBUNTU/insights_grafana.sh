#-------------------------------------------------------------------------------
# Copyright 2017 Cognizant Technology Solutions
#   
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy
# of the License at
# 
#   http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.
#-------------------------------------------------------------------------------
# Install customized Grafana V4.6.2
echo "#################### Installing Grafana (running as BG process) with user creation ####################"
mkdir grafana-v4.6.2
cd grafana-v4.6.2
wget https://platform.cogdevops.com/insights_install/installationScripts/latest/RHEL/grafana/grafana-4.6.2.linux-x64.tar.gz
tar -zxvf grafana-4.6.2.linux-x64.tar.gz
wget https://platform.cogdevops.com/insights_install/installationScripts/latest/RHEL/grafana/ldap.toml
cp ldap.toml ./grafana-4.6.2/conf/ldap.toml
wget https://platform.cogdevops.com/insights_install/installationScripts/latest/RHEL/grafana/defaults.ini
cp defaults.ini ./grafana-4.6.2/conf/defaults.ini
cd grafana-4.6.2
nohup ./bin/grafana-server &
echo $! > grafana-pid.txt
sleep 10
curl -X POST -u admin:admin -H "Content-Type: application/json" -d '{"name":"PowerUser","email":"PowerUser@PowerUser.com","login":"PowerUser","password":"C0gnizant@1"}' http://localhost:3000/api/admin/users
sleep 10
cd ..
export GRAFANA_HOME=`pwd`
echo GRAFANA_HOME=`pwd` | tee -a /etc/environment
echo "export" GRAFANA_HOME=`pwd` | tee -a /etc/profile
sudo -E source /etc/environment
sudo -E source /etc/profile
