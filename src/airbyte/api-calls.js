import axios from "axios";

import {body} from "./zoom-source-body.js"
import {body as destinationBody} from "./snowflake-destination-body.js";
import {destinationIdBody} from "./snowflake-destination-body.js";
// console.log(body)

/// create a source
let domainName = 'http://localhost:8000/';

async function createSource(domainName, body) {
  await axios 
    .post(`${domainName}/api/v1/sources/create`, body)
    .then(response => {
        data = response.data;
        return data.sourceId; 
    })
    .catch(error => console.log(err))
}

// console.log(createSource(domainName, body));

async function createDestination(domainName, body) {
  await axios
    .post(`${domainName}/api/v1/destinations/create`, body)
      .then(response => {
        data = response.data;
        return data.destinationId; 
      })
      .catch(error => {
        console.log(error);
      });
}

async function checkSourceConnection(domainName, body) {
    await axios
      .post(`${domainName}/api/v1/sources/check_connection`, body)
        .then(response => {
          let data = response.data; 
          return data.status; 
        })
        .catch(error => {
          console.log('hi');
        });
}

async function checkDestinationConnection(domainName, id) {
  await axios
    .post(`${domainName}/api/v1/destinations/check_connection`, { "destinationId" : id})
      .then(response => {
        let data = response.data; 
        return data.status; 
      })
      .catch(error => {
        console.log(error);
      });
}

// checkSourceConnection(domainName, {"sourceId": "2714f42d-82e4-4036-a4f"}); 
// checkDestinationConnection(domainName, {"destinationId": "4f28af43-438a-425d-bffd-4d9b2c3af372"});

async function createOperation(domainName, name) {
    let body = {
      "name": name,
      "operatorConfiguration": {
      "operatorType": "normalization",
      "normalization": {
          "option": "basic"
          }
      }
    };
    await axios.post(`${domainName}/api/v1/operations/create`, body )
       .then(response => {
          let data = response.data;
          return data.operationId; 
       })
       .catch(error => {
          console.log(error);
       });
        
}

let bodyProperties = {
  "sourceId": "6cfe7dfb-295d-4c24-95f9-89256ba0b309", 
  "destinationId": "4f28af43-438a-425d-bffd-4d9b2c3af372",
  "operationIds": "cc6e7adc-361e-4c24-b328-6fdb34931b08",
  "schedule":  {
		"units": "30",
		"timeUnit": "minutes"
	}
}

async function createConnection(domainName, body) {
  
   await axios.post(`${domainName}/api/v1/connections/create`, body )
    .then(response => {
       console.log(response)
    })
    .catch(error => {
       console.log(error);
    });

}

let filterSchemas = (streamArray)  => {
  let obj = streamArray.filter(streamObject => {
    let str = streamObject.stream;
    return str.name === 'users';
  });

  return obj;
}

async function getSourceContactSchema(domainName){
  let obj = { 
      "sourceDefinitionId": "aea2fd0d-377d-465e-86c0-4fdc4f688e51",  
      "connectionConfiguration": {
      "jwt" : "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6InFra0pPREdYU1BPS0U2NGQ2YWNKZWciLCJleHAiOjE2MzUwNDc5NDAsImlhdCI6MTYyNjM3NDg1MX0.Kzr3uc5c0bIP7hv6Hh-DA6BrfCWeKgxZiaV1SdiYf14"
      }
  };

  await axios.post(`${domainName}/api/v1/scheduler/sources/discover_schema`, obj )
    .then(response => {
      return filterSchemas(response.data.catalog.streams)
    })
    .catch(error => {
       console.log(error);
    });
}

// createConnection(domainName, bodyProperties)

async function setupAirbyte(domainName, sourceConfigList, destinationConfigObject) {
  let destinationId = await createDestination(domainName, destinationConfigObject);
  let destinationStatus =  await checkDestinationConnection(domainName, destinationId);
  if (destinationStatus !== 'succeeded') {
    console.log('error, check snowflake config');
    return;
  }

  let operationId = await createOperation(domainName, "test operation name"); 
 

  for (const source of sourceConfigList) {
    let sourceId = await createSource(domainName, source);
    let sourceStatus = await checkSourceConnection(domainName, sourceId);
    if (destinationStatus !== 'succeeded') {
      console.log('error, check snowflake config');
      return;
    }

    let schema = await getSourceContactSchema(domainName);

    let connectionObject = createConnectionObject(sourceId, destinationId, operation )

  }
 
  function createConnectionObject(sourceId, destinationId, operationId, schedule=null, schema) {
    return   {
      "name": "Zoom to Snowflake2",
      "namespaceDefinition": "source",
      "namespaceFormat": "${SOURCE_NAMESPACE}",
      "prefix": "SF_API_",
      "sourceId": properties.sourceId,
      "destinationId": destinationId,
      "operationIds": [ operationId ],
      "syncCatalog": schema,
      "schedule": schedule,
      "status": "active",
      "resourceRequirements": {
        "cpu_request": "",
        "cpu_limit": "",
        "memory_request": "",
        "memory_limit": ""
      }  
    }
  }
  

  let bodyProperties = {
    "sourceId": "6cfe7dfb-295d-4c24-95f9-89256ba0b309", 
    "destinationId": "4f28af43-438a-425d-bffd-4d9b2c3af372",
    "operationIds": "cc6e7adc-361e-4c24-b328-6fdb34931b08",
    "schedule":  {
          "units": "30",
          "timeUnit": "minutes"
      }
  }


}