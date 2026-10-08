
/**
 * updateRequest — OptimizedWorkflow RC trunk
 *
 * Same Request Central update APIs as production. After success, confirms
 * runPath.ticketRef / ticketSource=updateApi on dataModel (no Workflow_* persist).
 * Then Forward persistDataModelToIdp.
 *
 * Paste this whole file into Script node updateRequest.
 */

function normalizePoArray(val) {
    if (val == null) {
        return [];
    }
    if (Array.isArray(val)) {
        return val.map(function (v) { return String(v); });
    }
    if (val.size != null && typeof val.size === "function") {
        var arr = [];
        for (var i = 0; i < val.size(); i++) {
            arr.push(String(val.get(i)));
        }
        return arr;
    }
    var str = String(val).trim();
    return str.length > 0 ? [str] : [];
}


function poArrayToString(val) {
    if (val == null) {
        return "";
    }
    if (Array.isArray(val)) {
        return val.length > 0 ? val.join(", ") : "";
    }
    return String(val).trim();
}


function getFieldFromResult(result, fieldName) {
    if (result == null) {
        return null;
    }
    if (result.get) {
        return result.get(fieldName);
    }
    return result[fieldName];
}


function hasAnyPoValue(poFields) {
    return poFields.vendorPoNo.length > 0 ||
        poFields.customerPoNo.length > 0 ||
        poFields.saleOrderNo.length > 0 ||
        poFields.isoNo.length > 0;
}


function extractPoFieldsFromSource(source) {
    return {
        vendorPoNo: normalizePoArray(getFieldFromResult(source, "vendor_po_no")),
        customerPoNo: normalizePoArray(getFieldFromResult(source, "customer_po_no")),
        saleOrderNo: normalizePoArray(getFieldFromResult(source, "sale_order_no")),
        isoNo: normalizePoArray(getFieldFromResult(source, "iso_no"))
    };
}


function isBizValuePresent(val) {
    if (val == null) {
        return false;
    }
    if (typeof val === "string" && val.trim() === "") {
        return false;
    }
    return true;
}


function loadKeydataProcessingResult() {
    var keydataResult = biz("keydataProcessingResult");
    if (isBizValuePresent(keydataResult)) {
        if (typeof keydataResult === "string") {
            try {
                return WE_ScriptHelper.fromJson(keydataResult);
            } catch (e) {
                log.warn("Failed to parse keydataProcessingResult: " + e.message);
                return null;
            }
        }
        return keydataResult;
    }

    var aiResult = biz("AIResultKeydataprocessing");
    if (!isBizValuePresent(aiResult) || aiResult.content == null) {
        return null;
    }

    try {
        return WE_ScriptHelper.fromJson(aiResult.content);
    } catch (e) {
        log.warn("Failed to parse AIResultKeydataprocessing.content: " + e.message);
        return null;
    }
}


/**
 * Prefer Keydata LLM output (prompt_Keydataprocessing) when present.
 * Falls back to email-parse PO fields when keydata processing did not run.
 */
function resolveKeydataProcessingPoFields() {
    var source = "none";
    var poFields = {
        vendorPoNo: [],
        customerPoNo: [],
        saleOrderNo: [],
        isoNo: []
    };

    var keydataResult = loadKeydataProcessingResult();
    if (keydataResult != null) {
        var keydataPoFields = extractPoFieldsFromSource(keydataResult);
        if (hasAnyPoValue(keydataPoFields)) {
            poFields = keydataPoFields;
            source = "keydataProcessing";
        }
    }

    if (source === "none") {
        var emailPoFields = extractPoFieldsFromSource({
            vendor_po_no: biz("vendor_po_no"),
            customer_po_no: biz("customer_po_no"),
            sale_order_no: biz("sale_order_no"),
            iso_no: biz("iso_no")
        });
        if (hasAnyPoValue(emailPoFields)) {
            poFields = emailPoFields;
            source = "emailAnalyze";
        }
    }

    if (source === "none") {
        poFields = extractPoFieldsFromSource({
            vendor_po_no: biz("vendorPoNo"),
            customer_po_no: biz("customerPoNo"),
            sale_order_no: biz("saleOrderNo"),
            iso_no: biz("isoNo")
        });
        if (hasAnyPoValue(poFields)) {
            source = "emailAnalyze";
        }
    }

    log.info("PO fields source: " + source +
        ", vendor_po_no: " + poFields.vendorPoNo +
        ", customer_po_no: " + poFields.customerPoNo +
        ", sale_order_no: " + poFields.saleOrderNo +
        ", iso_no: " + poFields.isoNo);

    return poFields;
}


function updateExistingRequest(requestNo, updateRequestBody) {
    log.info("Updating existing request: " + requestNo);
    var apiResponse = null;
    var errorOccurred = false;
    var errorMessage = "";
    WE_ScriptHelper.restCall({
        "request": {
            "crossSystemNo": biz("systemNo"),
            "method": "POST",
            "serviceName": "request-central",
            "path": "/api/rcs/internal/request/{requestNo}/services",
            "pathVariable": {
                "requestNo": String(requestNo)
            },
            "body": updateRequestBody
        },
        "success": function (response) {
            log.info("Request updated successfully: " + requestNo);
        },
        "responseError": function (response, exception) {
            errorOccurred = true;
            errorMessage = "Failed to update request: " + WE_ScriptHelper.toJson(response);
            log.info(errorMessage);
        }
    });
    if (errorOccurred) {
        log.info("record parsed fail, will move to failed folder");
        mailParsedFail = "Y";
        addBizVar("Workflow_Failed_logs", errorMessage);
        //throw new Error(errorMessage);
    }
    return apiResponse;
}

