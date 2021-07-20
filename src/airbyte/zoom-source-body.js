const buildZoomSource = (jwt, workspaceId) => {
  return {
    "sourceDefinitionId": "aea2fd0d-377d-465e-86c0-4fdc4f688e51",  
    "connectionConfiguration": {
        "jwt" : jwt
    },
    "workspaceId": workspaceId,
    "name": "Zoom API Test2"
  }
}

// zoom body info template:
// let body = { 
//   "sourceDefinitionId": "aea2fd0d-377d-465e-86c0-4fdc4f688e51",  
//   "connectionConfiguration": {
//       "jwt" : "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6InFra0pPREdYU1BPS0U2NGQ2YWNKZWciLCJleHAiOjE2MzUwNDc5NDAsImlhdCI6MTYyNjM3NDg1MX0.Kzr3uc5c0bIP7hv6Hh-DA6BrfCWeKgxZiaV1SdiYf14"
//   },
//   "workspaceId": "5ae6b09b-fdec-41af-aaf7-7d94cfc33ef6",
//   "name": "Zoom API Test2"
// }

module.exports = {
  buildZoomSource
}



