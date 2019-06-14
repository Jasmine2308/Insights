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
package com.cognizant.devops.platforminsights.core.job.config;

import java.io.Serializable;
import java.util.Map;

import com.cognizant.devops.platformcommons.core.enums.ExecutionActions;
import com.cognizant.devops.platformcommons.core.enums.JobSchedule;
import com.cognizant.devops.platforminsights.datamodel.Neo4jKPIDefinition;

public class Neo4jJobConfiguration implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 6358715096290467554L;
	//private KPIDefinition kpiDefinition; //Spark Elastic search doesn't seem to like nested custom object. 
	// private Map<String,String> kpiDefinition;
	Neo4jKPIDefinition kpiDefinition;
	private String id;
	private String name;
	private String schedule;
	private String nextRun;
	private Long lastRunTime;
	private boolean isActive; 
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getNextRun() {
		return nextRun;
	}
	public void setNextRun(String nextRun) {
		this.nextRun = nextRun;
	}
	public Long getLastRunTime() {
		return lastRunTime;
	}
	public void setLastRunTime(Long lastRunTime) {
		this.lastRunTime = lastRunTime;
	}
	public String getSchedule() {
		return schedule;
	}
	public void setSchedule(String schedule) {
		this.schedule = schedule;
	}
	public boolean isActive() {
		return isActive;
	}
	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public Neo4jKPIDefinition getKpiDefinition() {
		return kpiDefinition;
	}
	
	public void setKpiDefinition(Neo4jKPIDefinition kpiDefinition) {
		this.kpiDefinition = kpiDefinition;
	}
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "Neo4jJobConfiguration [kpiDefinition=" + kpiDefinition + ", id=" + id + ", name=" + name + ", schedule="
				+ schedule + ", nextRun=" + nextRun + ", lastRunTime=" + lastRunTime + ", isActive=" + isActive + "]";
	}
	
	/**
	 * Creating object from map to use it in application. 
	 * @param kpiDetails
	 * @return
	 */
	/*public Neo4jKPIDefinition getKpiDefinition(Map<String, String> kpiDetails) {
		Neo4jKPIDefinition kpiDef = new Neo4jKPIDefinition();
		kpiDef.setKpiID(Integer.valueOf(kpiDetails.get("kpiID")));
		kpiDef.setName(kpiDetails.get("name"));
		kpiDef.setExpectedTrend(kpiDetails.get("expectedTrend"));
		kpiDef.setAction(ExecutionActions.valueOf(kpiDetails.get("action")));
		kpiDef.setSchedule(JobSchedule.valueOf(kpiDetails.get("schedule")));
		kpiDef.setStartTimeField(kpiDetails.get("startTimeField"));
		kpiDef.setEndTimeField(kpiDetails.get("endTimeField"));
		kpiDef.setAggregatedResult(Boolean.valueOf(kpiDetails.get("aggregatedResult")));
		kpiDef.setTimeFormat(kpiDetails.get("timeFormat"));		
		kpiDef.setDurationField(kpiDetails.get("durationField"));
		kpiDef.setResultOutPutType(kpiDetails.get("resultOutPutType"));
		kpiDef.setComparisionKpi(Boolean.valueOf(kpiDetails.get("isComparisionKpi")));
		kpiDef.setGroupBy(Boolean.valueOf(kpiDetails.get("isGroupBy")));
		kpiDef.setGroupByFieldName(kpiDetails.get("groupByFieldName"));
		kpiDef.setGroupByField(kpiDetails.get("groupByField"));
		kpiDef.setAverageField(kpiDetails.get("averageField"));
		kpiDef.setSumCalculationField(kpiDetails.get("sumCalculationField"));
		kpiDef.setVector(kpiDetails.get("vector"));
		kpiDef.setToolName(kpiDetails.get("toolName"));
		kpiDef.setDbType(kpiDetails.get("dbType"));
		kpiDef.setDataQuery(kpiDetails.get("dataQuery"));
		kpiDef.setNeo4jQuery(kpiDetails.get("neo4jQuery"));
		kpiDef.setNeo4jLabel(kpiDetails.get("neo4jLabel"));
		
		return kpiDef;
	}*/
}