function updateExistingActionForHold(requestNo, updateRequestBody) {
    log.info("Updating existing action: " + requestNo);
    var apiResponse = null;
    var errorOccurred = false;
    var errorMessage = "";
    WE_ScriptHelper.restCall({
        "request": {
            "crossSystemNo": biz("systemNo"),
            "method": "PUT",
            "serviceName": "request-central",
            "path": "/api/rcs/internal/action/status",
            
            "body": updateRequestBody
        },
        "success": function (response) {
            log.info("Request Action updated successfully: " + requestNo);
        },
        "responseError": function (response, exception) {
            errorOccurred = true;
            errorMessage = "Failed to update request action: " + WE_ScriptHelper.toJson(response);
            log.info(errorMessage);
        }
    });
    if (errorOccurred) {
        log.info("record parsed fail, will move to failed folder");
        mailParsedFail = "Y";
        addBizVar("Workflow_Failed_logs", errorMessage);
        //throw new Error(errorMessage);
    }
    return apiResponse;
}


function updateExistingAction(requestNo, updateRequestBody) {
    log.info("Updating existing action: " + requestNo);
    var apiResponse = null;
    var errorOccurred = false;
    var errorMessage = "";
    WE_ScriptHelper.restCall({
        "request": {
            "crossSystemNo": biz("systemNo"),
            "method": "POST",
            "serviceName": "request-central",
            "path": "/api/rcs/internal/request/{requestNo}/note",
            "pathVariable": {
                "requestNo": requestNo
            },
            
            "body": updateRequestBody
        },
        "success": function (response) {
            log.info("Request Action updated successfully: " + requestNo);
        },
        "responseError": function (response, exception) {
            errorOccurred = true;
            errorMessage = "Failed to update request action: " + WE_ScriptHelper.toJson(response);
            log.info(errorMessage);
        }
    });
    if (errorOccurred) {
        log.info("record parsed fail, will move to failed folder");
        mailParsedFail = "Y";
        addBizVar("Workflow_Failed_logs", errorMessage);
        //throw new Error(errorMessage);
    }
    return apiResponse;
}


/**
 * Initializes the base request body structure
 */
function initializeRequestBody(mailSubject , fromEmail , subject) {
    var requestName = mailSubject;

    return {
        "brands": [],
        "vendors": [],
        "endUser": null,
        "endUserContact": null,
        "additionalRecipients": [],
        "emailParam": {
            "fromEmail": fromEmail || "",
            "emailSubject": subject || "",
            "selectedRecipients": [],
            "appendToSubject": true
        },
        "internalFlag": true, // always true
        "doNotNotifyCustomerFlag": true, // always true
        "requestExtAttributes": {
            "header": {
                "currency": "USD",
                "pricingRequirement": "standardDiscount"
            },
            "lines": []
        },
        "requestName": String(requestName).trim(),
        "sourceText": "AI_Triage",
        "copiedFromRequestNo": null
    };
}


/**
 * Initializes the base request body structure
 */
function initializeUpdateRequestBodyForHold(mailSubject , fromEmail , subject , note, statusType,reasonType,userIDForUpdate, userFirstNameForUpdate, userLastNameForUpdate, requestNo,actionNo) {
    
    var timestamp = new Date().toISOString();

    return {
            "instructionData": {
                "internalFlag": false,
                "noteText": note
            },
            "emailParam": {
                "fromEmail": fromEmail || "",
                "emailSubject": subject || "",
                "selectedRecipients": [],
                "appendToSubject": true
            },
            "additionalContacts": [],
            "additionalRecipients": [],
            "files": [],
            "statusType": statusType,
            "reasonType": reasonType,
            "batch": false, // Set to false for update action 
            "specifiedOperator": {
                "firstName": userFirstNameForUpdate || "",
                "lastName": userLastNameForUpdate || "",
                "userId": userIDForUpdate || ""
            },
            "requestNoActionNos": [
                {
                "requestNo": requestNo,
                "actionNo": actionNo
                }
            ],
            "eventDate": timestamp
        };
}



/**
 * Initializes the base request body structure
 */
function initializeUpdateRequestBody(mailSubject , fromEmail , subject , note, actionNo) {
    
    var timestamp = new Date().toISOString();

    return {
            "instructionData": {
                "internalFlag": false,
                "noteText": note
            },
            "emailParam": {
                "fromEmail": fromEmail || "",
                "emailSubject": subject || "",
                "selectedRecipients": [],
                "appendToSubject": true
            },
            "additionalContacts": [],
            "additionalRecipients": [],
            "files": [],
            "actionNo": actionNo,
        };
}





// function isValidEmailFormat(email) {
//     if (!email || typeof email !== 'string') {
//         return false;
//     }
//     var trimmed = email.trim();
//     return trimmed.length > 0 && trimmed.indexOf('@') > 0 && trimmed.indexOf('@') < trimmed.length - 1;
// }

// function extractCcRecipients(ccRecipients) {
//     var additionalRecipients = [];
//     if (!ccRecipients) {
//         return additionalRecipients;
//     }
//     var emailString = ccRecipients.trim();
//     if (emailString.indexOf(',') !== -1) {
//         // Split by comma and process each email
//         var emailArray = emailString.split(',');
//         emailArray.forEach(function (email) {
//             var trimmedEmail = email.trim();
//             if (trimmedEmail.length > 0 && isValidEmailFormat(trimmedEmail)) {
//                 additionalRecipients.push(trimmedEmail);
//             }
//         });
//     } else {
//         // Single email address
//         additionalRecipients.push(emailString);
//     }
//     return additionalRecipients;
// }




