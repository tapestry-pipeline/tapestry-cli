const envLocalTemplate = `
###############
## MAILCHIMP ##
###############

GROUPAROO_OPTION__APP__MAILCHIMP_API_KEY="..."
GROUPAROO_OPTION__DESTINATION__MAILCHIMP_LIST_ID="..."

#############
## GENERAL ##
#############

PORT=3000
WEB_URL=http://localhost:3000

WEB_SERVER=true
WORKERS=1
SERVER_TOKEN=my-super-cool-server-token

# By default, the config directory should be located in a folder named "config" within the root of your project.  You can change that with 'GROUPAROO_CONFIG_DIR'
# GROUPAROO_CONFIG_DIR=/path/to/config

#############
## LOGGING ##
#############

GROUPAROO_LOG_LEVEL=info
# GROUPAROO_LOGS_STDOUT_DISABLE_COLOR=true
# GROUPAROO_LOGS_STDOUT_DISABLE_TIMESTAMP=true
# GROUPAROO_LOGS_PATH="/path/to/logs"

###########
## REDIS ##
###########

# To use an in-memory redis mock (no persistence)
REDIS_URL="redis://mock"

# To use a Redis Server
# REDIS_URL="redis://localhost:6379/0"

##############
## DATABASE ##
##############

# To use sqlite
DATABASE_URL="sqlite://grouparoo_development.sqlite"

# To use Postgres
# DATABASE_URL="postgresql://localhost:5432/grouparoo_development"

# With custom SSL options:
# DATABASE_SSL=true
# DATABASE_SSL_SELF_SIGNED=true
`;

module.exports = {
  envLocalTemplate
}