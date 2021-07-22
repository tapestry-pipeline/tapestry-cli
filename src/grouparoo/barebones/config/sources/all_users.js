const {snowflakeAppId} = require ('../../commands.js');
const {snowflakeTableName, snowflakeSourceId} = require ('../../commands.js');

exports.default = async function buildConfig() {
  return [
    /**
     * --------------------
     * Source
     * --------------------
     */
    {
      class: "source",
      id: snowflakeSourceId,
      name: snowflakeSourceId,
      type: "snowflake-table-import",
      appId: snowflakeAppId, // Set this value to the ID of the App this Source uses - e.g. `appId: "data_warehouse"`
      options: {
        table: snowflakeTableName, // Name of the table in your DB - e.g. `table: "users"`
      },

      /**
       * A list of mappings for this source as:
       *
       *     "remote_column": "grouparoo_property_id"
       *
       * For example, if your users table has an `id` column, and you want to map that to the
       * `user_id` property in this Grouparoo source, your mapping would look like:
       *
       *     mapping: { id: "user_id" }
       */
      // left column (email) in snowflake
      mapping: {
        EMAIL: "EMAIL",  // snowflake table column-name : Grouparoo Property ID
      },
    },

    /**
     * ---------------
     * Schedule
     * ---------------
     *
     * A Schedule tells Grouparoo how frequently to check the Source for updated
     * data and import it into the application database. If you would like to
     * set a Schedule for this Source, uncomment the following section.
     */
    {
      id: "all_users_schedule",
      name: "all_users_schedule",
      class: "schedule",
      sourceId: "all_users", // The ID of the Source above
      recurring: true, // should this Schedule regularly run?
      recurringFrequency: 1000 * 60 * 15, // 15 minutes, in ms
      options: {
        column: "START_DATE", // the column to check for new records in table which this Schedule's Source is using (e.g. column: 'updated_at')
      },
    },
  ];
};