function isValidEmailFormat(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    var trimmed = email.trim();
    return trimmed.length > 0 && trimmed.indexOf('@') > 0 && trimmed.indexOf('@') < trimmed.length - 1;
}
function extractCcRecipients(ccRecipients) {
    var additionalRecipients = [];
    if (!ccRecipients) {
        return additionalRecipients;
    }

    // Case 1: Array of objects with emailAddress.address
    var isList = Array.isArray(ccRecipients) ||
        (ccRecipients.size != null && typeof ccRecipients.size === "function");

    if (isList) {
        var size = Array.isArray(ccRecipients) ? ccRecipients.length : ccRecipients.size();
        for (var i = 0; i < size; i++) {
            var item = Array.isArray(ccRecipients) ? ccRecipients[i] : ccRecipients.get(i);
            if (!item) {
                continue;
            }

            // Support both Java map (.get) and JS object (.property)
            var emailAddressObj = item.get ? item.get("emailAddress") : item.emailAddress;
            if (!emailAddressObj) {
                log.info("Skipping CC item with no emailAddress at index: " + i);
                continue;
            }

            var emailAddr = emailAddressObj.get ? emailAddressObj.get("address") : emailAddressObj.address;
            if (!emailAddr) {
                log.info("Skipping CC item with no address at index: " + i);
                continue;
            }

            var trimmedAddr = String(emailAddr).trim();
            if (trimmedAddr.length > 0 && isValidEmailFormat(trimmedAddr)) {
                additionalRecipients.push(trimmedAddr);
                log.info("CC recipient added: " + trimmedAddr);
            } else {
                log.info("Skipping invalid CC email at index " + i + ": " + trimmedAddr);
            }
        }
        log.info("Total CC recipients extracted: " + additionalRecipients.length);
        return additionalRecipients;
    }

    // Case 2: Plain comma-separated string fallback
    // e.g. "a@x.com,b@x.com"
    var emailString = String(ccRecipients).trim();
    if (emailString.length === 0) {
        return additionalRecipients;
    }

    if (emailString.indexOf(',') !== -1) {
        var emailArray = emailString.split(',');
        emailArray.forEach(function (email) {
            var trimmedEmail = email.trim();
            if (trimmedEmail.length > 0 && isValidEmailFormat(trimmedEmail)) {
                additionalRecipients.push(trimmedEmail);
                log.info("CC recipient added: " + trimmedEmail);
            }
        });
    } else {
        if (isValidEmailFormat(emailString)) {
            additionalRecipients.push(emailString);
            log.info("CC recipient added: " + emailString);
        }
    }

    log.info("Total CC recipients extracted: " + additionalRecipients.length);
    return additionalRecipients;
}


function validateIfRequestBelongstoCustomer(response, custEmail) {
    /**
     * Validates if the given requestNo belongs to the customer with custEmail.
     * @param {string} requestNo
     * @param {string} custEmail
     * @returns {boolean} true if request belongs to customer, false otherwise
     */


    var getDomainFromCustEmail = custEmail.split("@")[1].toLowerCase();
    var getCustomerNameFromCustEmail = custEmail.split("@")[0].toLowerCase();
    var requestCustomerName = response.data.requestHeader.customers[0].custName || "";
    var requestCustomerEmail = response.data.requestHeader.persons[0].emailAddr || "";
    var getDomainFromRequestCustomerEmail = requestCustomerEmail.split("@")[1].toLowerCase();


    // Check if customer name from custEmail is part of requestCustomerName
    if (!requestCustomerName.toLowerCase().includes(getCustomerNameFromCustEmail)) {
        log.info("Customer name from custEmail (" + getCustomerNameFromCustEmail + ") not found in request customer name (" + requestCustomerName + ")");
        return false;
    }
    return getDomainFromCustEmail === getDomainFromRequestCustomerEmail;
}

function validateIfRequestNoExist(requestNo,custEmail) {
    var requestExists = false;
    var actionIDs = [];
    var errorOccurred = false;
    var errorMessage = "";
    requestNo = String(requestNo).trim();
    log.info("Validating if requestNo exists: " + requestNo);
    WE_ScriptHelper.restCall({
        "request": {
            
            "crossSystemNo": biz("systemNo"),
            "method": "GET",
            "serviceName": "request-central",
            "path": "/api/rcs/internal/request/{requestNo}",
            "pathVariable": {
                "requestNo": requestNo
            },
            "param": {
                "scope": "ALL" // added ALL instead of Header to get all the actionIDs
            }
        },
        "success": function (response) {
            if (response) {
                if (response.status === 200 && response.data && response.data.requestNo) {
                    requestExists = true;
                    log.info("RequestNo " + requestNo + " exists");

                    // Get all the actionIDs for the requestNo that exists
                    actionIDs = getAllActionIdsForRequest(response);

                    log.info("Action IDs for requestNo " + requestNo + ": " + actionIDs);

                }
            } else {
                errorOccurred = true;
                errorMessage = "Request validation API returned empty response";
            }
        },
        "responseError": function (response, exception) {
            // Check if it's a 500 error with "Unable to find request" message
            if (response) {
                if (response.status === 500 || (response.message && response.message.indexOf("Unable to find request") !== -1)) {
                    requestExists = false;
                    actionIDs = [];
                    log.info("RequestNo " + requestNo + " does not exist (error: " + (response.message || "Not found") + ")");
                    addBizVar("Workflow_Failed_logs", "RequestNo " + requestNo + " does not exist (error: " + (response.message || "Not found") + ")");
                } else {
                    errorOccurred = true;
                    errorMessage = "Failed to validate requestNo: " + WE_ScriptHelper.toJson(response);
                    log.info(errorMessage);
                    addBizVar("Workflow_Failed_logs", errorMessage);
                }
            }
        }
    });
    if (errorOccurred) {
        log.info("Error validating requestNo " + requestNo + ": " + errorMessage);
        addBizVar("Workflow_Failed_logs", errorMessage);
        return [false, []];
    }
    return [requestExists, actionIDs];
}


function getAllActionIdsForRequest(response){
    // Helper function which process the response and extract all the actionIDs for the requestNo that exists
    var actionIDs = [];
    try{
        if(response && response.data ){
            // action IDs are located in response.data.requestActions 

            // response.data.requestActions is a list of objects , each object has as requestActionNo field which we need to extract 
            var requestActions = response.data.requestActions || [];
            requestActions.forEach(function(action){
                if(action.requestActionNo){
                    actionIDs.push(action.requestActionNo);
                }
            });
        }
    }
    catch(error){
        log.info("Error extracting action IDs from response: " + error.message);
    }
    return actionIDs;
}


