// import axios from "axios";
const axios = require("axios");
const zoomBody = require( "./zoom-source-body.js").body;
const destinationBody = require("./snowflake-destination-body.js").body;

// import {body as zoomBody } from "./zoom-source-body.js"
// import {body as destinationBody} from "./snowflake-destination-body.js";
// console.log(body)

/// create a source
const domainName = "http://localhost:8000/";

async function getWorkspaceId(domainName) {
  return await axios
    .post(`${domainName}/api/v1/workspaces/get_by_slug`, { slug: "default" })
    .then((response) => {
      let data = response.data;
      console.log(data.workspaceId);
      return data.workspaceId;
    })
    .catch((error) => console.log(err));
}

async function createSource(domainName, body) {
  return await axios
    .post(`${domainName}/api/v1/sources/create`, body)
    .then((response) => {
      let data = response.data;
      return data.sourceId;
    })
    .catch((error) => console.log(err));
}

// // console.log(createSource(domainName, body));

async function createDestination(domainName, body) {
  return await axios
    .post(`${domainName}/api/v1/destinations/create`, body)
    .then((response) => {
      let data = response.data;
      console.log(data.destinationId);
      return data.destinationId;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function checkSourceConnection(domainName, id) {
  return await axios
    .post(`${domainName}/api/v1/sources/check_connection`, { sourceId: id })
    .then((response) => {
      let data = response.data;
      return data.status;
    })
    .catch((error) => {
      console.log("error, checkSourceConnection");
    });
}

async function checkDestinationConnection(domainName, id) {
  return await axios
    .post(`${domainName}/api/v1/destinations/check_connection`, {
      destinationId: id,
    })
    .then((response) => {
      let data = response.data;
      return data.status;
    })
    .catch((error) => {
      console.log(error);
    });
}

// // checkSourceConnection(domainName, {"sourceId": "2714f42d-82e4-4036-a4f"});
// // checkDestinationConnection(domainName, {"destinationId": "4f28af43-438a-425d-bffd-4d9b2c3af372"});

async function createOperation(domainName) {
  let body = {
    name: "Normalization for Snowfake",
    operatorConfiguration: {
      operatorType: "normalization",
      normalization: {
        option: "basic",
      },
    },
  };
  return await axios
    .post(`${domainName}/api/v1/operations/create`, body)
    .then((response) => {
      let data = response.data;
      return data.operationId;
    })
    .catch((error) => {
      console.log(error);
    });
}

// const bodyProperties = {
//   "sourceId": "6cfe7dfb-295d-4c24-95f9-89256ba0b309",
//   "destinationId": "4f28af43-438a-425d-bffd-4d9b2c3af372",
//   "operationIds": "cc6e7adc-361e-4c24-b328-6fdb34931b08",
//   "schedule":  {
// 		"units": "30",
// 		"timeUnit": "minutes"
// 	}
// }

async function createConnection(domainName, body) {
  return await axios
    .post(`${domainName}/api/v1/connections/create`, body)
    .then((response) => {
      let data = response.data;
      return data.connectionId;
    })
    .catch((error) => {
      console.log(error);
    });
}

const filterSchemas = (streamArray, streamName) => {
  return streamArray.filter((streamObject) => {
    return streamObject.stream.name === streamName;
  });
};

async function getSourceSchema(domainName) {
  let obj = {
    sourceDefinitionId: "aea2fd0d-377d-465e-86c0-4fdc4f688e51",
    connectionConfiguration: {
      jwt: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6InFra0pPREdYU1BPS0U2NGQ2YWNKZWciLCJleHAiOjE2MzUwNDc5NDAsImlhdCI6MTYyNjM3NDg1MX0.Kzr3uc5c0bIP7hv6Hh-DA6BrfCWeKgxZiaV1SdiYf14",
    },
  };

  return await axios
    .post(`${domainName}/api/v1/scheduler/sources/discover_schema`, obj)
    .then((response) => {
      let data = response.data;
      return filterSchemas(data.catalog.streams, "users");
    })
    .catch((error) => {
      console.log(error);
    });
}

// createConnection(domainName, bodyProperties)

async function createConnectionObject(sourceId, destinationId, operationId, schema, schedule = null) {
  return {
    name: "Connection 1",
    namespaceDefinition: "source",
    namespaceFormat: "${SOURCE_NAMESPACE}",
    prefix: "SF_API_",
    sourceId: sourceId,
    destinationId: destinationId,
    operationIds: [operationId],
    syncCatalog: {
      streams: schema,
    },
    schedule: schedule,
    status: "active",
    resourceRequirements: {
      cpu_request: "",
      cpu_limit: "",
      memory_request: "",
      memory_limit: "",
    },
  };
}

async function setupAirbyte(domainName, sourceConfigList, destinationConfigObject) {
  const workspaceId = await getWorkspaceId(domainName);
  const destinationId = await createDestination(domainName,destinationConfigObject);
  const destinationStatus = await checkDestinationConnection(domainName, destinationId);
  if (destinationStatus !== "succeeded") {
    console.log("error, check snowflake config");
    return;
  }

  // const operationId = await createOperation(domainName, "test operation name");

  // for (const source of sourceConfigList) {
  //   const sourceId = await createSource(domainName, source);
  //   const sourceStatus = await checkSourceConnection(domainName, sourceId);
  //   if (sourceStatus !== 'succeeded') {
  //     console.log('error, check source config');
  //     return;
  //   }

  //   const schema = await getSourceSchema(domainName);
  //   const connectionObject = await createConnectionObject(sourceId, destinationId, operationId, schema)
  //   await createConnection(domainName, connectionObject);
  // }
}

// setupAirbyte(domainName, [zoomBody], destinationBody);

// let bodyProperties = {
//   "sourceId": "6cfe7dfb-295d-4c24-95f9-89256ba0b309",
//   "destinationId": "4f28af43-438a-425d-bffd-4d9b2c3af372",
//   "operationIds": "cc6e7adc-361e-4c24-b328-6fdb34931b08",
//   "schedule":  {
//         "units": "30",
//         "timeUnit": "minutes"
//     }
// }

module.exports = {
  setupAirbyte,
};
