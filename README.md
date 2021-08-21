# [![Tapestry-branding-logo](https://github.com/tapestry-pipeline/tapestry-cli/blob/main/front_end/app/build/static/media/tapestry_logo_color.c2bd66fd.png)][github]

[![shields.io npm version badge](https://img.shields.io/npm/v/tapestry-pipeline)][npm]
[![shields.io npm license badge](https://img.shields.io/npm/l/tapestry-pipeline)][npm]
[![shields.io custom website link badge](https://img.shields.io/static/v1?label=website&message=tapestry-pipeline.github.io&color=blue)][website]

## Overview

Tapestry is an open source orchestration framework for the deployment of user entity data pipelines. It allows users to easily configure and launch an end-to-end data pipeline hosted on Amazon Web Services. Our automated solution combines best-in-class tools to create a warehouse-centric data stack, offering built-in data ingestion, transformation, and newly emerging data syncing (also known as "reverse ETL") technologies. Our inclusion of a reverse ETL component solves the "last mile" problem by providing the ability to operationalize collected user data in near real time.

[Read our case study for more information about user data pipelines and to learn how we built Tapestry.](https://tapestry-pipeline.github.io)

## The Team

**[Katherine Beck](https://www.linkedin.com/in/katherine-murphy-beck-3849539/)** _Software Engineer_ Los Angeles, CA

**[Leah Garrison](https://www.linkedin.com/in/leahgarrison/)** _Software Engineer_ Atlanta, GA

**[Rick Molé](https://www.linkedin.com/in/rick-mole-8b756139/)** _Software Engineer_ New York, NY

**[Adam Peterson](https://www.linkedin.com/in/adam-peterson-211a1041/)** _Software Engineer_ Lexington, KY

---

## Table of Contents

- [Prerequisites](https://github.com/tapestry-pipeline/tapestry-cli#prerequisites)
- [Installing Tapestry](https://github.com/tapestry-pipeline/tapestry-cli#installing-tapestry)
- [Initialization](https://github.com/tapestry-pipeline/tapestry-cli#initialization)
- [Deploying a Tapestry Pipeline](https://github.com/tapestry-pipeline/tapestry-cli#deploying-a-tapestry-pipeline)
- [Management & Maintenance](https://github.com/tapestry-pipeline/tapestry-cli#management-&-maintenance)
- [Metrics](https://github.com/tapestry-pipeline/tapestry-cli#metrics)
- [Teardown](https://github.com/tapestry-pipeline/tapestry-cli#teardown)
- [Architecture](https://github.com/tapestry-pipeline/tapestry-cli#architecture)
- [Helpful Resources](https://github.com/tapestry-pipeline/tapestry-cli#helpful-resources)

---

## Prerequisites

- Node.js (v12+)
- NPM
- AWS Account
- AWS CLI configured locally
- Docker

You'll need to have the above accounts and tools before running any Tapestry commands. Being that Tapestry is an Node package, both Node.js and NPM must be installed on your machine. Tapestry also requires you to have an AWS account and the AWS CLI configured locally since it relies your local environment to spin up AWS resources. Finally, Tapestry uses Docker images and containers to run both the ingestion and syncing phases of your pipeline, and so you must have Docker installed and running on your machine.

---

## Installing Tapestry

```sh
npm i -g tapestry-pipeline
```

**Note:** With the exception of `init`, all Tapestry commands should be run from the root directory of your Tapestry project.

## Tapestry Commands

| Command                 | Description                                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tapestry init`         | Gathers project information and provision necessary project folders and template files.                                                                                |
| `tapestry deploy`       | Deploys a full data pipeline including Airbyte for ingestion and Grouparoo for syncing, both provisioned on AWS resources and connected to a Snowflake data warehouse. |
| `tapestry kickstart`    | Deploys the same pipeline as `deploy`, but also includes configuration for Zoom and Salesforce as Airbyte sources and Mailchimp as a Grouparoo destination.            |
| `tapestry start-server` | Launches Tapestry UI dashboard locally on port 7777.                                                                                                                   |
| `tapestry rebuild`      | Rebuilds local Grouparoo image and pushes that udpdated image to user's ECR repository, updating the Grouparoo Cloudformation stack in the process.                    |
| `tapestry teardown`     | Kills pipeline ingestion and syncing by tearing down most of the provisioned AWS resources.                                                                            |

---

## Initialization

The first command you want to run to setup your project is `init`.

### `tapestry init`

- Tapestry prompts you to give your project a name
- Tapestry provisions a project folder by the same name, as well as an AWS Cloudformation template for the setup and configuration of your Airbyte stack

---

## Deploying a Tapestry Pipeline

### Prerequisites:

- Snowflake Account (`deploy`/`kickstart`)
- Zoom Account (`kickstart`)
- Salesforce Account (`kickstart`)
- Mailchimp Account (`kickstart`)

You have a choice between two commands for the pipeline deployment process. The `deploy` command will configure and launch a full user data pipeline equipped with Airbyte for the ingestion tool, Snowflake as your data warehouse, Grouparoo as the syncing tool, and a number of AWS resources needed to host and connect these tools to complete the pipeline.

The `kickstart` command is similar in that it does everything deploy does, but it also configures two Airbyte sources (Zoom and Salesforce) and a Grouparoo destination (Mailchimp).

Regardless of which command you choose, note that a Snowflake account is required for both `deploy` and `kickstart`.

### `tapestry deploy`

- Tapestry prompts you for your Snowflake credentials
- AWS resources for ingestion phase (Airbyte) are provisioned
- Snowflake is configured as an Airbyte destination
- AWS resources for syncing phase (Grouparoo) are provisioned
- Snowflake is configured as a Grouparoo source

### `tapestry kickstart`

- Tapestry prompts you for your Snowflake credentials
- AWS resources for ingestion phase (Airbyte) are provisioned
- Snowflake is configured as an Airbyte destination
- Zoom and Salesforce are configured as Airbyte sources
- User is prompted to follow instructions for DBT setup found [here](DBT LINK HERE!)
- AWS resources for syncing phase (Grouparoo) are provisioned
- Snowflake is configured as a Grouparoo source
- Mailchimp is configured as a Grouparoo destination

---

## Management & Maintenance

### `tapestry start-server`

- Launches Tapestry dashboard UI

**Note:** Both `deploy` and `kickstart` will automatically launch your Tapestry dashboard upon successful deployment. Use `start-server` to launch your dashboard otherwise.

### `tapestry rebuild`

Specific to the syncing phase of the pipeline. While most updates to Airbyte can be done right in their UI, Grouparoo’s dashboard is mainly for application visibility and observance. In order to add, remove, or update any sources or destinations, changes need to be made to the configuration files in your local Grouparoo directory.

- Awaits confirmation from user for any changes made to configuration files
- Rebuilds Grouparoo Docker image locally
- Pushes local Grouparoo image to ECR
- Updated Cloudformation stack

---

## Metrics

Your Tapestry dashboard contains documentation for how to use Tapestry, along with various pages for each section of your pipeline: Data Ingestion, Data Storage & Data Transformation, and Data Syncing). Each page displays metrics that give you better insight into the health of each component, such as CPU utilization and instance health. They also include links to the UIs of all of the tools being used at each stage of the pipeline: Airbyte, Grouparoo, Snowflake, and DBT.

---

## Teardown

### `tapestry teardown`

- Most AWS resources for ingestion and syncing phases are completely torn down and deleted from your AWS account

**Note:** We say “most” AWS resources because we leave your S3 bucket and parameters in your Parameters Store intact so that you may retain access to this data even after your pipeline has been torn down.

---

## Tapestry Architecture

![Tapestry Architecture][architecture]

The above diagram shows the complete infrastructure of a Tapestry pipeline that is provisioned with `deploy`/`kickstart`. This specific diagram also shows the preconfigured sources and destinations that are configured in our `kickstart` command. For a deeper understanding of this architecture and what each piece is doing, please read our [case study](https://tapestry-pipeline.github.io).

---

## Helpful Resources

- [AWS CLI Setup](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
- [Tapestry Case Study](https://tapestry-pipeline.github.io)

[npm]: https://www.npmjs.com/package/tapestry-pipeline
[website]: https://tapestry-pipeline.github.io/
[github]: https://github.com/tapestry-pipeline
[architecture]: https://github.com/tapestry-pipeline/tapestry-pipeline.github.io/blob/main/assets/images/architecture/38_Tapestry_Final_Architecture_withheadings.png