function getStatusOfActionIDs(actionIDs){

    var actionStatusMap = {};
    var errorOccurred = false;
    var errorMessage = "";
    log.info("Getting status for action IDs: " + actionIDs); 

    WE_ScriptHelper.restCall({
        "request": {
            
            "crossSystemNo": biz("systemNo"),
            "method": "POST",
            "serviceName": "request-central",
            "path": "/api/rcs/internal/actions/actionStatus",
            "body": {
                "actionNos" : actionIDs,
                "onlyActiveStatus": true
            }
        },
        "success": function (response) {
            if (response) {
                if (response.status === 200 && response.data ) {
                    
                     // Creating status map for action IDs
                    // Iterating through data which is a list of objects , each object has requestActionNo and statusType field , and holdReasonType 
                    
                    var actionStatusList = response.data || [];
                    actionStatusList.forEach(function(actionStatus){
                        if(actionStatus.requestActionNo && actionStatus.statusType){
                            
                        var actionNo = actionStatus.requestActionNo;

                        if (!actionStatusMap[actionNo]) {
                            actionStatusMap[actionNo] = {};
                        }

                        actionStatusMap[actionNo].status = actionStatus.statusType;
                        actionStatusMap[actionNo].holdReason = actionStatus.holdReasonType;
                        actionStatusMap[actionNo].userId = actionStatus.userId;
                        actionStatusMap[actionNo].userFirstName = actionStatus.userFirstName;
                        actionStatusMap[actionNo].userLastName = actionStatus.userLastName;



                            // actionStatusMap[actionStatus.requestActionNo].status = actionStatus.statusType;
                            // actionStatusMap[actionStatus.requestActionNo].holdReason = actionStatus.holdReasonType;
                        }
                    });
                
                }
            } else {
                errorOccurred = true;
                errorMessage = "Request validation API returned empty response";
            }
        },
        "responseError": function (response, exception) {
            // Check if it's a 500 error with "Unable to find request" message
            if (response) {
                if (response.status === 500 || (response.message && response.message.indexOf("Unable to find request") !== -1)) {
                    requestExists = false;
                    log.info("Action IDs " + actionIDs + " status could not be retrieved (error: " + (response.message || "Not found") + ")");
                    addBizVar("Workflow_Failed_logs", "Action IDs " + actionIDs + " status could not be retrieved (error: " + (response.message || "Not found") + ")");
                } else {
                    errorOccurred = true;
                    errorMessage = "Failed to validate requestNo: " + WE_ScriptHelper.toJson(response);
                    log.info(errorMessage);
                    addBizVar("Workflow_Failed_logs", errorMessage);
                }
            }
        }
    });

    return actionStatusMap;

}

function getBrandCodes(category) {
    /**
     * Maps category and subcategory to brand codes (case-insensitive).
     * @param {string} category - The category of the request.
     * @returns {Array} [productBrandNo, serviceTypes, productBrandSubServiceNo] or []
     */

    if (!category) return [];

    
    var brandMap = {
        "product quote": [1, "Quote",null],
        "config and quote":  [1, "CfgQte",null],
        "order":  [1, "Order",null],
    };

    var catKey = category.trim().toLowerCase();

    if (
        brandMap[catKey]
    ) {
        return brandMap[catKey];
    }

    return [];

}

function buildUpdateRequestBrandsBody(brandCodes, keyData, overallSummary, customerPoNo, saleOrderNo, isoNo, vendorPoNo) {

    /**
     * 
     * "brands": [
    {
      "productBrandNo": 9,
      "productSubBrandNo": 5,
      "serviceTypes": [
        "Config",
        "Quote"
      ],
      "complexityType": "L",
      "instructions": [
        {
          "noteText": "hardware note",
          "internalFlag": false
        }
      ],
      "files": [],
      "desc": "IBM Service - hardware",
      "brandExtAttributes": {
        "header": {
          "Offerings": "HWMA",
          "ContractTerm": "1 Year"
        }
      }
    },
    ],
     */
    return [{
        "productBrandNo": brandCodes[0],
        "serviceTypes": [brandCodes[1]],
        // "productBrandSubServiceNo": brandCodes[2],
        "complexityType": "L",
        "instructions": [
            {
                "noteText": keyData + " || " + overallSummary,
                "internalFlag": false
            }
        ],
        "files": [],
        "desc": "",
        "brandExtAttributes": {
            "header": {
                "customer_po_no": poArrayToString(customerPoNo),
                "sale_order_no": poArrayToString(saleOrderNo),
                "iso_no": poArrayToString(isoNo),
                "vendor_po_no": poArrayToString(vendorPoNo)
            }
        },
        
        "actionExtAttributes": {
            "header": {
              "customerPoNo": poArrayToString(customerPoNo),
              "saleOrderNo": poArrayToString(saleOrderNo),
              "isoNo": poArrayToString(isoNo),
              "vendorPoNo": poArrayToString(vendorPoNo)
         }
       }
    }];
}


function uploadMailAndGetFileObject(mailEmlFilePvFileId, mailSubject, requestCentralRegisterId , mailAddress, messageId ) {
    var mailEmlFilePvFileId = mailEmlFilePvFileId;
    var requestCentralRegisterId = requestCentralRegisterId;
    var uploadMailFormat = "eml";
    log.info("Uploading mail - registerId: " + requestCentralRegisterId + ", mailEmlFilePvFileId: " + mailEmlFilePvFileId);
    var apiResponse = null;
    var errorOccurred = false;
    var errorMessage = "";
    // Call upload mail API
    WE_ScriptHelper.restCall({
        "request": {
            
            "crossSystemNo": biz("systemNo"),
            "method": "GET",
            "serviceName": "report-service",
            "path": "/api/transfer/file/{fileId}?",
            "pathVariable": {
                "fileId": mailEmlFilePvFileId
            },
            "param": {
                "registerId": requestCentralRegisterId
            },
        },
        "success": function (response) {
            if (response && response.data) {
                apiResponse = response.data;
                log.info("Mail upload API response received");
            }
        },
        "responseError": function (response, exception) {
            errorOccurred = true;
            errorMessage = "Failed to upload mail: " + (exception ? exception.message : WE_ScriptHelper.toJson(response));
            log.info(errorMessage);
        }
    });
    if (errorOccurred) {
        log.info("Mail upload API call failed: " + errorMessage);
        return null;
    }
    // Extract fileId and mailSubject from response
    var fileId = apiResponse.fileId;
    var fileName = mailSubject + ".eml";
    // Build and return file object
    var fileObject = {
        "fileId": String(fileId),
        "fileName": String(fileName),
        "fileDescription": null,
        "fileAttachmentType": null,
        "internalFlag": true
    };
    log.info("Mail uploaded successfully - fileId: " + fileId + ", fileName: " + fileName);
    return fileObject;
}



