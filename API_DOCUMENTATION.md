

## Table of Contents
1. [Authentication](#authentication)
2. [Programs](#programs)
3. [Students](#students)
4. [Fee Structures](#fee-structures)
5. [Campus Activities](#campus-activities)
6. [Placement Records](#placement-records)
7. [Collaborations](#collaborations)
8. [Sub-Admins](#sub-admins)
9. [Error Codes](#error-codes)
10. [Testing Examples](#testing-examples)

## Base URL
```
http://localhost:4000/api
```

## Authentication

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "admin@etr.com",
  "password": "admin123"
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
      "email": "admin@etr.com",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "rahul.kumar@student.com",
  "password": "password123",
  "role": "STUDENT",
  "fullName": "Rahul Kumar",
  "phone": "+919876543210",
  "dob": "2000-01-01",
  "gender": "MALE",
  "admissionYear": 2024,
  "admissionStatus": "APPLIED",
  "programId": "btech-cs-2024"
}
```

### Get Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

## Programs

### Get All Programs
**GET** `/programs?page=1&limit=10&search=computer&programType=BACHELORS`

**Response:**
```json
{
  "success": true,
  "message": "Programs retrieved successfully",
  "data": [
    {
      "id": "btech-cs-2024",
      "name": "B.Tech Computer Science",
      "programType": "BACHELORS",
      "durationYears": 4,
      "description": "Bachelor of Technology in Computer Science and Engineering",
      "seats": [...],
      "fees": [...],
      "eligibility": [...],
      "_count": {
        "students": 120,
        "placements": 3,
        "collaborations": 5
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Program by ID
**GET** `/programs/btech-cs-2024`

### Get Program Statistics
**GET** `/programs/btech-cs-2024/stats`

### Create Program
**POST** `/programs`

**Request Body:**
```json
{
  "name": "M.Tech Artificial Intelligence",
  "programType": "MASTERS",
  "durationYears": 2,
  "description": "Master of Technology in Artificial Intelligence and Machine Learning"
}
```

### Update Program
**PUT** `/programs/btech-cs-2024`

### Delete Program
**DELETE** `/programs/btech-cs-2024`

## Students

### Get All Students
**GET** `/students?page=1&limit=10&search=rahul&admissionStatus=REGISTERED&programId=btech-cs-2024`

### Get Student Statistics
**GET** `/students/stats`

**Response:**
```json
{
  "success": true,
  "message": "Student statistics retrieved successfully",
  "data": {
    "admissionStatusStats": [
      {
        "admissionStatus": "REGISTERED",
        "_count": { "id": 150 }
      },
      {
        "admissionStatus": "APPLIED",
        "_count": { "id": 45 }
      },
      {
        "admissionStatus": "SELECTED",
        "_count": { "id": 30 }
      }
    ],
    "totalStudents": 225,
    "programStats": [...],
    "yearStats": [...]
  }
}
```

### Get Student by ID
**GET** `/students/1`

### Create Student
**POST** `/students`

**Request Body:**
```json
{
  "fullName": "Priya Sharma",
  "email": "priya.sharma@student.com",
  "phone": "+919876543210",
  "dob": "2001-03-15",
  "gender": "FEMALE",
  "address": "123, MG Road, Bangalore, Karnataka - 560001",
  "admissionYear": 2024,
  "admissionStatus": "APPLIED",
  "programId": "btech-cs-2024"
}
```

### Update Admission Status
**PATCH** `/students/1/admission-status`

**Request Body:**
```json
{
  "admissionStatus": "REGISTERED"
}
```

### Add Admission Tracking
**POST** `/students/1/tracking`

**Request Body:**
```json
{
  "stage": "VERIFIED",
  "documentName": "10th and 12th Marksheets",
  "remarks": "Academic documents verified successfully"
}
```

## Fee Structures

### Get All Fee Structures
**GET** `/fees?page=1&limit=10&programId=btech-cs-2024`

### Get Fee Structure by Program
**GET** `/fees/program/btech-cs-2024`

### Calculate Scholarship
**POST** `/fees/calculate-scholarship`

**Request Body:**
```json
{
  "programId": "btech-cs-2024",
  "studentPercentage": 85
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scholarship calculated successfully",
  "data": {
    "program": {
      "name": "B.Tech Computer Science"
    },
    "totalFee": 800000,
    "studentPercentage": 85,
    "scholarshipAmount": 120000,
    "finalFee": 680000,
    "scholarshipPercentage": "15.00"
  }
}
```

### Create Fee Structure
**POST** `/fees`

**Request Body:**
```json
{
  "totalFee": 900000,
  "optionalScholarshipFee": 120000,
  "scholarshipAmount": 180000,
  "netFee": 720000,
  "programId": "btech-cs-2024"
}
```

## Campus Activities

### Get All Activities
**GET** `/activities?page=1&limit=10&search=techfest&eventType=FESTIVAL&status=upcoming`

### Get Upcoming Activities
**GET** `/activities/upcoming`

### Get Ongoing Activities
**GET** `/activities/ongoing`

### Get Activity Statistics
**GET** `/activities/stats`

### Create Activity
**POST** `/activities`

**Request Body:**
```json
{
  "eventName": "Annual TechFest 2024",
  "eventType": "FESTIVAL",
  "startDate": "2024-03-15T09:00:00Z",
  "endDate": "2024-03-17T17:00:00Z",
  "organizedBy": "Computer Science Department",
  "department": "Computer Science"
}
```

## Placement Records

### Get All Placement Records
**GET** `/placements?page=1&limit=10&programId=btech-cs-2024&placementYear=2023`

### Get Placement Statistics
**GET** `/placements/stats`

### Get Top Performing Programs
**GET** `/placements/top-performing?limit=5&year=2023`

### Create Placement Record
**POST** `/placements`

**Request Body:**
```json
{
  "programId": "btech-cs-2024",
  "placementYear": 2024,
  "totalStudents": 120,
  "eligibleStudents": 100,
  "studentsPlaced": 85,
  "highestPackage": 4500000,
  "averagePackage": 850000
}
```

## Collaborations

### Get All Collaborations
**GET** `/collaborations?page=1&limit=10&programId=btech-cs-2024&type=INTERNSHIP`

### Search Collaborations
**GET** `/collaborations/search?query=tcs&type=PLACEMENT`

### Get Collaborations by Program
**GET** `/collaborations/program/btech-cs-2024`

### Create Collaboration
**POST** `/collaborations`

**Request Body:**
```json
{
  "industryName": "Information Technology",
  "programId": "btech-cs-2024",
  "companyName": "TCS (Tata Consultancy Services)",
  "internshipMOU": "MOU-2024-001",
  "type": "PLACEMENT",
  "yearOfSetup": 2024
}
```

## Sub-Admins

### Get All Sub-Admins
**GET** `/subadmins?page=1&limit=10&search=professor&department=Computer Science`

### Create Sub-Admin
**POST** `/subadmins`

**Request Body:**
```json
{
  "name": "Dr. Rajesh Kumar",
  "email": "rajesh.kumar@etr.com",
  "phone": "+919876543210",
  "department": "Computer Science",
  "password": "password123"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation Error |
| 401 | Unauthorized - Authentication Required |
| 403 | Forbidden - Insufficient Permissions |
| 404 | Not Found |
| 409 | Conflict - Duplicate Entry |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Error Response Format
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
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing Examples

### Using cURL

#### 1. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@etr.com",
    "password": "admin123"
  }'
```

#### 2. Get Programs (with token)
```bash
curl -X GET http://localhost:4000/api/programs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Create Student
```bash
curl -X POST http://localhost:4000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Amit Patel",
    "email": "amit.patel@student.com",
    "phone": "+919876543210",
    "dob": "2000-07-20",
    "gender": "MALE",
    "address": "456, Koramangala, Bangalore, Karnataka - 560034",
    "admissionYear": 2024,
    "admissionStatus": "APPLIED",
    "programId": "btech-cs-2024"
  }'
```

### Using Postman

1. **Set up environment variables:**
   - `base_url`: `http://localhost:4000/api`
   - `token`: (from login response)

2. **Create a collection with these requests:**

#### Login Request
- Method: POST
- URL: `{{base_url}}/auth/login`
- Body (raw JSON):
```json
{
  "email": "admin@etr.com",
  "password": "admin123"
}
```

#### Get Programs Request
- Method: GET
- URL: `{{base_url}}/programs`
- Headers: `Authorization: Bearer {{token}}`

#### Create Student Request
- Method: POST
- URL: `{{base_url}}/students`
- Headers: `Authorization: Bearer {{token}}`
- Body (raw JSON):
```json
{
  "fullName": "Neha Singh",
  "email": "neha.singh@student.com",
  "phone": "+919876543210",
  "dob": "2001-11-10",
  "gender": "FEMALE",
  "address": "789, Indiranagar, Bangalore, Karnataka - 560038",
  "admissionYear": 2024,
  "admissionStatus": "APPLIED",
  "programId": "btech-cs-2024"
}
```

## Sample Data (Indian Context)

After running the seeder (`npm run seed`), you'll have:

### Users
- **Admin**: `admin@etr.com` / `admin123`
- **Sub-Admin**: `subadmin@etr.com` / `subadmin123`
- **Students**: 
  - `rahul.kumar@student.com` / `student123`
  - `priya.sharma@student.com` / `student123`

### Programs (Indian Educational Context)
- **B.Tech Computer Science** - 4 years, ₹8,00,000 total fee
- **M.Tech Information Technology** - 2 years, ₹12,00,000 total fee
- **MBA (Master of Business Administration)** - 2 years, ₹15,00,000 total fee

### Eligibility Criteria (Indian Standards)
- **B.Tech**: 12th Standard with 75% minimum, JEE Main
- **M.Tech**: Bachelor's Degree with 70% minimum, GATE
- **MBA**: Bachelor's Degree with 65% minimum, CAT

### Sample Data
- 3 Programs with fee structures and eligibility criteria
- 2 Students with admission tracking
- 2 Campus activities (TechFest, Career Fair)
- 2 Placement records (TCS, Infosys)
- 2 Collaborations (TCS, Wipro)

## Indian Educational Institution Features

### Admission Process
- **Application Stage**: Student applies with documents
- **Verification Stage**: Documents verified by admin
- **Selection Stage**: Student selected based on criteria
- **Registration Stage**: Student completes registration
- **Rejection Stage**: Application rejected if criteria not met

### Fee Structure (Indian Context)
- **Total Fee**: Complete program fee
- **Scholarship Fee**: Optional scholarship amount
- **Net Fee**: Final amount after scholarship
- **Payment Plans**: Semester-wise or yearly payment options

### Placement Statistics (Indian Standards)
- **Highest Package**: In LPA (Lakhs Per Annum)
- **Average Package**: Average CTC offered
- **Placement Percentage**: Students placed vs eligible
- **Top Recruiters**: TCS, Infosys, Wipro, etc.

### Campus Activities (Indian Context)
- **TechFest**: Technical competitions and workshops
- **Cultural Fest**: Cultural events and performances
- **Sports Meet**: Annual sports competitions
- **Career Fair**: Industry interaction and placement drives
- **Alumni Meet**: Networking with alumni

## Rate Limiting

The API implements rate limiting:
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-*` headers are included in responses

## Security Features

- **CORS**: Configured for frontend integration
- **Helmet**: Security headers
- **Input Validation**: All inputs are validated
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevents abuse

## Development Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for program IDs
- Pagination is implemented for all list endpoints
- Error responses are consistent across all endpoints
- Authentication is required for all endpoints except login/register
- Indian phone numbers and addresses are supported
- Fee amounts are in Indian Rupees (₹)
- Placement packages are in LPA (Lakhs Per Annum) 