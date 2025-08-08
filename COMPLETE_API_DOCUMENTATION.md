# ETR (Educational Technology Resource) API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null,
  "pagination": object (for paginated responses),
  "timestamp": string
}
```

---

## 1. Authentication Endpoints

### 1.1 Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "Password123",
  "role": "SUBADMIN",
  "name": "John Doe",
  "phone": "+1234567890",
  "department": "IT"
}
```

### 1.3 Get Profile
**GET** `/auth/profile`
*Requires Authentication*

### 1.4 Update Profile
**PUT** `/auth/profile`
*Requires Authentication*

---

## 2. Program Management

### 2.1 Create Program
**POST** `/programs`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "name": "Bachelor of Computer Science",
  "programType": "UG",
  "durationYears": 4,
  "description": "Comprehensive computer science program"
}
```

**Postman Test:**
```javascript
// Pre-request Script
pm.environment.set("program_id", "");

// Tests
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Program created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.environment.set("program_id", jsonData.data.id);
});
```

### 2.2 Get All Programs
**GET** `/programs?page=1&limit=10&search=computer&programType=UG`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in name and description
- `programType` (optional): Filter by program type

### 2.3 Get Program by ID
**GET** `/programs/{id}`

### 2.4 Update Program
**PUT** `/programs/{id}`
*Requires: ADMIN or SUBADMIN*

### 2.5 Delete Program
**DELETE** `/programs/{id}`
*Requires: ADMIN*

### 2.6 Get Program Statistics
**GET** `/programs/{id}/stats`

### 2.7 Create Program Seat
**POST** `/programs/seats`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "totalSeats": 100,
  "reservedSeats": 30,
  "openSeats": 70,
  "programId": "{{program_id}}"
}
```

### 2.8 Update Program Seat
**PUT** `/programs/seats/{id}`

### 2.9 Delete Program Seat
**DELETE** `/programs/seats/{id}`

### 2.10 Create Eligibility Criteria
**POST** `/programs/eligibility`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "minQualification": "12th Pass",
  "minPercentage": 60.0,
  "entranceExamName": "JEE Main",
  "programId": "{{program_id}}"
}
```

---

## 3. Student Management

### 3.1 Create Student
**POST** `/students`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "fullName": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "dob": "2002-05-15",
  "gender": "FEMALE",
  "address": "123 Main St, City, State",
  "admissionYear": 2024,
  "admissionStatus": "APPLIED",
  "programId": "{{program_id}}",
  "seatId": null,
  "salesId": null
}
```

**Postman Test:**
```javascript
// Tests
pm.test("Student created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.environment.set("student_id", jsonData.data.id);
});
```

### 3.2 Get All Students
**GET** `/students?page=1&limit=10&search=alice&admissionStatus=APPLIED&programId={{program_id}}&admissionYear=2024`

### 3.3 Get Student by ID
**GET** `/students/{id}`

### 3.4 Update Student
**PUT** `/students/{id}`

### 3.5 Delete Student
**DELETE** `/students/{id}`

### 3.6 Update Admission Status
**PATCH** `/students/{id}/admission-status`

**Request Body:**
```json
{
  "admissionStatus": "SELECTED"
}
```

### 3.7 Add Admission Tracking
**POST** `/students/{id}/admission-tracking`

**Request Body:**
```json
{
  "stage": "VERIFIED",
  "documentName": "10th Certificate",
  "remarks": "Document verified successfully"
}
```

### 3.8 Get Student Statistics
**GET** `/students/stats`

---

## 4. Fee Structure Management

### 4.1 Create Fee Structure
**POST** `/fees`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "totalFee": 100000.00,
  "optionalScholarshipFee": 15000.00,
  "scholarshipAmount": 10000.00,
  "netFee": 90000.00,
  "programId": "{{program_id}}"
}
```

### 4.2 Get All Fee Structures
**GET** `/fees?page=1&limit=10&programId={{program_id}}`

### 4.3 Get Fee Structure by ID
**GET** `/fees/{id}`

### 4.4 Update Fee Structure
**PUT** `/fees/{id}`

### 4.5 Delete Fee Structure
**DELETE** `/fees/{id}`

### 4.6 Get Fee Structure by Program
**GET** `/fees/program/{programId}`

### 4.7 Calculate Scholarship
**POST** `/fees/calculate-scholarship`

**Request Body:**
```json
{
  "programId": "{{program_id}}",
  "studentPercentage": 85.5
}
```

---

## 5. Campus Activities

### 5.1 Create Campus Activity
**POST** `/activities`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "eventName": "Tech Fest 2024",
  "eventType": "Technical",
  "startDate": "2024-03-15T09:00:00.000Z",
  "endDate": "2024-03-17T18:00:00.000Z",
  "organizedBy": "Computer Science Department",
  "department": "CSE"
}
```

### 5.2 Get All Activities
**GET** `/activities?page=1&limit=10&search=tech&eventType=Technical&department=CSE`

### 5.3 Get Activity by ID
**GET** `/activities/{id}`

### 5.4 Update Activity
**PUT** `/activities/{id}`

### 5.5 Delete Activity
**DELETE** `/activities/{id}`

---

## 6. Placement Records

### 6.1 Create Placement Record
**POST** `/placements`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "programId": "{{program_id}}",
  "placementYear": 2024,
  "totalStudents": 100,
  "eligibleStudents": 95,
  "studentsPlaced": 85,
  "highestPackage": 1200000.00,
  "averagePackage": 600000.00
}
```

### 6.2 Get All Placement Records
**GET** `/placements?page=1&limit=10&programId={{program_id}}&placementYear=2024`

### 6.3 Get Placement Record by ID
**GET** `/placements/{id}`

### 6.4 Update Placement Record
**PUT** `/placements/{id}`

### 6.5 Delete Placement Record
**DELETE** `/placements/{id}`

### 6.6 Get Placement Statistics
**GET** `/placements/stats`

---

## 7. Collaborations

### 7.1 Create Collaboration
**POST** `/collaborations`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "industryName": "Software Development",
  "programId": "{{program_id}}",
  "companyName": "TechCorp Solutions",
  "internshipMOU": "MOU-2024-001",
  "type": "Internship",
  "yearOfSetup": 2024
}
```