function extractFilesForUpdate(applicationName, graphToken, messageId , mailAddress, requestCentralRegisterId, mailSubject,mailEmlFilePvFileId) {
    var files = [];
    try {
        
        var currentMailFile = uploadMailAndGetFileObject(mailEmlFilePvFileId,mailSubject , requestCentralRegisterId , mailAddress, messageId );
        if (null != currentMailFile) {
            files.push(currentMailFile);
        }
        log.info("Extracted " + files.length + " file(s) for update request");
        log.info("Total FIles : {}",files);
        return files;
    } catch (error) {
        log.error("Error in extractFilesForUpdate: " + error.message);
        var arr = [];
        // Return at least the current file if available
        var currentMailFile = uploadMailAndGetFileObject(mailEmlFilePvFileId,mailSubject, requestCentralRegisterId , mailAddress, messageId );
        if (null != currentMailFile) {
            arr.push(currentMailFile);
        }
        return arr;
    }
}



var startTime = java.lang.System.currentTimeMillis();


var poFields = resolveKeydataProcessingPoFields();
var customerPoNo = poFields.customerPoNo;
var vendorPoNo = poFields.vendorPoNo;
var saleOrderNo = poFields.saleOrderNo;
var isoNo = poFields.isoNo;


var requestNo = biz("RecNum") || biz("ticketRef");
var mailParsedFail = biz("mailParsedFail") || "N";
var custEmail = biz("CustName") || "";

var applicationName = biz("applicationName") || "";
var graphToken = biz("graphToken") || "";
var messageId = biz("mailId") || "";
var mailAddress = custEmail;
var requestCentralRegisterId = biz("requestCentralRegisterId") || "";
var mailSubject = biz("subject") || "";
var fromEmail = custEmail;
var ccRecipients = biz("Recipients") || "";

var mailEmlFilePvFileId = biz("mailEmlFilePvFileId") || ""; 


var category = biz("Category") || "";
var keyData = biz("KeyData") || "";
var overallSummary = biz("OverallSummary") || "";


// Get actionIDs and request exists validation
var res  = validateIfRequestNoExist(requestNo,custEmail);
var requestExists = res[0];
var actionIDs = res[1];

// Flag for all action IDs status check
var allActionIdsAreCompleted = true;
// Get actionID which is on NEW or HOLD status if any, to attach files to that actionID in update request
var actionIdForUpdate = null;
var actionIdStatusForUpdate = null;

var userIDForUpdate = null;
var userFirstNameForUpdate = null;
var userLastNameForUpdate = null;

