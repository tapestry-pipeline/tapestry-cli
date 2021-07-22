exports.default = async function buildConfig() {
  return [
    {
      id: "newsletter",
      name: "newsletter",
      class: "destination",
      type: "mailchimp-export",
      appId: "mailchimp", // The ID of the App this Source uses - e.g. `appId: "mailchimp_app"`
      groupId: "all_emails", // The ID of the group whose members you want to export - e.g. `groupId: "high_value_customers"`
      syncMode: "sync", // How should Grouparoo sync with this destination? Options: "sync", "additive", "enrich"

      options: {
        listId: process.env.MAILCHIMP_LIST_ID, // The Mailchimp List ID (https://mailchimp.com/help/find-audience-id/)
      },

      // Mappings are how you choose which properties to export to this destination.
      // Keys are the name to display in the destination, values are the IDs of the Properties in Grouparoo.
      mapping: {
        email_address: "EMAIL",
        FNAME: "FIRST_NAME",
        LNAME: "LAST_NAME",
        CITY: "CITY",
        STREETADDRESS: "STREETADDRESS",
      },

      // You can export group memberships.
      // Keys are the name to display in the destination, values are the IDs of the Groups in Grouparoo.
      destinationGroupMemberships: {
        "all valid emails": "all_emails",
      },
    },
  ];
};
