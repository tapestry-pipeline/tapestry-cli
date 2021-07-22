const contactSchema =
  {
    "stream": {
        "name": "Contact",
        "jsonSchema": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "Id": {
                    "type": "string"
                },
                "IsDeleted": {
                    "type": [
                        "null",
                        "boolean"
                    ]
                },
                "MasterRecordId": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "AccountId": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "LastName": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "FirstName": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Salutation": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Name": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OtherStreet": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OtherCity": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OtherState": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OtherPostalCode": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OtherCountry": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OtherLatitude": {
                    "type": [
                        "null",
                        "number"
                    ]
                },
                "OtherLongitude": {
                    "type": [
                        "null",
                        "number"
                    ]
                },
                "OtherGeocodeAccuracy": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OtherAddress": {
                    "type": [
                        "null",
                        "object"
                    ],
                    "properties": {
                        "street": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "state": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "postalCode": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "city": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "country": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "longitude": {
                            "type": [
                                "null",
                                "number"
                            ]
                        },
                        "latitude": {
                            "type": [
                                "null",
                                "number"
                            ]
                        },
                        "geocodeAccuracy": {
                            "type": [
                                "null",
                                "string"
                            ]
                        }
                    }
                },
                "MailingStreet": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "MailingCity": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "MailingState": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "MailingPostalCode": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "MailingCountry": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "MailingLatitude": {
                    "type": [
                        "null",
                        "number"
                    ]
                },
                "MailingLongitude": {
                    "type": [
                        "null",
                        "number"
                    ]
                },
                "MailingGeocodeAccuracy": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "MailingAddress": {
                    "type": [
                        "null",
                        "object"
                    ],
                    "properties": {
                        "street": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "state": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "postalCode": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "city": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "country": {
                            "type": [
                                "null",
                                "string"
                            ]
                        },
                        "longitude": {
                            "type": [
                                "null",
                                "number"
                            ]
                        },
                        "latitude": {
                            "type": [
                                "null",
                                "number"
                            ]
                        },
                        "geocodeAccuracy": {
                            "type": [
                                "null",
                                "string"
                            ]
                        }
                    }
                },
                "Phone": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Fax": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "MobilePhone": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "HomePhone": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OtherPhone": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "AssistantPhone": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "ReportsToId": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Email": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Title": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Department": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "AssistantName": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "LeadSource": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Birthdate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "Description": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "OwnerId": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "CreatedDate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "CreatedById": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "LastModifiedDate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "LastModifiedById": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "SystemModstamp": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "LastActivityDate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "LastCURequestDate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "LastCUUpdateDate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "LastViewedDate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "LastReferencedDate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "EmailBouncedReason": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "EmailBouncedDate": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "date-time"
                        },
                        {
                            "type": [
                                "string",
                                "null"
                            ]
                        }
                    ]
                },
                "IsEmailBounced": {
                    "type": [
                        "null",
                        "boolean"
                    ]
                },
                "PhotoUrl": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Jigsaw": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "JigsawContactId": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "CleanStatus": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Level__c": {
                    "type": [
                        "null",
                        "string"
                    ]
                },
                "Languages__c": {
                    "type": [
                        "null",
                        "string"
                    ]
                }
            }
        },
        "supportedSyncModes": [
            "incremental"
        ],
        "sourceDefinedCursor": true,
        "defaultCursorField": [
            "SystemModstamp"
        ],
        "sourceDefinedPrimaryKey": [],
        "namespace": null
    },
    "config": {
        "syncMode": "incremental",
        "cursorField": [
            "SystemModstamp"
        ],
        "destinationSyncMode": "append",
        "primaryKey": [],
        "aliasName": "Contact",
        "selected": true
    }
  }

module.exports = {
  contactSchema
}