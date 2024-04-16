<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="https://unpkg.com/@commercetools-frontend/assets/logos/commercetools_primary-logo_horizontal_RGB.png">
  </a></br>
  <b>A Connector to demonstrate commercetools Connect in Developer courses</b>
</p>

## About & Scope

This Connector is to be used in developer training sessions only. It contains three applications:
1. a service app that validates if the customer is allowed to place the order
2. an event app that sends emails to the customers
3. a cleanup job app that manages the new arrivals category, adding new products and removing the products older than 30 days

![Sample Connector Diagram](docs/images/sample-connector.png "Sample Connector")

## Prerequisite

- commercetools Composable Commerce account
- API Credentials to your project

To create an API Client in the Merchant Center, go to Settings > Developer settings > Create new API client.
Take note of the following:
  - CTP_PROJECT_KEY
  - CTP_CLIENT_ID
  - CTP_CLIENT_SECRET


## How to Install

Deploy this demo Connector into any project to learn and experience how commercetools Connect makes integrations quick and easy. Follow the steps from the [commercetools connect deployment documentation](https://docs.commercetools.com/connect/concepts#deployments).

This Connector contains three applications, each of a different type.

### Customer blocked service app

It allows you to validate the order by checking if the customer is allowed to place the order.

Configurations:

1. API credentials to your project

### Order confirmation email event app

This event type app is triggered by the notification that is generated whenever a product is published. It adds the product to the new category if the product is less than a month old.

Configurations:

1. API credentials

### new-arrivals-category-job-app

This job runs every day and manages the products in the new arrivals category.

Configurations:

1. Category key for new arrivals
2. API credentials

## How to Uninstall

In order to uninstall the connector, either send a DELETE [using API](https://docs.commercetools.com/connect/deployments#delete-deployment) or simply [uninstall it from the Merchant Center](https://docs.commercetools.com/merchant-center/connect#uninstall-a-connector).