# ETR Backend API - Indian Educational Institutions

A comprehensive backend API for Indian educational institution management system built with Node.js, Express, and Prisma.

## Features

- 🔐 **Authentication & Authorization** - JWT-based authentication with role-based access control
- 👥 **User Management** - Admin, Sub-Admin, and Student roles
- 📚 **Program Management** - Create and manage academic programs (B.Tech, M.Tech, MBA)
- 🎓 **Student Management** - Complete student lifecycle management with Indian admission process
- 💰 **Fee Management** - Fee structures and scholarship calculations in Indian Rupees
- 🏫 **Campus Activities** - Event and activity management (TechFest, Cultural Fest, Career Fair)
- 📊 **Placement Records** - Placement statistics and tracking with LPA (Lakhs Per Annum)
- 🤝 **Collaborations** - Industry partnerships with Indian companies (TCS, Infosys, etc.)
- 📈 **Statistics & Analytics** - Comprehensive reporting and analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/etr_db"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed database with Indian educational context
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:4000`

## API Documentation

### Authentication

#### POST /api/auth/login
Login with email and password.
```json
{
  "email": "admin@etr.com",
  "password": "admin123"
}
```

#### POST /api/auth/register
Register a new user.
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

#### GET /api/auth/profile
Get current user profile (requires authentication).

#### PUT /api/auth/profile
Update current user profile (requires authentication).

### Programs

#### GET /api/programs
Get all programs with pagination and filtering.
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string
- programType: string
```

#### GET /api/programs/:id
Get program by ID.

#### GET /api/programs/:id/stats
Get program statistics.

#### POST /api/programs
Create a new program (Admin/SubAdmin only).
```json
{
  "name": "B.Tech Computer Science",
  "programType": "BACHELORS",
  "durationYears": 4,
  "description": "Bachelor of Technology in Computer Science and Engineering"
}
```

#### PUT /api/programs/:id
Update program (Admin/SubAdmin only).

#### DELETE /api/programs/:id
Delete program (Admin only).

### Students

#### GET /api/students
Get all students with pagination and filtering.
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string
- admissionStatus: string
- programId: string
- admissionYear: number
```

#### GET /api/students/stats
Get student statistics.

#### GET /api/students/:id
Get student by ID.

#### POST /api/students
Create a new student (Admin/SubAdmin only).
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

#### PUT /api/students/:id
Update student (Admin/SubAdmin only).

#### DELETE /api/students/:id
Delete student (Admin only).

#### PATCH /api/students/:id/admission-status
Update admission status (Admin/SubAdmin only).
```json
{
  "admissionStatus": "REGISTERED"
}
```

#### POST /api/students/:id/tracking
Add admission tracking record (Admin/SubAdmin only).
```json
{
  "stage": "VERIFIED",
  "documentName": "10th and 12th Marksheets",
  "remarks": "Academic documents verified successfully"
}
```

### Fee Structures

#### GET /api/fees
Get all fee structures with pagination.

#### GET /api/fees/:id
Get fee structure by ID.

#### GET /api/fees/program/:programId
Get fee structure for a specific program.

#### POST /api/fees/calculate-scholarship
Calculate scholarship based on student percentage.
```json
{
  "programId": "btech-cs-2024",
  "studentPercentage": 85
}
```

#### POST /api/fees
Create fee structure (Admin/SubAdmin only).
```json
{
  "totalFee": 800000,
  "optionalScholarshipFee": 100000,
  "scholarshipAmount": 150000,
  "netFee": 650000,
  "programId": "btech-cs-2024"
}
```

#### PUT /api/fees/:id
Update fee structure (Admin/SubAdmin only).

#### DELETE /api/fees/:id
Delete fee structure (Admin only).

### Campus Activities

#### GET /api/activities
Get all activities with pagination and filtering.
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string
- eventType: string
- department: string
- status: "upcoming" | "ongoing" | "completed"
```

#### GET /api/activities/upcoming
Get upcoming activities.

#### GET /api/activities/ongoing
Get ongoing activities.

#### GET /api/activities/stats
Get activity statistics.

#### GET /api/activities/:id
Get activity by ID.

#### POST /api/activities
Create activity (Admin/SubAdmin only).
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

#### PUT /api/activities/:id
Update activity (Admin/SubAdmin only).

#### DELETE /api/activities/:id
Delete activity (Admin only).

### Placement Records

#### GET /api/placements
Get all placement records with pagination.

#### GET /api/placements/stats
Get placement statistics.

#### GET /api/placements/top-performing
Get top performing programs.

#### GET /api/placements/:id
Get placement record by ID.

#### POST /api/placements
Create placement record (Admin/SubAdmin only).
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

#### PUT /api/placements/:id
Update placement record (Admin/SubAdmin only).

#### DELETE /api/placements/:id
Delete placement record (Admin only).

### Collaborations

#### GET /api/collaborations
Get all collaborations with pagination.

#### GET /api/collaborations/stats
Get collaboration statistics.

#### GET /api/collaborations/search
Search collaborations.

#### GET /api/collaborations/program/:programId
Get collaborations for a specific program.

#### GET /api/collaborations/:id
Get collaboration by ID.

#### POST /api/collaborations
Create collaboration (Admin/SubAdmin only).
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

#### PUT /api/collaborations/:id
Update collaboration (Admin/SubAdmin only).

#### DELETE /api/collaborations/:id
Delete collaboration (Admin only).

### Sub-Admins

#### GET /api/subadmins
Get all sub-admins with pagination.

#### GET /api/subadmins/stats
Get sub-admin statistics.

#### GET /api/subadmins/search
Search sub-admins.

#### GET /api/subadmins/:id
Get sub-admin by ID.

#### POST /api/subadmins
Create sub-admin (Admin only).
```json
{
  "name": "Dr. Rajesh Kumar",
  "email": "rajesh.kumar@etr.com",
  "phone": "+919876543210",
  "department": "Computer Science",
  "password": "password123"
}
```

#### PUT /api/subadmins/:id
Update sub-admin (Admin only).

#### DELETE /api/subadmins/:id
Delete sub-admin (Admin only).

## Authentication

All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Role-Based Access Control

- **ADMIN**: Full access to all endpoints
- **SUBADMIN**: Can create, read, update (limited delete access)
- **STUDENT**: Read-only access to most endpoints

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "value": "invalid-email"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Pagination

Paginated responses include pagination metadata:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Indian Educational Institution Features

### Admission Process
- **Application Stage**: Student applies with documents
- **Verification Stage**: Documents verified by admin
- **Selection Stage**: Student selected based on criteria
- **Registration Stage**: Student completes registration
- **Rejection Stage**: Application rejected if criteria not met

### Fee Structure (Indian Context)
- **Total Fee**: Complete program fee in Indian Rupees (₹)
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

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all inputs
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security

## Sample Data (Indian Context)

After running `npm run seed`, you'll have:

### Users
- **Admin**: `admin@etr.com` / `admin123`
- **Sub-Admin**: `subadmin@etr.com` / `subadmin123`
- **Students**: 
  - `rahul.kumar@student.com` / `student123`
  - `priya.sharma@student.com` / `student123`
  - `amit.patel@student.com` / `student123`

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
- 3 Students with admission tracking
- 3 Campus activities (TechFest, Career Fair, Cultural Fest)
- 2 Placement records (TCS, MBA placements)
- 3 Collaborations (TCS, Infosys, HDFC Bank)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
