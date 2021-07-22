const { allEmailsGroupId } = require('../../commands.js');
exports.default = async function buildConfig() {
  return [
    {
      class: "group",
      id: allEmailsGroupId,
      name: allEmailsGroupId,
      type: "calculated",

      /**
       The Rules for this group is an array. Here are some examples.
       For a full list of options, see https://www.grouparoo.com/docs/config/groups

        rules: [
          // a Property exists on the Profile
          {
            propertyId: "email",
            operation: { op: "exists" },
          },

          // a numeric Property is greater than a value
          {
            propertyId: "ltv",
            operation: { op: "gt" },
            match: 100,
          },

          // a string Property is contains some value
          {
            propertyId: "email",
            operation: { op: "like" },
            match: "%@%",
          },
        ]
      */
      rules: [
        {
          propertyId: "EMAIL",
          operation: { op: "exists" },
        },
      ],
    },
  ];
};