if (requestNo && requestExists) {
    
    // Gewt all the actionIDs for the requestNo that exists
    log.info("Action IDs for requestNo " + requestNo + ": " + actionIDs);

    // Get status of all actionIds

    var actionStatusMap = getStatusOfActionIDs(actionIDs);
    log.info("Action Status Map for action IDs " + actionIDs + ": " + WE_ScriptHelper.toJson(actionStatusMap)) ;


    // Iterating through each action ID 

    for(var i=0;i<actionIDs.length;i++){
        var actionId = actionIDs[i];
        var actionStatus = actionStatusMap[actionId].status;
        var holdReason = actionStatusMap[actionId].holdReason;
        log.info("Status for action ID " + actionId + ": " + actionStatus + " , Hold Reason: " + holdReason);

        // If any of the action ID is not in completed status, 

        if(actionStatus !== "COMP" && actionStatus !== "CANC" && actionStatus !== "APPR" && actionStatus !== "DENY"){
            allActionIdsAreCompleted = false;
            actionIdForUpdate = actionId; // get the first action ID which is not completed to attach files in update request
            actionIdStatusForUpdate = actionStatus; // get the status of the action ID which is not completed
            actionHoldReasonForUpdate = holdReason; // get the hold reason of the action ID which is not completed
            // Get user information for the action ID which is not completed
            userIDForUpdate = actionStatusMap[actionId].userId;
            userFirstNameForUpdate = actionStatusMap[actionId].userFirstName;
            userLastNameForUpdate = actionStatusMap[actionId].userLastName;

            log.info("Action ID " + actionId + " is not completed. Status: " + actionStatus);
             break; // break the loop as we only need one action ID which is not completed for update request    
        }
    }

    // Decision for new action or update action based on action IDs status
    if (allActionIdsAreCompleted) {
        // All actions are completed, we will create new action in update request and attach files to that action
        var requestBody = initializeRequestBody(mailSubject,fromEmail,mailSubject);
        requestBody.additionalRecipients = extractCcRecipients(ccRecipients); //Handle CC recipients

        
        // Set brand codes based on category and subcategory
        var brandCodes = getBrandCodes(category);
        log.info(brandCodes);
        
        if (brandCodes.length === 3) {
            requestBody.brands = buildUpdateRequestBrandsBody(brandCodes, keyData, overallSummary, customerPoNo, saleOrderNo, isoNo, vendorPoNo);
        }


        
        log.info("Mail mailEmlFilePvFileId : {}", mailEmlFilePvFileId);
        // Extract files (mail attachments and mail itself)
        var files = extractFilesForUpdate(applicationName, graphToken, messageId , mailAddress, requestCentralRegisterId , mailSubject,mailEmlFilePvFileId);
        if (files.length != 0) {
            log.info("Total attached files : " + files.length);
        }


        
        if (requestBody.brands.length > 0) {
            // Attach files to the first brand
            requestBody.brands[0].files = files;
            // requestBody.brands[0].files = files; 
        }

        // var updateRequestBody = buildUpdateRequestBody(applicationName, graphToken, messageId , mailAddress , requestCentralRegisterId);
        log.info("Update request body created successfully");
        // Print pretty JSON format for UPDATE request
        try {
            var prettyJson = JSON.stringify(requestBody, null, 2);
            log.info("==========================================");
            log.info("UPDATE REQUEST BODY (Pretty JSON):");
            log.info("==========================================");
            log.info(prettyJson);
            log.info("==========================================");
        } catch (e) {
            log.info("Update Request Body: " + WE_ScriptHelper.toJson(requestBody));
        }
        // Call update request API

        

        requestBody.additionalRecipients = extractCcRecipients(ccRecipients); //Handle CC recipients
        updateExistingRequest(requestNo, requestBody);
    
    }
    else{
        // We dont need to create new action , instead we will attach files in the action which is not completed (actionIdForUpdate)
        var reasonType = null;
        var requestBody = null;
        var note = overallSummary + " || Key Data: " + keyData ;
        if (actionIdStatusForUpdate === "HOLD" && actionHoldReasonForUpdate != "RSPRCV") {
            // If the action is on HOLD status and hold reason is not RSPRCV then we will set reason type as RSPRCV ,update notes and files in the same action
            reasonType = "RSPRCV";
            requestBody = initializeUpdateRequestBodyForHold(mailSubject , fromEmail , mailSubject , note, actionIdStatusForUpdate ,reasonType,userIDForUpdate, userFirstNameForUpdate, userLastNameForUpdate, requestNo,actionIdForUpdate);
        }
        else{
            // We uts update notes and files in same action without changing the reason type 
            requestBody = initializeUpdateRequestBody(mailSubject , fromEmail , mailSubject , note, actionIdForUpdate);
        }
        
        
        requestBody.additionalRecipients = extractCcRecipients(ccRecipients); //Handle CC recipients
        

        log.info("Mail mailEmlFilePvFileId : {}", mailEmlFilePvFileId);
        // Extract files (mail attachments and mail itself)
        var files = extractFilesForUpdate(applicationName, graphToken, messageId , mailAddress, requestCentralRegisterId , mailSubject,mailEmlFilePvFileId);
        if (files.length != 0) {
            log.info("Total attached files : " + files.length);
        }

        requestBody.files = files; // Attach files at root level for update action API
        
        // var updateRequestBody = buildUpdateRequestBody(applicationName, graphToken, messageId , mailAddress , requestCentralRegisterId);
        log.info("Update request body created successfully");
        // Print pretty JSON format for UPDATE request
        try {
            var prettyJson = JSON.stringify(requestBody, null, 2);
            log.info("==========================================");
            log.info("UPDATE REQUEST BODY (Pretty JSON):");
            log.info("==========================================");
            log.info(prettyJson);
            log.info("==========================================");
        } catch (e) {
            log.info("Update Request Body: " + WE_ScriptHelper.toJson(requestBody));
        }
        // Call update request API
        if (reasonType === "RSPRCV") {
            updateExistingActionForHold(requestNo, requestBody);
        }
        else{
            updateExistingAction(requestNo, requestBody);
        }
    }
    
}
else{
    
        mailParsedFail = "Y";
}

function isJavaMapBind(value) {
    return value != null && typeof value === "object" &&
        typeof value.keySet === "function" && typeof value.get === "function";
}

function isJavaListBind(value) {
    return value != null && typeof value === "object" &&
        typeof value.size === "function" && typeof value.get === "function" &&
        typeof value.keySet !== "function";
}

function toPlainJsBind(value) {
    if (value === null || value === undefined) return null;
    var valueType = typeof value;
    if (valueType === "string" || valueType === "number" || valueType === "boolean") return value;
    if (isJavaMapBind(value)) {
        var mapObj = {};
        var iterator = value.keySet().iterator();
        while (iterator.hasNext()) {
            var mapKey = iterator.next();
            mapObj[String(mapKey)] = toPlainJsBind(value.get(mapKey));
        }
        return mapObj;
    }
    if (isJavaListBind(value)) {
        var listOut = [];
        for (var li = 0; li < value.size(); li++) listOut.push(toPlainJsBind(value.get(li)));
        return listOut;
    }
    if (Object.prototype.toString.call(value) === "[object Array]") {
        var arrOut = [];
        for (var ai = 0; ai < value.length; ai++) arrOut.push(toPlainJsBind(value[ai]));
        return arrOut;
    }
    if (valueType === "object") {
        var objOut = {};
        for (var key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) objOut[key] = toPlainJsBind(value[key]);
        }
        return objOut;
    }
    return String(value);
}

function isArrayBind(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
}

