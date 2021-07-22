# ask for all the parameters needed to connect to snowflake/Mailchimp

MAILCHIMP_API_KEY = $(shell bash -c 'read -s -p "Mailchimp API Key: " mailchimpkey; echo $$mailchimpkey')
MAILCHIMP_LIST_ID = $(shell bash -c 'read -s -p "Mailchimp List ID: " mailchimplist; echo $$mailchimplist')
#SNOWFLAKE_ACCOUNT = $(shell bash -c 'read -s -p "Snowflake Account: " snowflakeaccount; echo $$snowflakeaccount')
#SNOWFLAKE_USERNAME = $(shell bash -c 'read -s -p "Snowflake Username: " snowflakeuser; echo $$snowflakeuser')
#SNOWFLAKE_PASSWORD = $(shell bash -c 'read -s -p "Snowflake Password: " snowflakepassword; echo $$snowflakepassword')
 #	will be generated in the code at places like this:	account: process.env.SNOWFLAKE_ACCOUNT,

grouparoo build:
	docker build -t fantasticfour/grouparoo:latest grouparoo.dockerfile
grouparoo tag:
	docker tag fantasticfour/grouparoo:latest 664673331651.dkr.ecr.us-east-2.amazonaws.com/fantasticfour:latest
grouparoo push:
	docker push 664673331651.dkr.ecr.us-east-2.amazonaws.com/fantasticfour:latest
tapestry-up:
	@echo "Sending the template into the void..."
	@AWS_PAGER="" aws cloudformation create-stack --template-body file://grouparoo.yml \
	 --stack-name grouparoo-ecs \
	 --capabilities CAPABILITY_NAMED_IAM
createkeys:
	@echo "Creating secure Mailchip API Key parameter."
	@AWS_PAGER="" aws ssm put-parameter --name /my/test/mc-api-key --value $(MAILCHIMP_API_KEY) --type SecureString --overwrite
	@echo "Creating secure Mailchip List Id parameter."
	@AWS_PAGER="" aws ssm put-parameter --name /my/test/mc-list-id --value $(MAILCHIMP_LIST_ID) --type SecureString --overwrite
#	@echo "Creating secure Snowflake Account parameter."
# 	@AWS_PAGER="" aws ssm put-parameter --name /my/test/sf-account --value $(SNOWFLAKE_ACCOUNT) --type SecureString --overwrite
# 	@echo "Creating secure Snowflake Username parameter."
#	@AWS_PAGER="" aws ssm put-parameter --name /my/test/sf-username --value $(SNOWFLAKE_USERNAME) --type SecureString --overwrite
#	@echo "Creating secure Snowflake Password parameter."
#	@AWS_PAGER="" aws ssm put-parameter --name /my/test/sf-password --value $(SNOWFLAKE_PASSWORD) --type SecureString --overwrite
