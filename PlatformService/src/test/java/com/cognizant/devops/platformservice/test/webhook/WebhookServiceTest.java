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
package com.cognizant.devops.platformservice.test.webhook;

import org.springframework.test.context.ContextConfiguration;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.cognizant.devops.platformcommons.exception.InsightsCustomException;
import com.cognizant.devops.platformservice.webhook.service.WebHookServiceImpl;

@Test
@ContextConfiguration(locations = { "classpath:spring-test-config.xml" })
public class WebhookServiceTest {
	public static final WebHookServiceImpl webhookServiceImp = new WebHookServiceImpl();
	public static final WebhookServiceTestData webhookTestData = new WebhookServiceTestData();

	@Test(priority = 1, expectedExceptions = InsightsCustomException.class)
	public void testsaveWebHookConfiguration() throws InsightsCustomException {
		Boolean webhookcheck = webhookServiceImp.saveWebHookConfiguration("git_webhook", webhookTestData.toolName,
				webhookTestData.labelDisplay, webhookTestData.dataformat, webhookTestData.mqchannel,
				webhookTestData.subscribestatus, webhookTestData.responseTemplate);
		Boolean expectedOutcome = true;
		Assert.assertEquals(webhookcheck, expectedOutcome);
	}

	@Test(priority = 2)
	public void testsaveWebHookConfigurationWithoutException() throws InsightsCustomException {
		Boolean webhookcheck = webhookServiceImp.saveWebHookConfiguration(webhookTestData.webhookname,
				webhookTestData.toolName, webhookTestData.labelDisplay, webhookTestData.dataformat,
				webhookTestData.mqchannel, webhookTestData.subscribestatus, webhookTestData.responseTemplate);
		Boolean expectedOutcome = true;
		Assert.assertEquals(webhookcheck, expectedOutcome);
	}

	@Test(priority = 3)
	public void testgetRegisteredWebHooks() throws InsightsCustomException {

		Assert.assertFalse(webhookServiceImp.getRegisteredWebHooks().isEmpty());
	}

	@Test(priority = 4)
	public void testupdateWebHookConfiguration() throws InsightsCustomException {

		Boolean webhookcheck = webhookServiceImp.updateWebHook(webhookTestData.webhookname, webhookTestData.toolName,
				webhookTestData.labelDisplay, webhookTestData.dataformat, webhookTestData.mqchannel,
				webhookTestData.subscribestatus, "head_commit.message=message,head_commit.timestamp=commitTime");
		Assert.assertTrue(webhookcheck);
	}

	@Test(priority = 5)
	public void testUninstallWebhook() throws InsightsCustomException {
		String expectedOutCome = "SUCCESS";
		String response = webhookServiceImp.uninstallWebhook(webhookTestData.webhookname);
		Assert.assertEquals(expectedOutCome, response);

	}

	@Test(priority = 6, expectedExceptions = InsightsCustomException.class)
	public void testUninstallWebhookForException() throws InsightsCustomException {
		String expectedOutCome = "No entity found for query";
		String response = webhookServiceImp.uninstallWebhook("12345fghj");
		Assert.assertEquals(expectedOutCome, response);
	}

}