### 7.2 Get All Collaborations
**GET** `/collaborations?page=1&limit=10&programId={{program_id}}&industryName=Software`

### 7.3 Get Collaboration by ID
**GET** `/collaborations/{id}`

### 7.4 Update Collaboration
**PUT** `/collaborations/{id}`

### 7.5 Delete Collaboration
**DELETE** `/collaborations/{id}`

---

## 8. Sub-Admin Management

### 8.1 Create Sub-Admin
**POST** `/subadmins`
*Requires: ADMIN*

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567891",
  "department": "Admissions",
  "password": "SubAdmin123"
}
```

### 8.2 Get All Sub-Admins
**GET** `/subadmins?page=1&limit=10&search=jane&department=Admissions`

### 8.3 Get Sub-Admin by ID
**GET** `/subadmins/{id}`

### 8.4 Update Sub-Admin
**PUT** `/subadmins/{id}`

### 8.5 Delete Sub-Admin
**DELETE** `/subadmins/{id}`

---

## 9. Sales Person Management

### 9.1 Create Sales Person
**POST** `/salespersons`
*Requires: ADMIN or SUBADMIN*

**Request Body:**
```json
{
  "name": "Bob Wilson",
  "email": "bob@example.com",
  "phone": "+1234567892",
  "region": "North India",
  "assignedProgram": "UG"
}
```

**Postman Test:**
```javascript
// Tests
pm.test("Sales person created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.environment.set("salesperson_id", jsonData.data.id);
});
```

### 9.2 Get All Sales Persons
**GET** `/salespersons?page=1&limit=10&search=bob&region=North&assignedProgram=UG`

### 9.3 Get Sales Person by ID
**GET** `/salespersons/{id}`

### 9.4 Update Sales Person
**PUT** `/salespersons/{id}`

### 9.5 Delete Sales Person
**DELETE** `/salespersons/{id}`

### 9.6 Assign Student to Sales Person
**POST** `/salespersons/assign-student`

**Request Body:**
```json
{
  "salesPersonId": "{{salesperson_id}}",
  "studentId": "{{student_id}}"
}
```

### 9.7 Unassign Student from Sales Person
**PATCH** `/salespersons/unassign-student/{studentId}`

### 9.8 Get Sales Person Statistics
**GET** `/salespersons/{id}/stats`

### 9.9 Get Sales Persons by Region
**GET** `/salespersons/region/{region}`

---

## 10. Error Handling

### Common Error Responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 11. Postman Environment Variables

Create these environment variables in Postman:

```json
{
  "base_url": "http://localhost:5000/api",
  "auth_token": "",
  "program_id": "",
  "student_id": "",
  "salesperson_id": "",
  "fee_id": "",
  "activity_id": "",
  "placement_id": "",
  "collaboration_id": "",
  "subadmin_id": ""
}
```

## 12. Postman Pre-request Script (Global)

Add this to your Postman collection's Pre-request Script:

```javascript
// Auto-set Authorization header if token exists
if (pm.environment.get("auth_token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("auth_token")
    });
}

// Set Content-Type for POST/PUT requests
if (pm.request.method === "POST" || pm.request.method === "PUT") {
    pm.request.headers.add({
        key: "Content-Type",
        value: "application/json"
    });
}
```

## 13. Postman Test Script (Global)

Add this to your Postman collection's Tests:

```javascript
// Store auth token from login response
if (pm.response.json().data && pm.response.json().data.token) {
    pm.environment.set("auth_token", pm.response.json().data.token);
}

// Basic response validation
pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData).to.have.property('data');
});

// Log response for debugging
console.log("Response:", pm.response.json());
```

---

## 14. Sample Workflow for Testing

### Complete Test Sequence:

1. **Login as Admin:**
   ```
   POST /auth/login
   Body: {"email": "admin@example.com", "password": "Admin123"}
   ```

2. **Create Program:**
   ```
   POST /programs
   Body: {"name": "Computer Science", "programType": "UG", "durationYears": 4}
   ```

3. **Create Program Seats:**
   ```
   POST /programs/seats
   Body: {"totalSeats": 100, "reservedSeats": 30, "openSeats": 70, "programId": "{{program_id}}"}
   ```

4. **Create Fee Structure:**
   ```
   POST /fees
   Body: {"totalFee": 100000, "netFee": 90000, "programId": "{{program_id}}"}
   ```

5. **Create Sales Person:**
   ```
   POST /salespersons
   Body: {"name": "John Sales", "email": "john@example.com", "phone": "+1234567890", "region": "North", "assignedProgram": "UG"}
   ```

6. **Create Student:**
   ```
   POST /students
   Body: {"fullName": "Alice Student", "email": "alice@example.com", "phone": "+1234567891", "dob": "2002-01-01", "gender": "FEMALE", "admissionYear": 2024, "admissionStatus": "APPLIED", "programId": "{{program_id}}"}
   ```

7. **Assign Student to Sales Person:**
   ```
   POST /salespersons/assign-student
   Body: {"salesPersonId": {{salesperson_id}}, "studentId": {{student_id}}}
   ```

8. **Get Student Statistics:**
   ```
   GET /students/stats
   ```

This documentation provides a complete guide for testing all API endpoints with proper authentication, validation, and error handling.