function bindTicketOnDataModel(requestNum, source, flow, failFlag) {
    var dataModel = toPlainJsBind(biz("dataModel"));
    if (dataModel == null) dataModel = {};
    if (!dataModel.casePack) dataModel.casePack = {};
    if (!dataModel.casePack.runPath) dataModel.casePack.runPath = {};
    var runPath = dataModel.casePack.runPath;
    var ok = requestNum != null && String(requestNum).trim() !== "" && failFlag !== "Y";
    if (ok) {
        runPath.ticketRef = String(requestNum).trim();
        runPath.ticketSource = source;
        runPath.rcFlow = flow;
        runPath.pipelineStage = "RC_OPENED";
        runPath.why = "rc_" + source;
    } else {
        runPath.rcFlow = flow;
        runPath.pipelineStage = "RC_FAILED";
        runPath.why = "rc_api_failed";
    }
    if (!isArrayBind(runPath.stageLog)) runPath.stageLog = [];
    runPath.stageLog.push({
        at: new Date().toISOString(),
        fromStage: "RC_VARS",
        toStage: runPath.pipelineStage,
        why: runPath.why,
        node: flow
    });
    if (!dataModel.meta) dataModel.meta = {};
    var steps = dataModel.meta.steps;
    if (!isArrayBind(steps)) steps = [];
    var found = false;
    for (var si = 0; si < steps.length; si++) {
        if (steps[si] === flow) found = true;
    }
    if (!found) steps.push(flow);
    dataModel.meta.steps = steps;
    addBizVar("dataModel", dataModel);
    addBizVar("ticketRef", runPath.ticketRef || "");
    addBizVar("ticketRefFound", runPath.ticketRef ? "Y" : "N");
    addBizVar("ticketSource", runPath.ticketSource || "");
    addBizVar("RecNum", runPath.ticketRef || "");
    log.info("[CHECKPOINT] " + flow + " ticketRef=" + (runPath.ticketRef || "") +
        " source=" + (runPath.ticketSource || "") + " mailParsedFail=" + failFlag);
}

addBizVar("mailParsedFail", mailParsedFail);
bindTicketOnDataModel(requestNo, "updateApi", "UpdateExistingRequest", mailParsedFail);
var endTime = java.lang.System.currentTimeMillis();
var executionTimeMs = endTime - startTime;
var executionTimeSeconds = (executionTimeMs / 1000).toFixed(3);
log.info("==========================================");
log.info("PushFileIdForAnalysisAndHandleServiceRequest Execution Time: " + executionTimeSeconds + " seconds (" + executionTimeMs + " ms)");
log.info("==========================================");

// --- dashboard checkpoint ---
/**
 * Fire-and-forget dashboard checkpoint. WE has no import — paste into milestone Scripts.
 * Never throws. Writes ONLY auto_triage_monitoring_dashboard:
 * one email document per recordId, each stage appended on checkpoints[].
 *
 * Collection has unique index uk_recordId. Query can return a 1-element list OR a
 * single object; insert-on-miss then 500s (E11000). Update via PUT UpdateForm:
 * { queryForm, updateObject: { $set: fields } } — not PUT /{oid} and not POST retry.
 */
