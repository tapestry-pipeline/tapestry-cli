const buildZoomSource = (jwt, workspaceId) => {
  return {
    "sourceDefinitionId": "aea2fd0d-377d-465e-86c0-4fdc4f688e51",  
    "connectionConfiguration": {
        "jwt" : jwt
    },
    "workspaceId": workspaceId,
    "name": "Zoom (Tapestry)"
  }
}

module.exports = {
  buildZoomSource
}


// "jwt" : "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6InFra0pPREdYU1BPS0U2NGQ2YWNKZWciLCJleHAiOjE2MzUwNDc5NDAsImlhdCI6MTYyNjM3NDg1MX0.Kzr3uc5c0bIP7hv6Hh-DA6BrfCWeKgxZiaV1SdiYf14"