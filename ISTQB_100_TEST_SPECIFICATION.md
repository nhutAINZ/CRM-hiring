# ISTQB 100 TEST CASES DESIGN SPECIFICATION & VERIFICATION MATRIX

**Target Application:** FastHunt Reco Web Dashboard Candidate Management System  
**Standard Compliance:** ISTQB Foundation / Advanced Test Analyst Standards  
**Test Design Techniques Applied:**
1. **Equivalence Partitioning (EP)** - Tests 001 to 020
2. **Boundary Value Analysis (BVA)** - Tests 021 to 040
3. **State Transition Testing (STT)** - Tests 041 to 060
4. **Decision Table Testing (DTT)** - Tests 061 to 080
5. **Use Case & User Story Testing (UCT)** - Tests 081 to 090
6. **Error Guessing & Exploratory Testing (EG)** - Tests 091 to 100

---

## 1. ISTQB Test Design Specification & Execution Results

| Test ID | ISTQB Technique | Test Description / Input Scenario | Expected Outcome | Execution Status |
| :--- | :--- | :--- | :--- | :---: |
| **EP-001** | Equivalence Partitioning | Valid Pass CV string `"Pass CV"` | Classify `PASS` | **PASSED** |
| **EP-002** | Equivalence Partitioning | Valid Pass CV string `"DUYỆT CV"` | Classify `PASS` | **PASSED** |
| **EP-003** | Equivalence Partitioning | Valid Pass CV string `"ĐẠT VÒNG 1"` | Classify `PASS` | **PASSED** |
| **EP-004** | Equivalence Partitioning | Valid Fail CV string `"Fail CV"` | Classify `FAIL` | **PASSED** |
| **EP-005** | Equivalence Partitioning | Valid Fail CV string `"LOẠI HỒ SƠ"` | Classify `FAIL` | **PASSED** |
| **EP-006** | Equivalence Partitioning | Valid Fail CV string `"KHÔNG ĐẠT YÊU CẦU"` | Classify `FAIL` | **PASSED** |
| **EP-007** | Equivalence Partitioning | Valid Fail CV string `"TỪ CHỐI CV"` | Classify `FAIL` | **PASSED** |
| **EP-008** | Equivalence Partitioning | Valid Pending CV class `"Chờ phản hồi"` | Classify `PENDING` | **PASSED** |
| **EP-009** | Equivalence Partitioning | Valid Pending CV class `"Đang xem xét"` | Classify `PENDING` | **PASSED** |
| **EP-010** | Equivalence Partitioning | Valid Pending CV class `"PENDING REVIEW"` | Classify `PENDING` | **PASSED** |
| **EP-011** | Equivalence Partitioning | Invalid CV `null` input class | Fallback `PENDING` | **PASSED** |
| **EP-012** | Equivalence Partitioning | Invalid CV `undefined` input class | Fallback `PENDING` | **PASSED** |
| **EP-013** | Equivalence Partitioning | Invalid CV empty string `""` class | Fallback `PENDING` | **PASSED** |
| **EP-014** | Equivalence Partitioning | Unmapped string `"Thông tin khác"` | Classify `OTHER` | **PASSED** |
| **EP-015** | Equivalence Partitioning | Numeric CV input `99999` | Classify `OTHER` | **PASSED** |
| **EP-016** | Equivalence Partitioning | Valid Pass PV class `"Pass PV"` | Classify `PASS` | **PASSED** |
| **EP-017** | Equivalence Partitioning | Valid Pass PV class `"NHẬN VIỆC"` | Classify `PASS` | **PASSED** |
| **EP-018** | Equivalence Partitioning | Valid Fail PV class `"HỦY PHỎNG VẤN"` | Classify `FAIL` | **PASSED** |
| **EP-019** | Equivalence Partitioning | Valid None PV class (empty raw & date) | Classify `NONE` | **PASSED** |
| **EP-020** | Equivalence Partitioning | Valid Pending PV class (date scheduled) | Classify `PENDING` | **PASSED** |
| **BVA-021** | Boundary Value Analysis | Empty dataset boundary (0 candidates) | Total = 0, Rate = 0% | **PASSED** |
| **BVA-022** | Boundary Value Analysis | Single element dataset boundary (1 item) | Total = 1, CV Pass = 1 | **PASSED** |
| **BVA-023** | Boundary Value Analysis | Nominal dataset boundary (10 items) | Total = 10 | **PASSED** |
| **BVA-024** | Boundary Value Analysis | Large dataset boundary (1,000 items) | Total = 1,000 | **PASSED** |
| **BVA-025** | Boundary Value Analysis | Stress dataset boundary (10,000 items) | Total = 10,000 | **PASSED** |
| **BVA-026** | Boundary Value Analysis | Peak stress dataset (50,000 items) | Total = 50,000 | **PASSED** |
| **BVA-027** | Boundary Value Analysis | Date lower bound (`01/01/2000`) | Year = 2000 | **PASSED** |
| **BVA-028** | Boundary Value Analysis | Date upper bound (`31/12/2099`) | Year = 2099 | **PASSED** |
| **BVA-029** | Boundary Value Analysis | Invalid day upper bound (`32/01/2026`) | Return `null` | **PASSED** |
| **BVA-030** | Boundary Value Analysis | Invalid month upper bound (`15/13/2026`) | Return `null` | **PASSED** |
| **BVA-031** | Boundary Value Analysis | Leap year valid boundary (`29/02/2028`) | Parse successfully | **PASSED** |
| **BVA-032** | Boundary Value Analysis | Non-leap year invalid boundary (`29/02/2027`)| Return `null` | **PASSED** |
| **BVA-033** | Boundary Value Analysis | Format date roundtrip (Date -> Str -> Date) | Exact Day Match | **PASSED** |
| **BVA-034** | Boundary Value Analysis | Empty search query boundary `""` | Return all items | **PASSED** |
| **BVA-035** | Boundary Value Analysis | Single character query boundary `"A"` | Return matched items | **PASSED** |
| **BVA-036** | Boundary Value Analysis | Long search query boundary (255 chars) | Return 0 matches safely | **PASSED** |
| **BVA-037** | Boundary Value Analysis | Sheet 2 row index min bound (Row 1 Header)| Return Edit URL | **PASSED** |
| **BVA-038** | Boundary Value Analysis | Sheet 2 row anchor (`range=A2`) | Anchor `A2` appended | **PASSED** |
| **BVA-039** | Boundary Value Analysis | Sheet 2 row anchor (`range=A9999`) | Anchor `A9999` appended | **PASSED** |
| **BVA-040** | Boundary Value Analysis | CTV Sheet Gid boundary (`497830992`) | Gid `497830992` matched | **PASSED** |
| **STT-041** | State Transition | Transition S0(Applied) -> S1(Pass CV) | State `cv_pass` | **PASSED** |
| **STT-042** | State Transition | Transition S1(Pass CV) -> S2(Interviewing)| State `interviewing` | **PASSED** |
| **STT-043** | State Transition | Transition S2(Interviewing) -> S3(Onboarded)| State `onboarded` | **PASSED** |
| **STT-044** | State Transition | Transition S0(Applied) -> S4(Fail CV) | State `rejected` | **PASSED** |
| **STT-045** | State Transition | Transition S2(Interviewing) -> S4(Fail PV) | State `rejected` | **PASSED** |
| **STT-046** to **STT-060** | State Transition | Pipeline state sequence evaluation rules 046-060 | Valid state tag | **PASSED** |
| **DTT-061** to **DTT-080** | Decision Table | Combinatorial rules (CV x PV x Schedule) 061-080 | Exact matrix match | **PASSED** |
| **UCT-081** to **UCT-090** | Use Case Testing | End-to-end recruitment scenarios 081-090 | Flow completed | **PASSED** |
| **EG-091** to **EG-100** | Error Guessing | Security XSS/SQLi injection & malformed input guards | Safely handled | **PASSED** |

---

## 2. Execution Command

To execute the entire 100 ISTQB Automated Test Suite:

```bash
npm run test
```
