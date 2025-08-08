import prisma from '../config/db.js';
import { hashPassword } from './auth.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding with Indian educational context...');

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.userLogin.upsert({
      where: { email: 'admin@etr.com' },
      update: {},
      create: {
        email: 'admin@etr.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    });

    // Create sample programs (Indian Educational Context)
    const programs = await Promise.all([
      prisma.program.upsert({
        where: { id: 'btech-cs-2024' },
        update: {},
        create: {
          id: 'btech-cs-2024',
          name: 'B.Tech Computer Science',
          programType: 'BACHELORS',
          durationYears: 4,
          description: 'Bachelor of Technology in Computer Science and Engineering with focus on software development, algorithms, and system design.'
        }
      }),
      prisma.program.upsert({
        where: { id: 'mtech-it-2024' },
        update: {},
        create: {
          id: 'mtech-it-2024',
          name: 'M.Tech Information Technology',
          programType: 'MASTERS',
          durationYears: 2,
          description: 'Master of Technology in Information Technology with specialization in emerging technologies and management.'
        }
      }),
      prisma.program.upsert({
        where: { id: 'mba-2024' },
        update: {},
        create: {
          id: 'mba-2024',
          name: 'MBA (Master of Business Administration)',
          programType: 'MASTERS',
          durationYears: 2,
          description: 'Master of Business Administration with specializations in Finance, Marketing, and Human Resources.'
        }
      })
    ]);

    // Create program seats
    await Promise.all([
      prisma.programSeat.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          totalSeats: 120,
          reservedSeats: 20,
          openSeats: 100,
          programId: 'btech-cs-2024'
        }
      }),
      prisma.programSeat.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          totalSeats: 60,
          reservedSeats: 10,
          openSeats: 50,
          programId: 'mtech-it-2024'
        }
      }),
      prisma.programSeat.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          totalSeats: 80,
          reservedSeats: 15,
          openSeats: 65,
          programId: 'mba-2024'
        }
      })
    ]);

    // Create fee structures (Indian Rupees)
    await Promise.all([
      prisma.feeStructure.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          totalFee: 800000,
          optionalScholarshipFee: 100000,
          scholarshipAmount: 150000,
          netFee: 650000,
          programId: 'btech-cs-2024'
        }
      }),
      prisma.feeStructure.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          totalFee: 1200000,
          optionalScholarshipFee: 150000,
          scholarshipAmount: 200000,
          netFee: 1000000,
          programId: 'mtech-it-2024'
        }
      }),
      prisma.feeStructure.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          totalFee: 1500000,
          optionalScholarshipFee: 200000,
          scholarshipAmount: 250000,
          netFee: 1250000,
          programId: 'mba-2024'
        }
      })
    ]);

    // Create eligibility criteria (Indian Standards)
    await Promise.all([
      prisma.eligibilityCriteria.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          minQualification: '12th Standard',
          minPercentage: 75.000,
          entranceExamName: 'JEE Main',
          programId: 'btech-cs-2024'
        }
      }),
      prisma.eligibilityCriteria.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          minQualification: 'Bachelor Degree',
          minPercentage: 70.000,
          entranceExamName: 'GATE',
          programId: 'mtech-it-2024'
        }
      }),
      prisma.eligibilityCriteria.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          minQualification: 'Bachelor Degree',
          minPercentage: 65.000,
          entranceExamName: 'CAT',
          programId: 'mba-2024'
        }
      })
    ]);

    // Create sample students (Indian names and context)
    const studentPassword = await hashPassword('student123');
    await Promise.all([
      prisma.userLogin.upsert({
        where: { email: 'rahul.kumar@student.com' },
        update: {},
        create: {
          email: 'rahul.kumar@student.com',
          password: studentPassword,
          role: 'STUDENT'
        }
      }),
      prisma.userLogin.upsert({
        where: { email: 'priya.sharma@student.com' },
        update: {},
        create: {
          email: 'priya.sharma@student.com',
          password: studentPassword,
          role: 'STUDENT'
        }
      }),
      prisma.userLogin.upsert({
        where: { email: 'amit.patel@student.com' },
        update: {},
        create: {
          email: 'amit.patel@student.com',
          password: studentPassword,
          role: 'STUDENT'
        }
      })
    ]);

    await Promise.all([
      prisma.student.upsert({
        where: { email: 'rahul.kumar@student.com' },
        update: {},
        create: {
          fullName: 'Rahul Kumar',
          email: 'rahul.kumar@student.com',
          phone: '+919876543210',
          dob: new Date('2000-05-15'),
          gender: 'MALE',
          address: '123, MG Road, Bangalore, Karnataka - 560001',
          admissionYear: 2024,
          admissionStatus: 'REGISTERED',
          admissionNumber: 'ADM20240001',
          programId: 'btech-cs-2024',
          seatId: 1
        }
      }),
      prisma.student.upsert({
        where: { email: 'priya.sharma@student.com' },
        update: {},
        create: {
          fullName: 'Priya Sharma',
          email: 'priya.sharma@student.com',
          phone: '+919876543211',
          dob: new Date('1999-08-22'),
          gender: 'FEMALE',
          address: '456, Koramangala, Bangalore, Karnataka - 560034',
          admissionYear: 2024,
          admissionStatus: 'APPLIED',
          admissionNumber: 'ADM20240002',
          programId: 'mtech-it-2024',
          seatId: 2
        }
      }),
      prisma.student.upsert({
        where: { email: 'amit.patel@student.com' },
        update: {},
        create: {
          fullName: 'Amit Patel',
          email: 'amit.patel@student.com',
          phone: '+919876543212',
          dob: new Date('2001-03-10'),
          gender: 'MALE',
          address: '789, Indiranagar, Bangalore, Karnataka - 560038',
          admissionYear: 2024,
          admissionStatus: 'SELECTED',
          admissionNumber: 'ADM20240003',
          programId: 'mba-2024',
          seatId: 3
        }
      })
    ]);

    // Create sample campus activities (Indian context)
    await Promise.all([
      prisma.campusActivity.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          eventName: 'Annual TechFest 2024',
          eventType: 'FESTIVAL',
          startDate: new Date('2024-03-15T09:00:00Z'),
          endDate: new Date('2024-03-17T17:00:00Z'),
          organizedBy: 'Computer Science Department',
          department: 'Computer Science'
        }
      }),
      prisma.campusActivity.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          eventName: 'Career Fair 2024',
          eventType: 'CAREER_FAIR',
          startDate: new Date('2024-04-20T10:00:00Z'),
          endDate: new Date('2024-04-20T16:00:00Z'),
          organizedBy: 'Placement Cell',
          department: 'Placement'
        }
      }),
      prisma.campusActivity.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          eventName: 'Cultural Fest 2024',
          eventType: 'CULTURAL',
          startDate: new Date('2024-05-10T09:00:00Z'),
          endDate: new Date('2024-05-12T18:00:00Z'),
          organizedBy: 'Cultural Committee',
          department: 'Cultural'
        }
      })
    ]);

    // Create sample placement records (Indian context - LPA)
    await Promise.all([
      prisma.placementRecord.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          programId: 'btech-cs-2024',
          placementYear: 2023,
          totalStudents: 120,
          eligibleStudents: 100,
          studentsPlaced: 85,
          highestPackage: 4500000,
          averagePackage: 850000
        }
      }),
      prisma.placementRecord.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          programId: 'mba-2024',
          placementYear: 2023,
          totalStudents: 80,
          eligibleStudents: 70,
          studentsPlaced: 65,
          highestPackage: 1800000,
          averagePackage: 1200000
        }
      })
    ]);

    // Create sample collaborations (Indian companies)
    await Promise.all([
      prisma.collaboration.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          industryName: 'Information Technology',
          programId: 'btech-cs-2024',
          companyName: 'TCS (Tata Consultancy Services)',
          internshipMOU: 'MOU-2024-001',
          type: 'PLACEMENT',
          yearOfSetup: 2024
        }
      }),
      prisma.collaboration.upsert({
        where: { id: 2 },
        update: {},
        create: {
          id: 2,
          industryName: 'Information Technology',
          programId: 'btech-cs-2024',
          companyName: 'Infosys Limited',
          internshipMOU: 'MOU-2024-002',
          type: 'INTERNSHIP',
          yearOfSetup: 2024
        }
      }),
      prisma.collaboration.upsert({
        where: { id: 3 },
        update: {},
        create: {
          id: 3,
          industryName: 'Finance',
          programId: 'mba-2024',
          companyName: 'HDFC Bank',
          internshipMOU: 'MOU-2024-003',
          type: 'PLACEMENT',
          yearOfSetup: 2024
        }
      })
    ]);

    // Create sub-admin (Indian context)
    const subAdminPassword = await hashPassword('subadmin123');
    await prisma.userLogin.upsert({
      where: { email: 'subadmin@etr.com' },
      update: {},
      create: {
        email: 'subadmin@etr.com',
        password: subAdminPassword,
        role: 'SUBADMIN'
      }
    });

    await prisma.subAdmin.upsert({
      where: { email: 'subadmin@etr.com' },
      update: {},
      create: {
        name: 'Dr. Rajesh Kumar',
        email: 'subadmin@etr.com',
        phone: '+919876543213',
        department: 'Computer Science',
        password: subAdminPassword
      }
    });

    // Create sample sales persons (Indian context)
    const salesPersons = await Promise.all([
      prisma.salesPerson.upsert({
        where: { email: 'sales.north@etr.com' },
        update: {},
        create: {
          name: 'Vikram Singh',
          email: 'sales.north@etr.com',
          phone: '+919876543214',
          region: 'North India',
          assignedProgram: 'UG'
        }
      }),
      prisma.salesPerson.upsert({
        where: { email: 'sales.south@etr.com' },
        update: {},
        create: {
          name: 'Lakshmi Menon',
          email: 'sales.south@etr.com',
          phone: '+919876543215',
          region: 'South India',
          assignedProgram: 'PG'
        }
      }),
      prisma.salesPerson.upsert({
        where: { email: 'sales.west@etr.com' },
        update: {},
        create: {
          name: 'Arjun Patil',
          email: 'sales.west@etr.com',
          phone: '+919876543216',
          region: 'West India',
          assignedProgram: 'MBA'
        }
      })
    ]);

    // Update students to assign them to sales persons
    await prisma.student.update({
      where: { email: 'rahul.kumar@student.com' },
      data: { salesId: salesPersons[0].id }
    });

    await prisma.student.update({
      where: { email: 'priya.sharma@student.com' },
      data: { salesId: salesPersons[1].id }
    });

    await prisma.student.update({
      where: { email: 'amit.patel@student.com' },
      data: { salesId: salesPersons[2].id }
    });

    console.log('✅ Database seeding completed successfully with Indian educational context!');
    console.log('\n📋 Sample Data Created:');
    console.log('- Admin user: admin@etr.com / admin123');
    console.log('- Sub-admin: subadmin@etr.com / subadmin123');
    console.log('- Students: rahul.kumar@student.com, priya.sharma@student.com, amit.patel@student.com / student123');
    console.log('- 3 Sales persons (North, South, West regions)');
    console.log('- 3 Programs with Indian educational context:');
    console.log('  * B.Tech Computer Science (₹8,00,000)');
    console.log('  * M.Tech Information Technology (₹12,00,000)');
    console.log('  * MBA (₹15,00,000)');
    console.log('- 3 Campus activities (TechFest, Career Fair, Cultural Fest)');
    console.log('- 2 Placement records (TCS, MBA placements)');
    console.log('- 3 Collaborations (TCS, Infosys, HDFC Bank)');
    console.log('- Eligibility criteria with Indian entrance exams (JEE Main, GATE, CAT)');
    console.log('- Students assigned to respective sales persons');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
} 