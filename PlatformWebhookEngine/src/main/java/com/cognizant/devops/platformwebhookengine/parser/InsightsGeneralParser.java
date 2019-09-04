/*******************************************************************************
 *  * Copyright 2017 Cognizant Technology Solutions
 *  * 
 *  * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  * use this file except in compliance with the License.  You may obtain a copy
 *  * of the License at
 *  * 
 *  *   http://www.apache.org/licenses/LICENSE-2.0
 *  * 
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 *  * License for the specific language governing permissions and limitations under
 *  * the License.
 *******************************************************************************/
package com.cognizant.devops.platformwebhookengine.parser;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.github.wnameless.json.flattener.JsonFlattener;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class InsightsGeneralParser implements InsightsWebhookParserInterface {
	private static Logger log = LogManager.getLogger(InsightsGeneralParser.class.getName());

	@Override 
	public List<JsonObject> parseToolData(String responseTemplate, String toolData,String toolName,String labelName,String webhookName) {

		try {
			String keyMqInitial;

			JsonParser parser = new JsonParser();
			List<JsonObject> retrunJsonList = new ArrayList<JsonObject>(0);
			Map<String, Object> finalJson = new HashMap<String, Object>();
			
			JsonElement json = (JsonElement) parser.parse(toolData);
			Map<String, Object> rabbitMqflattenedJsonMap = JsonFlattener.flattenAsMap(json.toString());
			
			Map<String, String> responseTemplateMap = getResponseTemplateMap(responseTemplate);
			
			for (Map.Entry<String, String> entry : responseTemplateMap.entrySet()) {
				keyMqInitial = entry.getKey();
				Object toolValue = rabbitMqflattenedJsonMap.get(keyMqInitial);
				finalJson.put(entry.getValue(), toolValue);
			}

			
			finalJson.put("source", "webhook");
			DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
			LocalDateTime now = LocalDateTime.now();
			finalJson.put("inSightsTimeX", dtf.format(now));
			finalJson.put("toolName", toolName);
			finalJson.put("webhookName", webhookName);
			finalJson.put("labelName", labelName);
			finalJson.put("insightsTime", ZonedDateTime.now().toInstant().toEpochMilli());
			Gson prettyGson = new GsonBuilder().setPrettyPrinting().create();
			String prettyJson = prettyGson.toJson(finalJson);
			JsonElement element = parser.parse(prettyJson);
			
			retrunJsonList.add(element.getAsJsonObject());

			return retrunJsonList;
		} catch (Exception e) {
			log.error(e);
			throw e;
		}
	}

	private Map<String, String> getResponseTemplateMap(String responseTemplate) {

		Map<String, String> responseTemplateMap = new HashMap<>();
		String value = responseTemplate.replace("\n", "");
		String[] keyValuePairs = value.split(","); // split the string to creat key-value pairs
		for (String pair : keyValuePairs) // iterate over the pairs
		{
			String[] dataKeyMapper = pair.split("="); // split the pairs to get key and value
			responseTemplateMap.put(dataKeyMapper[0], dataKeyMapper[1]);
		}
		return responseTemplateMap;
	}

}