# Updates the brand information and mappings
---

> NOTE: 

## Problem Statement

Currently all brand mappings are only pointing to the same brand - 24 - Cisco - Sales Operations. This is not correct in terms of brand taxonomy within request central. Brands should be mapped based on the intent of the request and then services AND sub-services should be mapped based on the intent of the request.

---

## Solution Design Approach

- [ ] Create a file that contains all brand mappings
- [ ] In that same file, create mappings for services and sub-services (if applicable)
- [ ] In the final intent agent, determine the brand based on the intent (if new request) or use the existing brand if this is an update request.
- [ ] Pass the brand and its services and sub-services as a structured payload the the create agent so that only the correct brand mappings are created.
- [ ] Update the update agent to also use the correct brand mappings and services and sub-services mappings to update requests correctly.
---

## Cisco Brand Taxonomy

### Brands

| Brand ID | Brand Name | Vendor ID | Short Description |
|---|---|---|---|
| 6 | Cisco Overlay (Cisco Hardware net new) | 64956 | Net-new Cisco hardware business — quoting, configuration, order placement, post-order support, and vendor PO release. |
| 7 | Cisco Smartnet (Services) | 64956 | Cisco Smartnet service contracts — new/renewal quoting, contract validation, case management, open/failed service orders, reporting, and general service inquiries. |
| 8 | Cisco Cloud | 64956 | Cisco cloud/subscription business — cloud quoting, provisioning, order placement, modification/renewal, and invoice & credit handling. |
| 24 | Cisco - Sales Operations | 64956 | Cisco post-sale operational support — order and case status, DSV/POS, license resends, tracking & logistics, failed orders, SKU/material management, and inventory actions. |

---

### Brand 6 — Cisco Overlay (Cisco Hardware net new)

| Service Code | Sub-Service ID | Sub-Service Code | Sub-Service Name |
|---|---|---|---|
| Quote | — | — | No sub-services defined |
| Order | — | — | No sub-services defined |
| Config | — | — | No sub-services defined |
| UPDREQ | — | — | No sub-services defined |
| PSTORD | — | — | No sub-services defined |
| CfgQte | — | — | No sub-services defined |
| VPOREL | — | — | No sub-services defined |
| GENB2B | — | — | No sub-services defined |
| EMLMTR | — | — | No sub-services defined |
| NEDRVW | — | — | No sub-services defined |

---

### Brand 7 — Cisco Smartnet (Services)

| Service Code | Sub-Service ID | Sub-Service Code | Sub-Service Name |
|---|---|---|---|
| Quote | 1 | NWRNL | New/Renewal |
| Quote | 2 | VALDT | Validation / Re-Validation |
| Quote | 3 | CRTNO | Creation Using Contact # |
| CSMGMT | 15 | NEWCAS | New Smartnet Case request |
| CSMGMT | 16 | EXTCSE | Existing case assistance |
| ODASSV | 17 | OPNORD | Smartnet Open Orders |
| ODASSV | 18 | FALORD | Smartnet Failed orders |
| REPT | — | — | No sub-services |
| GENSVS | 9 | GENRQT | General Smartnet Inquiry request |
| GENSVS | 20 | PRSDOC | Process documentation / info |
| UPDREQ | — | — | No sub-services defined |
| Order | — | — | No sub-services defined |
| GENB2B | — | — | No sub-services defined |

---

### Brand 8 — Cisco Cloud

| Service Code | Sub-Service ID | Sub-Service Code | Sub-Service Name |
|---|---|---|---|
| CLDQTE | 21 | New | New |
| CLDQTE | 22 | MOD | Modification |
| CLDQTE | 23 | REN | Renewal |
| POPLC | 4 | New | New |
| POPLC | 5 | MOD | Modification |
| POPLC | 6 | REN | Renewals |
| PSTCLD | 7 | CSSTS | Case Status |
| PSTCLD | 8 | PROVS | Provisioning |
| PSTCLD | 9 | CNCL | Cancel |
| PSTCLD | 52 | CASREQ | Case Request |
| PSTCLD | 53 | ORDSTS | Order Status |
| Order | 24 | NEW | New |
| Order | 25 | MOD | Modification |
| Order | 26 | REN | Renewal |
| INVCRD | 10 | CRDT | Credit Request |
| INVCRD | 11 | DESCPY | Invoice Discrepancy |
| Quote | 49 | New | New |
| Quote | 50 | MOD | Modification |
| Quote | 51 | REN | Renewal |
| UPDREQ | — | — | No sub-services |
| CLDORD | 62 | New | New |
| CLDORD | 63 | MOD | Modification |
| CLDORD | 64 | REN | Renewals |
| EMLMTR | — | — | No sub-services |
| NEDRVW | — | — | No sub-services |

---

### Brand 24 — Cisco - Sales Operations

| Service Code | Sub-Service ID | Sub-Service Code | Sub-Service Name |
|---|---|---|---|
| ORDSTS | 27 | ORDSTS | Order Status |
| ORDSTS | 28 | ISUSUB | Issue Submission |
| ORDSTS | 29 | ISUSAT | Issue Status |
| CSMGMT | 30 | CSESTS | Case Status |
| CSMGMT | 31 | NEWCAS | New Case Request |
| DSVPOS | 32 | DSVGEN | DSV General |
| DSVPOS | 33 | POSSTS | POS Status |
| LICSND | 34 | RSDREQ | Resend Request |
| LICSND | 35 | RSDSTS | Resend Status |
| TRKLOG | 36 | TRKREQ | Tracking Request |
| TRKLOG | 37 | BCKSTS | Backorder Status |
| TRKLOG | 38 | DSRERT | Drop Ship Re-Route Request |
| TRKLOG | 39 | SHPDOC | Shipping Documentation (POD or Packing Slips) |
| FALORD | 40 | VPOISU | Vendor PO Issues (re-que issues) |
| FALORD | 41 | FLDORD | Failed Order |
| MATOPS | 42 | SKULD | SKU Load |
| MATOPS | 43 | SKUMGT | SKU Management |
| IVNMGT | 44 | STKREQ | Stock Request |
| IVNMGT | 45 | BCK2 | Back to Back (B2B) |
| IVNMGT | 46 | HLDORD | Hold Order |
| IVNMGT | 47 | SPACHG | SPA Change |
| IVNMGT | 48 | PRTNAT | Partner Authorization |
| UPDREQ | — | — | No sub-services |
| EMLMTR | — | — | No sub-services |
| NEDRVW | — | — | No sub-services |