function postDashboardCheckpoint(opts) {
    try {
        var recordId = String(biz("recordId") || "");
        var idpCode = String(biz("idpCode") || "request_central_dell_US");
        if (!recordId || !opts || !opts.checkpointId) return;

        var COLLECTION = "auto_triage_monitoring_dashboard";
        var systemNo = String(biz("systemNo") || biz("companyNo") || "100");
        var attempt = opts.attempt || 1;
        var node = opts.node || "";
        var occurredAt = opts.occurredAt || new Date().toISOString();
        var idempotencyKey = recordId + ":" + opts.checkpointId + ":" + attempt + (node ? ":" + node : "");
        var fields = opts.fields || {};
        fields.feature = "OptimizedWorkflow";
        if (opts.pipelineStage && !fields.pipelineStage) fields.pipelineStage = opts.pipelineStage;

        var eventDoc = {
            checkpointId: opts.checkpointId,
            id: opts.checkpointId,
            node: node,
            pipelineStage: opts.pipelineStage || "",
            status: opts.status || "succeeded",
            occurredAt: occurredAt,
            attempt: attempt,
            why: opts.why || "",
            fields: fields,
            idempotencyKey: idempotencyKey
        };

        function dashGet(obj, key) {
            if (obj == null) return null;
            if (typeof obj.get === "function") {
                var g = obj.get(key);
                if (g != null) return g;
            }
            try {
                if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] != null) return obj[key];
            } catch (ignore) {}
            return null;
        }

        function dashList(value) {
            var out = [];
            if (value == null) return out;
            if (typeof value.size === "function" && typeof value.get === "function") {
                for (var i = 0; i < value.size(); i++) out.push(value.get(i));
                return out;
            }
            if (Object.prototype.toString.call(value) === "[object Array]") {
                for (var j = 0; j < value.length; j++) out.push(value[j]);
                return out;
            }
            if (typeof value.length === "number" && value.length >= 0 && typeof value !== "string") {
                for (var k = 0; k < value.length; k++) {
                    if (value[k] != null) out.push(value[k]);
                }
            }
            return out;
        }

        function dashIsDoc(value) {
            if (value == null || typeof value !== "object") return false;
            if (Object.prototype.toString.call(value) === "[object Array]") return false;
            return dashGet(value, "recordId") != null || dashGet(value, "_id") != null;
        }

        function dashUnwrap(payload) {
            if (payload == null) return null;
            var cur = payload;
            var depth = 0;
            while (cur && depth < 4) {
                var inner = dashGet(cur, "data");
                if (inner == null) break;
                cur = inner;
                depth++;
            }
            return cur;
        }

        function dashFirstRow(payload) {
            var data = dashUnwrap(payload);
            if (data == null) return null;
            var content = dashGet(data, "content");
            var rows = dashList(content != null ? content : data);
            if (rows.length > 0) return rows[0];
            if (dashIsDoc(data)) return data;
            if (dashIsDoc(payload)) return payload;
            return null;
        }

        function dashPlain(value) {
            if (value == null) return value;
            try {
                return JSON.parse(WE_ScriptHelper.toJson(value));
            } catch (plainErr) {
                return value;
            }
        }

        function dashDupErr(err) {
            var s = String(err || "");
            return s.indexOf("E11000") >= 0 || s.indexOf("duplicate") >= 0 || s.indexOf("uk_recordId") >= 0;
        }

        function dashCall(method, path, body) {
            var result = { ok: false, body: null, err: "" };
            try {
                result.body = WE_ScriptHelper.restCall({
                    "request": {
                        "crossSystemNo": systemNo,
                        "method": method,
                        "serviceName": "rawdata-service",
                        "path": path,
                        "body": body
                    },
                    "success": function (response) {
                        result.ok = true;
                        result.body = response;
                    },
                    "responseError": function (response, exception) {
                        result.err = exception ? exception.message : WE_ScriptHelper.toJson(response);
                        result.body = response;
                    }
                });
                var st = dashGet(result.body, "status");
                if (st != null && Number(st) >= 400) {
                    result.ok = false;
                    if (!result.err) result.err = String(dashGet(result.body, "message") || st);
                } else if (!result.err) {
                    result.ok = true;
                }
            } catch (callErr) {
                result.err = callErr && callErr.message ? callErr.message : String(callErr);
            }
            return result;
        }

        var existing = null;
        var queryBody = { recordId: { "$eq": recordId } };
        var qres = dashCall(
            "POST",
            "/api/mongo/" + COLLECTION + "/queryForm?pageNo=0&pageSize=5&sortBy=updatedAt&sortType=DESC",
            queryBody
        );
        if (!qres.ok || !dashFirstRow(qres.body)) {
            qres = dashCall(
                "POST",
                "/api/mongo/" + COLLECTION + "/advanced/queryForm?limit=5",
                queryBody
            );
        }
        if (qres.err && !dashFirstRow(qres.body)) {
            log.info("[CHECKPOINT] dashboard query skip " + qres.err);
        } else {
            existing = dashFirstRow(qres.body);
        }

        var doc = {
            recordId: recordId,
            idpCode: idpCode,
            feature: "OptimizedWorkflow",
            currentStage: opts.checkpointId,
            pipelineStage: opts.pipelineStage || fields.pipelineStage || "",
            lastNode: node,
            subject: biz("subject") || fields.subject || "",
            from: biz("fromAddress") || fields.from || "",
            receivedAt: biz("receivedDateTime") || occurredAt,
            updatedAt: occurredAt,
            source: "we_checkpoint"
        };
        if (existing) {
            var createdAt = dashGet(existing, "createdAt");
            doc.createdAt = createdAt || occurredAt;
            var keep = ["subject", "from", "receivedAt", "outcome", "path", "folder",
                "aiBranch", "aiBranchReason", "leaveNonReceipts",
                "category", "categoryReason", "needsWork",
                "categoryTopHint", "categoryTopScore", "categoryBusinessHint",
                "branchTopHint", "branchTopScore",
                "SpamFlag", "spamReason", "spamConfidence",
                "ticketRef", "recNum", "CustName", "requestFlow"];
            for (var ki = 0; ki < keep.length; ki++) {
                var k = keep[ki];
                var prev = dashGet(existing, k);
                if ((doc[k] == null || doc[k] === "") && prev != null && prev !== "") doc[k] = prev;
            }
            doc.checkpoints = dashList(dashGet(existing, "checkpoints"));
        } else {
            doc.createdAt = occurredAt;
            doc.checkpoints = [];
        }
        for (var fk in fields) {
            if (Object.prototype.hasOwnProperty.call(fields, fk)) doc[fk] = fields[fk];
        }

        var duplicate = false;
        for (var ci = 0; ci < doc.checkpoints.length; ci++) {
            var row = doc.checkpoints[ci];
            if (String(dashGet(row, "idempotencyKey") || "") === idempotencyKey) {
                duplicate = true;
                break;
            }
        }
        if (!duplicate) doc.checkpoints.push(eventDoc);
        doc.checkpointsSummary = [];
        var start = doc.checkpoints.length > 3 ? doc.checkpoints.length - 3 : 0;
        for (var si = start; si < doc.checkpoints.length; si++) {
            var srow = doc.checkpoints[si];
            doc.checkpointsSummary.push({
                id: dashGet(srow, "checkpointId") || dashGet(srow, "id"),
                status: dashGet(srow, "status"),
                occurredAt: dashGet(srow, "occurredAt")
            });
        }

        function dashPutSet() {
            var setDoc = dashPlain(doc) || doc;
            if (setDoc && setDoc._id) delete setDoc._id;
            return dashCall("PUT", "/api/mongo/" + COLLECTION, {
                queryForm: { recordId: { "$eq": recordId } },
                updateObject: { "$set": setDoc }
            });
        }

        var wrote = null;
        if (existing) {
            wrote = dashPutSet();
        } else {
            wrote = dashCall("POST", "/api/mongo/" + COLLECTION, [doc]);
            if (!wrote.ok && (dashDupErr(wrote.err) || String(wrote.err || "").indexOf("Internal Server Error") >= 0)) {
                wrote = dashPutSet();
            }
        }
        if (wrote && wrote.ok) {
            log.info("[CHECKPOINT] dashboard ok " + opts.checkpointId + " recordId=" + recordId);
        } else {
            log.info("[CHECKPOINT] dashboard skip " + opts.checkpointId + " " + ((wrote && wrote.err) || ""));
        }
    } catch (e) {
        log.info("[CHECKPOINT] dashboard helper skip " + (e && e.message ? e.message : e));
    }
}

postDashboardCheckpoint({
    checkpointId: "rc_update",
    node: "updateRequest",
    pipelineStage: (mailParsedFail === "Y") ? "RC_FAILED" : "RC_OPENED",
    status: (mailParsedFail === "Y") ? "failed" : "succeeded",
    why: (mailParsedFail === "Y") ? "rc_api_failed" : "rc_updateApi",
    fields: {
        pipelineStage: (mailParsedFail === "Y") ? "RC_FAILED" : "RC_OPENED",
        requestFlow: "UpdateExistingRequest",
        rcFlow: "UpdateExistingRequest",
        ticketRef: biz("ticketRef") || "",
        linkedRequestId: biz("ticketRef") || "",
        ticketSource: "updateApi",
        duplicateFound: "Y",
        CustName: biz("CustName") || "",
        customerEmail: biz("Workflow_CustomerEmail") || "",
        mailParsedFail: mailParsedFail,
        category: biz("Category") || ""
    }
});
