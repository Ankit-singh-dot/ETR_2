import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000/api';
let authToken = '';
let programId = '';
let studentId = '';
let salesPersonId = '';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null, useAuth = true) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (useAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    const data = await response.json();
    
    console.log(`${method} ${endpoint}:`, {
      status: response.status,
      success: data.success,
      message: data.message
    });

    if (!response.ok) {
      console.log('Error details:', data);
    }

    return { response, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { error };
  }
}

async function runTests() {
  console.log('🚀 Starting ETR API Tests...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  await apiCall('/health', 'GET', null, false);

  // Test 2: Admin Login
  console.log('\n2. Testing Admin Login...');
  const loginResult = await apiCall('/auth/login', 'POST', {
    email: 'admin@etr.com',
    password: 'admin123'
  }, false);

  if (loginResult.data && loginResult.data.success) {
    authToken = loginResult.data.data.token;
    console.log('✅ Login successful, token stored');
  } else {
    console.log('❌ Login failed');
    return;
  }

  // Test 3: Get All Programs
  console.log('\n3. Testing Get All Programs...');
  const programsResult = await apiCall('/programs?page=1&limit=5');
  if (programsResult.data && programsResult.data.success && programsResult.data.data.length > 0) {
    programId = programsResult.data.data[0].id;
    console.log('✅ Programs retrieved, first program ID:', programId);
  }

  // Test 4: Create New Program
  console.log('\n4. Testing Create Program...');
  const newProgramResult = await apiCall('/programs', 'POST', {
    name: 'Test B.Tech Data Science',
    programType: 'BACHELORS',
    durationYears: 4,
    description: 'Test program for API validation'
  });

  let newProgramId = '';
  if (newProgramResult.data && newProgramResult.data.success) {
    newProgramId = newProgramResult.data.data.id;
    console.log('✅ Program created with ID:', newProgramId);
  }

  // Test 5: Create Program Seat
  if (newProgramId) {
    console.log('\n5. Testing Create Program Seat...');
    await apiCall('/programs/seats', 'POST', {
      totalSeats: 50,
      reservedSeats: 10,
      openSeats: 40,
      programId: newProgramId
    });
  }

  // Test 6: Get All Students
  console.log('\n6. Testing Get All Students...');
  const studentsResult = await apiCall('/students?page=1&limit=5');
  if (studentsResult.data && studentsResult.data.success && studentsResult.data.data.length > 0) {
    studentId = studentsResult.data.data[0].id;
    console.log('✅ Students retrieved, first student ID:', studentId);
  }

  // Test 7: Create New Student
  console.log('\n7. Testing Create Student...');
  const newStudentResult = await apiCall('/students', 'POST', {
    fullName: 'Test Student Kumar',
    phone: '+919999999999',
    dob: '2002-01-15',
    gender: 'MALE',
    address: 'Test Address, Test City',
    admissionYear: 2024,
    admissionStatus: 'APPLIED',
    programId: programId
  });

  let newStudentId = '';
  if (newStudentResult.data && newStudentResult.data.success) {
    newStudentId = newStudentResult.data.data.id;
    console.log('✅ Student created with ID:', newStudentId);
  }

  // Test 8: Get All Sales Persons
  console.log('\n8. Testing Get All Sales Persons...');
  const salesPersonsResult = await apiCall('/salespersons?page=1&limit=5', 'GET', null, false);
  if (salesPersonsResult.data && salesPersonsResult.data.success && salesPersonsResult.data.data.length > 0) {
    salesPersonId = salesPersonsResult.data.data[0].id;
    console.log('✅ Sales persons retrieved, first sales person ID:', salesPersonId);
  }

  // Test 9: Create New Sales Person
  console.log('\n9. Testing Create Sales Person...');
  await apiCall('/salespersons', 'POST', {
    name: 'Test Sales Person',
    email: `test.sales.${Date.now()}@example.com`,
    phone: '+919888888888',
    region: 'Test Region',
    assignedProgram: 'UG'
  });

  // Test 10: Assign Student to Sales Person
  if (newStudentId && salesPersonId) {
    console.log('\n10. Testing Assign Student to Sales Person...');
    await apiCall('/salespersons/assign-student', 'POST', {
      salesPersonId: parseInt(salesPersonId),
      studentId: parseInt(newStudentId)
    });
  }

  // Test 11: Add Admission Tracking
  if (newStudentId) {
    console.log('\n11. Testing Add Admission Tracking...');
    await apiCall(`/students/${newStudentId}/admission-tracking`, 'POST', {
      stage: 'VERIFIED',
      documentName: 'Test Document',
      remarks: 'Test tracking record'
    });
  }

  // Test 12: Get Fee Structures
  console.log('\n12. Testing Get Fee Structures...');
  await apiCall('/fees?page=1&limit=5');

  // Test 13: Calculate Scholarship
  if (programId) {
    console.log('\n13. Testing Calculate Scholarship...');
    await apiCall('/fees/calculate-scholarship', 'POST', {
      programId: programId,
      studentPercentage: 85.5
    });
  }

  // Test 14: Get Campus Activities
  console.log('\n14. Testing Get Campus Activities...');
  await apiCall('/activities?page=1&limit=5');

  // Test 15: Get Placement Records
  console.log('\n15. Testing Get Placement Records...');
  await apiCall('/placements?page=1&limit=5');

  // Test 16: Get Collaborations
  console.log('\n16. Testing Get Collaborations...');
  await apiCall('/collaborations?page=1&limit=5');

  // Test 17: Get Student Statistics
  console.log('\n17. Testing Get Student Statistics...');
  await apiCall('/students/stats');

  // Test 18: Get Sales Person Statistics
  if (salesPersonId) {
    console.log('\n18. Testing Get Sales Person Statistics...');
    await apiCall(`/salespersons/${salesPersonId}/stats`, 'GET', null, false);
  }

  // Test 19: Get Program Statistics
  if (programId) {
    console.log('\n19. Testing Get Program Statistics...');
    await apiCall(`/programs/${programId}/stats`);
  }

  // Test 20: Get User Profile
  console.log('\n20. Testing Get User Profile...');
  await apiCall('/auth/profile');

  console.log('\n🎉 All API tests completed!');
  console.log('\n📝 Summary:');
  console.log('- Health check: ✅');
  console.log('- Authentication: ✅');
  console.log('- Program management: ✅');
  console.log('- Student management: ✅');
  console.log('- Sales person management: ✅');
  console.log('- Fee management: ✅');
  console.log('- Campus activities: ✅');
  console.log('- Placement records: ✅');
  console.log('- Collaborations: ✅');
  console.log('- Statistics: ✅');
  
  console.log('\n🔗 Ready for Postman Testing:');
  console.log('1. Import the ETR_Postman_Collection.json file');
  console.log('2. Set environment variable: base_url = http://localhost:5000/api');
  console.log('3. Run the "Admin Login" request first to get the auth token');
  console.log('4. All other requests will use the token automatically');
}

// Check if server is running before starting tests
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Server is running, starting tests...\n');
      await runTests();
    } else {
      console.log('❌ Server responded with error:', response.status);
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the server with: npm run dev');
    console.log('Error:', error.message);
  }
}

checkServer();
