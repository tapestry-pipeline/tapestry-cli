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
