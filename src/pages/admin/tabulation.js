'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { pdf } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import BASE_URL from '@/components/config/apiConfig';
// Ensure these paths are correct relative to where this component is saved
import { TabulationSheetPDF, MeritListPDF, FailListPDF } from '/utility/reportgenerato.js'; // Adjust path if needed

// --- Helper Functions and Constants (as before, with minor refinements) ---

const SUBJECT_STRUCTURE = {
  'common_6_8': [
    { key: 'Bangla_1st', name: 'Bangla 1st Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Bangla_2nd', name: 'Bangla 2nd Paper', compulsory: true, totalPossible: 50, passMark: 17, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'English_1st', name: 'English 1st Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: false, hasPractical: false }, // English 1st usually no MCQ
    { key: 'English_2nd', name: 'English 2nd Paper', compulsory: true, totalPossible: 50, passMark: 17, hasCQ: true, hasMCQ: false, hasPractical: false }, // English 2nd usually no MCQ
    { key: 'Mathematics', name: 'Mathematics', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Science', name: 'Science', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false }, // Science may have practical in some curricula
    { key: 'BGS', name: 'Bangladesh & Global Studies', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'ICT', name: 'Information & Communication Technology', compulsory: true, totalPossible: 50, passMark: 17, hasCQ: true, hasMCQ: true, hasPractical: false } // ICT might have practical depending on setup
  ],
  'science_9_10': [
    { key: 'Bangla_1st', name: 'Bangla 1st Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Bangla_2nd', name: 'Bangla 2nd Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'English_1st', name: 'English 1st Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: false, hasPractical: false },
    { key: 'English_2nd', name: 'English 2nd Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: false, hasPractical: false },
    { key: 'Mathematics', name: 'Mathematics', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Physics', name: 'Physics', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: true },
    { key: 'Chemistry', name: 'Chemistry', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: true },
    { key: 'Biology', name: 'Biology', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: true },
    { key: 'HigherMath', name: 'Higher Mathematics', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'ICT', name: 'Information & Communication Technology', compulsory: true, totalPossible: 50, passMark: 17, hasCQ: true, hasMCQ: true, hasPractical: false }
  ],
  'business_9_10': [
    { key: 'Bangla_1st', name: 'Bangla 1st Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Bangla_2nd', name: 'Bangla 2nd Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'English_1st', name: 'English 1st Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: false, hasPractical: false },
    { key: 'English_2nd', name: 'English 2nd Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: false, hasPractical: false },
    { key: 'Mathematics', name: 'Mathematics', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Accounting', name: 'Accounting', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'BusinessEnt', name: 'Business Entrepreneurship', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Finance', name: 'Finance & Banking', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'ICT', name: 'Information & Communication Technology', compulsory: true, totalPossible: 50, passMark: 17, hasCQ: true, hasMCQ: true, hasPractical: false }
  ],
  'humanities_9_10': [
    { key: 'Bangla_1st', name: 'Bangla 1st Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Bangla_2nd', name: 'Bangla 2nd Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'English_1st', name: 'English 1st Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: false, hasPractical: false },
    { key: 'English_2nd', name: 'English 2nd Paper', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: false, hasPractical: false },
    { key: 'Mathematics', name: 'Mathematics', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'History', name: 'History', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Civics', name: 'Civics & Citizenship', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Geography', name: 'Geography', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'Economics', name: 'Economics', compulsory: true, totalPossible: 100, passMark: 33, hasCQ: true, hasMCQ: true, hasPractical: false },
    { key: 'ICT', name: 'Information & Communication Technology', compulsory: true, totalPossible: 50, passMark: 17, hasCQ: true, hasMCQ: true, hasPractical: false }
  ]
};

// Helper function to calculate grade and GPA for a single subject
const calculateGrade = (marks) => {
  if (marks >= 80) return { grade: 'A+', gpa: 5.0 };
  if (marks >= 70) return { grade: 'A', gpa: 4.0 };
  if (marks >= 60) return { grade: 'A-', gpa: 3.5 };
  if (marks >= 50) return { grade: 'B', gpa: 3.0 };
  if (marks >= 40) return { grade: 'C', gpa: 2.0 };
  if (marks >= 33) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
};

const getClassText = (classNum) => {
  const classMap = {
    6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten'
  };
  const parsedClass = parseInt(classNum);
  return classMap[parsedClass] || classNum;
};

const getNumericClass = (classValue) => {
  const classTextToNumberMap = {
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };
  if (typeof classValue === 'string') {
    const lowerCaseClass = classValue.toLowerCase();
    if (classTextToNumberMap[lowerCaseClass]) {
      return classTextToNumberMap[lowerCaseClass];
    }
    const parsed = parseInt(classValue);
    if (!isNaN(parsed)) {
      return parsed;
    }
  } else if (typeof classValue === 'number') {
    return classValue;
  }
  return NaN;
};

const getSubjectStructure = (student) => {
  const classNum = getNumericClass(student.class);
  const group = student.group_name?.toLowerCase();

  if (classNum >= 6 && classNum <= 8) {
    return SUBJECT_STRUCTURE.common_6_8;
  } else if (classNum >= 9 && classNum <= 10) {
    if (group?.includes('science')) {
      return SUBJECT_STRUCTURE.science_9_10;
    } else if (group?.includes('business') || group?.includes('commerce')) {
      return SUBJECT_STRUCTURE.business_9_10;
    } else if (group?.includes('humanities') || group?.includes('arts')) {
      return SUBJECT_STRUCTURE.humanities_9_10;
    }
  }
  return [];
};

// Helper to safely get mark and determine if it was present/recorded
const getSafeMarkAndPresence = (mark) => {
  const isPresent = (mark !== undefined && mark !== null && mark !== '');
  return { value: isPresent ? Number(mark) : 0, isPresent: isPresent };
};

// Function to get a comprehensive list of all subjects expected for a given class/group
const getAllExpectedSubjects = (student) => {
    const classNum = getNumericClass(student.class);
    const compulsorySubjects = getSubjectStructure(student);
    const expectedSubjects = [...compulsorySubjects];

    if (student.Religion_Name || (classNum >= 6 && classNum <= 10)) {
        if (!expectedSubjects.some(sub => sub.key === 'Religion')) {
            expectedSubjects.push({
                key: 'Religion',
                name: student.Religion_Name || 'Religion',
                compulsory: true, // Religion is now compulsory
                totalPossible: 100,
                passMark: 33,
                isOptional: false, // Explicitly not optional
                hasCQ: true, hasMCQ: true, hasPractical: false
            });
        }
    }

    if (student.Optional_Subject_Name) {
      if (!expectedSubjects.some(sub => sub.key === 'Optional')) {
          let optionalPassMark;
          let totalPossible;
          if (classNum >= 6 && classNum <= 8) {
              totalPossible = 50;  // Total marks 50 for classes 6-8
              optionalPassMark = 17; // Pass mark 17 from 50
          } else if (classNum >= 9 && classNum <= 10) {
              totalPossible = 100; // Total marks 100 for classes 9-10
              optionalPassMark = 33; // Pass mark 33 from 100
          } else {
              totalPossible = 100;
              optionalPassMark = 33;
          }
    
          expectedSubjects.push({
              key: 'Optional',
              name: student.Optional_Subject_Name,
              compulsory: false,
              totalPossible: totalPossible,
              passMark: optionalPassMark,
              isOptional: true,
              hasCQ: true, hasMCQ: true, hasPractical: true
          });
      }
    }

    if (student.ArtsCrafts_Assessment !== undefined) {
        if (!expectedSubjects.some(sub => sub.key === 'ArtsCrafts')) {
            expectedSubjects.push({ key: 'ArtsCrafts', name: 'Arts & Crafts', totalPossible: 100, passMark: 0, isAssessment: true, hasPractical: true });
        }
    }
    if (student.PhysicalEd_Practical !== undefined || student.PhysicalEd_Assessment !== undefined) {
        if (!expectedSubjects.some(sub => sub.key === 'PhysicalEd')) {
            expectedSubjects.push({ key: 'PhysicalEd', name: 'Physical Education', totalPossible: 100, passMark: 0, isAssessment: true, hasPractical: true });
        }
    }

    // Ensure uniqueness based on key to prevent duplicates
    const uniqueExpectedSubjects = [];
    const seenKeys = new Set();
    for (const sub of expectedSubjects) {
        if (!seenKeys.has(sub.key)) {
            uniqueExpectedSubjects.push(sub);
            seenKeys.add(sub.key);
        }
    }

    return uniqueExpectedSubjects;
};


// Main GPA calculation function
const calculateGPA = (student) => {
  const allExpectedSubjects = getAllExpectedSubjects(student);
  const allProcessedSubjects = [];
  const classNum = getNumericClass(student.class);

  allExpectedSubjects.forEach(subjectDef => {
    const key = subjectDef.key;
    let cqInfo = { value: 0, isPresent: false };
    let mcqInfo = { value: 0, isPresent: false };
    let practicalInfo = { value: 0, isPresent: false };

    // Dynamically get marks based on subject key and available components
    const getMarksForKey = (prefix) => ({
      cq: getSafeMarkAndPresence(student[`${prefix}_CQ`]),
      mcq: getSafeMarkAndPresence(student[`${prefix}_MCQ`]),
      practical: getSafeMarkAndPresence(student[`${prefix}_Practical`])
    });

    // Check for specific keys first for precise mapping
    if (key === 'Religion') {
        const marks = getMarksForKey('Religion');
        cqInfo = marks.cq;
        mcqInfo = marks.mcq;
        practicalInfo = marks.practical;
    } else if (key === 'Optional') {
        const marks = getMarksForKey('Optional');
        cqInfo = marks.cq;
        mcqInfo = marks.mcq;
        practicalInfo = marks.practical;
    } else if (key === 'ArtsCrafts') {
        practicalInfo = getSafeMarkAndPresence(student.ArtsCrafts_Assessment); // ArtsCrafts only has an assessment mark
    } else if (key === 'PhysicalEd') {
        practicalInfo = getSafeMarkAndPresence(student.PhysicalEd_Practical || student.PhysicalEd_Assessment); // PhysicalEd might have practical or assessment
    } else {
        // Fallback for subjects defined directly in SUBJECT_STRUCTURE
        const marks = getMarksForKey(key);
        cqInfo = marks.cq;
        mcqInfo = marks.mcq;
        practicalInfo = marks.practical;
    }

    const cqMarks = cqInfo.value;
    const mcqMarks = mcqInfo.value;
    const practicalMarks = practicalInfo.value;

    let totalMarks = cqMarks + mcqMarks + practicalMarks;
    let isPassed = true;
    let gpa = 0.0;
    let grade = 'F';

    // Handle assessment-based subjects first
    if (subjectDef.isAssessment) {
        isPassed = practicalInfo.isPresent; // Considered passed if assessment data is recorded
        grade = isPassed ? 'Satisfactory' : 'N/A';
        gpa = 0; // Assessment subjects do not contribute to numerical GPA
    } else {
        // Apply pass mark rules for regular subjects
        isPassed = totalMarks >= subjectDef.passMark;

        let marksForGradeCalculation = totalMarks;
        if (subjectDef.totalPossible === 50 && totalMarks > 0) { // Only scale if marks are positive
            marksForGradeCalculation = totalMarks * 2; // Normalize to 100 for grading
        }

        const calculatedGradeInfo = calculateGrade(marksForGradeCalculation);
        grade = calculatedGradeInfo.grade;
        gpa = calculatedGradeInfo.gpa;

        // Adjust GPA to 0 if failed
        if (!isPassed) {
            gpa = 0.0;
            grade = 'F'; // Ensure grade is F if failed
        }
    }

    allProcessedSubjects.push({
      key: key,
      subject: subjectDef.name,
      cq: cqInfo.isPresent ? cqMarks : 'NA',
      mcq: mcqInfo.isPresent ? mcqMarks : 'NA',
      practical: practicalInfo.isPresent ? practicalMarks : 'NA',
      total: totalMarks,
      grade: grade,
      gpa: gpa,
      passed: isPassed,
      isOptional: subjectDef.isOptional || false,
      isAssessment: subjectDef.isAssessment || false,
      compulsory: subjectDef.compulsory
    });
  });


  // Filter subjects for GPA calculation (exclude assessment-based subjects and optional from initial sum)
  // Now, only `isOptional: true` subjects are handled differently. Compulsory subjects (including Religion)
  // are included in `gpaEligibleSubjects`.
  const gpaEligibleSubjects = allProcessedSubjects.filter(sub =>
    !sub.isAssessment &&
    sub.compulsory === true // Only compulsory subjects contribute to main GPA
  );

  const totalMarksSum = allProcessedSubjects.reduce((sum, sub) => sum + (typeof sub.total === 'number' ? sub.total : 0), 0);

  // Calculate sum of GPAs and count of subjects for average
  let sumOfGPAs = 0;
  let countForGPA = 0;

  gpaEligibleSubjects.forEach(sub => {
    if (sub.passed) { // Only passed compulsory subjects contribute their GPA
      sumOfGPAs += sub.gpa;
      countForGPA++;
    }
  });


  let finalGPA = 0.0;
  // If any compulsory subject failed, overall GPA is 0.0. Otherwise, calculate average of passed compulsory subjects.
  if (gpaEligibleSubjects.some(sub => !sub.passed)) {
      finalGPA = 0.0;
  } else if (countForGPA > 0) { // All compulsory subjects passed
    finalGPA = sumOfGPAs / countForGPA;
  }


  // Adjust GPA for optional subject if applicable (e.g., GPA-2 rule for SSC in 9-10)
  // This now *only* applies to subjects explicitly marked `isOptional: true` (e.g., Optional subject).
  const optionalSubjectsForGpaAdjustment = allProcessedSubjects.filter(sub => sub.isOptional && sub.passed);
  if (classNum >= 9 && classNum <= 10) {
      optionalSubjectsForGpaAdjustment.forEach(optionalSub => {
          const optionalGpaIncrement = Math.max(0, optionalSub.gpa - 2);
          finalGPA = finalGPA + optionalGpaIncrement;
      });
  }


  // Cap GPA at 5.0
  finalGPA = Math.min(5.0, finalGPA);

  return {
    allSubjects: allProcessedSubjects,
    totalMarks: totalMarksSum,
    totalGPA: parseFloat(finalGPA.toFixed(2)),
  };
};

const determinePassFail = (student, calculatedGPA) => {
  const { allSubjects } = calculateGPA(student);
  const classNum = getNumericClass(student.class);

  // Filter subjects that explicitly contribute to pass/fail criteria (compulsory, non-assessment)
  // This now includes 'Religion' again because it's marked `compulsory: true`.
  const checkableSubjects = allSubjects.filter(sub =>
    !sub.isAssessment && sub.compulsory === true
  );

  const failedSubjectsDetails = checkableSubjects.filter(sub => !sub.passed);
  const failedSubjectsNames = failedSubjectsDetails.map(sub => sub.subject);

  let isPassed = true;
  if (failedSubjectsNames.length > 0) {
    isPassed = false; // Failed if any *compulsory* subject is individually failed
  }

  // Special conditions for overall pass/fail in 6-8: Bangla and English combined pass
  if (classNum >= 6 && classNum <= 8) {
    const bangla1st = allSubjects.find(s => s.key === 'Bangla_1st');
    const bangla2nd = allSubjects.find(s => s.key === 'Bangla_2nd');
    const english1st = allSubjects.find(s => s.key === 'English_1st');
    const english2nd = allSubjects.find(s => s.key === 'English_2nd');

    // Check Bangla Combined Pass (1st + 2nd total should be >= 50)
    if (bangla1st && bangla2nd && typeof bangla1st.total === 'number' && typeof bangla2nd.total === 'number') {
      // Pass mark for combined Bangla: (100 * 0.33) + (50 * 0.33) is not strictly correct.
      // Usually, it's 33% of the combined total, which is 150*0.33 = 49.5, or a flat 50.
      // Let's use 50 as a common combined pass mark for 6-8.
      const combinedBanglaTotal = bangla1st.total + bangla2nd.total;
      if (combinedBanglaTotal < 50) { // Assuming 50 is combined pass mark
        if (!failedSubjectsNames.includes('Bangla Combined')) {
          failedSubjectsNames.push('Bangla Combined');
          isPassed = false;
        }
      }
    }

    // Check English Combined Pass (1st + 2nd total should be >= 50)
    if (english1st && english2nd && typeof english1st.total === 'number' && typeof english2nd.total === 'number') {
      const combinedEnglishTotal = english1st.total + english2nd.total;
      if (combinedEnglishTotal < 50) { // Assuming 50 is combined pass mark
        if (!failedSubjectsNames.includes('English Combined')) {
          failedSubjectsNames.push('English Combined');
          isPassed = false;
        }
      }
    }
  }

  // If after all checks, the student has a calculated GPA of 0 (and there are compulsory subjects)
  // This typically means an overall 'Fail' (e.g., failed too many subjects, or critical subject failure).
  // This check is important as it covers cases where individual subject failures might have been overlooked
  // but the GPA still reflects a fail.
  if (isPassed && calculatedGPA === 0 && checkableSubjects.length > 0) {
      isPassed = false;
      if (failedSubjectsNames.length === 0) { // Add a generic fail reason if no specific subject failures listed
          failedSubjectsNames.push('Overall GPA 0.0');
      }
  }


  return {
    isPassed: isPassed,
    failedSubjects: failedSubjectsNames, // List of subjects failed
    overallGrade: isPassed ? calculateGrade(calculatedGPA * 20).grade : 'F' // Scale back GPA to 100 for overall grade
  };
};

export const StudentMarksheet = ({ studentData }) => {
  const student = studentData;
  const { allSubjects, totalMarks, totalGPA } = calculateGPA(student);
  const { isPassed, failedSubjects, overallGrade } = determinePassFail(student, totalGPA);

  const gradingData = [
    { grade: 'A+ (80-100)', gpa: '5.0' },
    { grade: 'A (70-79)', gpa: '4.0' },
    { grade: 'A- (60-69)', gpa: '3.5' },
    { grade: 'B (50-59)', gpa: '3.0' },
    { grade: 'C (40-49)', gpa: '2.0' },
    { grade: 'D (33-39)', gpa: '1.0' },
    { grade: 'F (0-32)', gpa: '0.0' }
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto my-8 font-sans">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 pb-2">Student Marksheet</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
        <div><strong>Student Name:</strong> {student.student_name}</div>
        <div><strong>Roll:</strong> {student.roll}</div>
        <div><strong>Class:</strong> {getClassText(student.class)}</div>
        <div><strong>Section:</strong> {student.section}</div>
        {student.group_name && <div><strong>Group:</strong> {student.group_name}</div>}
        <div><strong>Exam Type:</strong> {student.exam_name || 'Annual Exam'}</div>
        <div><strong>Year:</strong> {student.year}</div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Subject-wise Marks</h3>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SL</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">CQ</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">MCQ</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Practical</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Grade</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">GPA</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allSubjects.map((subject, index) => (
              <tr key={subject.key || index}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{subject.subject}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{subject.cq}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{subject.mcq}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{subject.practical}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{subject.total}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{subject.grade}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                    {/* Display N/A for individual subject GPA if failed AND not an assessment subject */}
                    {!subject.passed && !subject.isAssessment ? 'N/A' : (typeof subject.gpa === 'number' ? subject.gpa.toFixed(2) : subject.gpa)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subject.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {subject.passed ? 'Passed' : 'Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Summary</h3>
          <p className="text-gray-700"><strong>Total Marks:</strong> {totalMarks}</p>
          <p className="text-gray-700">
            <strong>GPA:</strong> {' '}
            {/* Display N/A if overall failed, otherwise the calculated GPA */}
            {!isPassed ? 'N/A' : totalGPA.toFixed(2)}
          </p>
          <p className="text-gray-700"><strong>Overall Grade:</strong> {overallGrade}</p>
          <p className="text-gray-700">
            <strong>Result Status:</strong> {' '}
            <span className={`font-bold ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
              {isPassed ? 'Passed' : 'Failed'}
            </span>
          </p>
          {!isPassed && failedSubjects.length > 0 && (
            <p className="text-red-700 text-sm mt-2">
              <strong>Failed Subjects:</strong> {failedSubjects.join(', ')}
            </p>
          )}
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Grading System</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">Grade</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">GPA</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-200">
                {gradingData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{item.grade}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{item.gpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main ReportGenerator Component ---

const ReportGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [activeReportView, setActiveReportView] = useState('tabulation');
  const [showFullTable, setShowFullTable] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [reportFilters, setReportFilters] = useState({
    class: '',
    section: '',
    year: '',
    examType: 'Annual Exam'
  });

  const fetchAllResults = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/student-results`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const processedData = data.map(student => {
        const gpaInfo = calculateGPA(student);
        const passFailInfo = determinePassFail(student, gpaInfo.totalGPA);
        return {
          ...student,
          calculated_gpa: gpaInfo.totalGPA,
          calculated_total_marks: gpaInfo.totalMarks,
          calculated_failed_subjects: passFailInfo.failedSubjects.join(', '),
          calculated_is_passed: passFailInfo.isPassed,
          calculated_overall_grade: passFailInfo.overallGrade,
          // Store all calculated subjects for detailed display/export
          calculated_all_subjects_details: gpaInfo.allSubjects,
        };
      });
      setAllResults(processedData);
    } catch (error) {
      console.error('Error fetching results:', error);
      Swal.fire('Error', 'Failed to fetch student results', 'error');
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllResults();
  }, [fetchAllResults]);

  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(allResults.map(r => r.class))].filter(Boolean);
    return classes.map(c => getNumericClass(c)).filter(n => !isNaN(n)).sort((a,b) => a-b).map(c => getClassText(c));
  }, [allResults]);

  const uniqueSections = useMemo(() => [...new Set(allResults.map(r => r.section))].filter(Boolean).sort(), [allResults]);
  const uniqueYears = useMemo(() => [...new Set(allResults.map(r => r.year))].filter(Boolean).sort((a, b) => b - a), [allResults]);

  const generateTabulationSheetData = useCallback(() => {
    if (!reportFilters.class || !reportFilters.section || !reportFilters.year) return [];
    const filtered = allResults.filter(student =>
      String(getNumericClass(student.class)) === String(getNumericClass(reportFilters.class)) &&
      String(student.section)?.toLowerCase() === reportFilters.section.toLowerCase() &&
      String(student.year) === reportFilters.year
    );

    const passedStudents = [];
    const failedStudents = [];

    filtered.forEach(student => {
        if (student.calculated_is_passed) {
            passedStudents.push(student);
        } else {
            failedStudents.push(student);
        }
    });

    // Sort passed students by merit: higher GPA first, then higher total marks, then lower roll number
    passedStudents.sort((a, b) => {
        if (b.calculated_gpa !== a.calculated_gpa) return b.calculated_gpa - a.calculated_gpa;
        if (b.calculated_total_marks !== a.calculated_total_marks) return b.calculated_total_marks - a.calculated_total_marks;
        return (a.roll || 0) - (b.roll || 0); // Sort by roll for ties
    });

    // Assign merit positions to passed students
    let meritPosition = 1;
    if (passedStudents.length > 0) {
        passedStudents[0].merit_position_tabulation = meritPosition++;
        for (let i = 1; i < passedStudents.length; i++) {
            // If same GPA and same total marks, assign same rank
            if (passedStudents[i].calculated_gpa === passedStudents[i-1].calculated_gpa &&
                passedStudents[i].calculated_total_marks === passedStudents[i-1].calculated_total_marks) {
                passedStudents[i].merit_position_tabulation = passedStudents[i-1].merit_position_tabulation;
            } else {
                passedStudents[i].merit_position_tabulation = meritPosition;
            }
            meritPosition++;
        }
    }


    // Sort failed students by roll number (or alphabetically by name if roll isn't reliable)
    failedStudents.sort((a, b) => (a.roll || 0) - (b.roll || 0));

    // Concatenate passed students then failed students
    return [...passedStudents, ...failedStudents];

  }, [allResults, reportFilters]);

  const generateMeritListData = useCallback(() => {
    if (!reportFilters.class || !reportFilters.section || !reportFilters.year) return [];
    const filtered = allResults.filter(student =>
      String(getNumericClass(student.class)) === String(getNumericClass(reportFilters.class)) &&
      String(student.section)?.toLowerCase() === reportFilters.section.toLowerCase() &&
      String(student.year) === reportFilters.year &&
      student.calculated_is_passed
    );
    // Sort logic identical to tabulation for passed students
    const sortedPassed = filtered.sort((a, b) => {
      if (b.calculated_gpa !== a.calculated_gpa) return b.calculated_gpa - a.calculated_gpa;
      if (b.calculated_total_marks !== a.calculated_total_marks) return b.calculated_total_marks - a.calculated_total_marks;
      return (a.roll || 0) - (b.roll || 0);
    });

    // Assign merit positions
    let meritPosition = 1;
    if (sortedPassed.length > 0) {
        sortedPassed[0].merit_position = meritPosition++;
        for (let i = 1; i < sortedPassed.length; i++) {
            if (sortedPassed[i].calculated_gpa === sortedPassed[i-1].calculated_gpa &&
                sortedPassed[i].calculated_total_marks === sortedPassed[i-1].calculated_total_marks) {
                sortedPassed[i].merit_position = sortedPassed[i-1].merit_position;
            } else {
                sortedPassed[i].merit_position = meritPosition;
            }
            meritPosition++;
        }
    }
    return sortedPassed;
  }, [allResults, reportFilters]);

  const generateFailListData = useCallback(() => {
    if (!reportFilters.class || !reportFilters.section || !reportFilters.year) return [];
    return allResults.filter(student =>
      String(getNumericClass(student.class)) === String(getNumericClass(reportFilters.class)) &&
      String(student.section)?.toLowerCase() === reportFilters.section.toLowerCase() &&
      String(student.year) === reportFilters.year &&
      !student.calculated_is_passed
    ).sort((a, b) => (a.roll || 0) - (b.roll || 0)); // Sort failed students by roll
  }, [allResults, reportFilters]);

  const currentReportData = useMemo(() => {
    // Reset showFullTable when filters change or report view changes
    setShowFullTable(false);
    setExpandedStudent(null);
    switch (activeReportView) {
      case 'tabulation': return generateTabulationSheetData();
      case 'meritList': return generateMeritListData();
      case 'failList': return generateFailListData();
      default: return [];
    }
  }, [activeReportView, generateTabulationSheetData, generateMeritListData, generateFailListData, reportFilters]); // Depend on reportFilters

  const handleDownloadReportPDF = async () => {
    if (!reportFilters.class || !reportFilters.section || !reportFilters.year || currentReportData.length === 0) {
      return Swal.fire('Filter & Data Required', 'Please select Class, Section, and Year, and ensure data exists to generate a PDF report.', 'warning');
    }
    Swal.fire({ title: 'Generating PDF...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      let doc;
      let filenamePrefix = '';
      const schoolInfo = {
        schoolName: "Your School Name", // Replace with actual school name from config/props
        address: "Your School Address", // Replace with actual school address
        examType: reportFilters.examType,
        class: getClassText(reportFilters.class),
        section: reportFilters.section,
        year: reportFilters.year
      };

      if (activeReportView === 'tabulation') {
        doc = <TabulationSheetPDF data={currentReportData} filters={schoolInfo} />;
        filenamePrefix = 'TabulationSheet';
      } else if (activeReportView === 'meritList') {
        doc = <MeritListPDF data={currentReportData} filters={schoolInfo} />;
        filenamePrefix = 'MeritList';
      } else if (activeReportView === 'failList') {
        doc = <FailListPDF data={currentReportData} filters={schoolInfo} />;
        filenamePrefix = 'FailList';
      } else {
        Swal.close();
        return Swal.fire('Error', 'Invalid report type selected.', 'error');
      }
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filenamePrefix}_${reportFilters.class}-${reportFilters.section}_${reportFilters.year}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      Swal.close();
      Swal.fire({ title: 'Success!', text: 'PDF generated successfully.', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (error) {
      console.error(`Error generating PDF:`, error);
      Swal.close();
      Swal.fire('Error', `Failed to generate PDF. Error: ${error.message}`, 'error');
    }
  };

  // Function to get subject details including individual component marks for display in tabulation
  const getSubjectDetails = (student) => {
    // This function now directly uses calculated_all_subjects_details stored in the student object
    // after initial processing in fetchAllResults. This is more efficient.
    return student.calculated_all_subjects_details || [];
  };

  const handleExportToExcel = () => {
    if (currentReportData.length === 0) {
      return Swal.fire('No Data', 'No data available in the current report to export.', 'info');
    }
    Swal.fire({ title: 'Generating Excel...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
        let filename = 'report';
        if (activeReportView === 'tabulation') filename = `TabulationSheet_${reportFilters.class}-${reportFilters.section}_${reportFilters.year}`;
        if (activeReportView === 'meritList') filename = `MeritList_${reportFilters.class}-${reportFilters.section}_${reportFilters.year}`;
        if (activeReportView === 'failList') filename = `FailList_${reportFilters.class}-${reportFilters.section}_${reportFilters.year}`;

        // Get all possible subjects from the first student in the filtered data (or an example student)
        const exampleStudentForSubjects = currentReportData[0];
        // Use `getAllExpectedSubjects` to get a structured list of all possible subjects for consistency.
        // Then map them to the display names potentially using `Religion_Name` if available on the student.
        const allPossibleSubjectsInClass = exampleStudentForSubjects
            ? getAllExpectedSubjects(exampleStudentForSubjects).sort((a, b) => a.name.localeCompare(b.name))
            : [];


        const excelData = currentReportData.map(student => {
            const baseInfo = {
                'Roll': student.roll, 'Student Name': student.student_name, 'Class': getClassText(student.class),
                'Section': student.section, 'Year': student.year, 'Exam Type': student.exam_name || reportFilters.examType,
            };

            if (activeReportView === 'tabulation') {
                const subjectDetailsMap = {};
                student.calculated_all_subjects_details.forEach(sub => {
                    subjectDetailsMap[sub.subject] = sub; // Map by displayed subject name
                });

                const subjectColumns = {};
                allPossibleSubjectsInClass.forEach(subDef => {
                    // Determine the display name for the subject column header
                    let subjectDisplayName = subDef.name;
                    if (subDef.key === 'Religion') {
                        subjectDisplayName = student.Religion_Name || 'Religion'; // Use student's specific religion name
                    } else if (subDef.key === 'Optional') {
                        subjectDisplayName = student.Optional_Subject_Name || 'Optional Subject';
                    }

                    // Get the actual subject data from the student's calculated details, mapped by original subject name
                    const detailedSubject = subjectDetailsMap[subDef.name] || {};
                    const cq = detailedSubject.cq !== undefined ? detailedSubject.cq : 'NA';
                    const mcq = detailedSubject.mcq !== undefined ? detailedSubject.mcq : 'NA';
                    const practical = detailedSubject.practical !== undefined ? detailedSubject.practical : 'NA';
                    const total = detailedSubject.total !== undefined ? detailedSubject.total : 'NA';
                    const grade = detailedSubject.grade !== undefined ? detailedSubject.grade : 'NA';
                    const gpa = detailedSubject.gpa !== undefined ? detailedSubject.gpa : 'NA';
                    const passed = detailedSubject.passed !== undefined ? (detailedSubject.passed ? 'Passed' : 'Failed') : 'NA';


                    // Only add columns if the subject might have those components
                    if (subDef.hasCQ) subjectColumns[`${subjectDisplayName} (CQ)`] = cq;
                    if (subDef.hasMCQ) subjectColumns[`${subjectDisplayName} (MCQ)`] = mcq;
                    if (subDef.hasPractical || subDef.isAssessment) subjectColumns[`${subjectDisplayName} (Practical/Assessment)`] = practical;

                    subjectColumns[`${subjectDisplayName} (Total)`] = total;
                    subjectColumns[`${subjectDisplayName} (Grade)`] = grade;
                    subjectColumns[`${subjectDisplayName} (GPA)`] = (!detailedSubject.passed && !detailedSubject.isAssessment) ? 'N/A' : (typeof gpa === 'number' ? gpa.toFixed(2) : gpa);
                    subjectColumns[`${subjectDisplayName} (Status)`] = passed;
                });

                return {
                    'Merit Position': student.calculated_is_passed ? student.merit_position_tabulation : 'N/A', // Show N/A for failed students
                    ...baseInfo,
                    ...subjectColumns,
                    'Overall Total Marks': student.calculated_total_marks,
                    'Calculated GPA': student.calculated_is_passed ? student.calculated_gpa?.toFixed(2) : 'N/A', // Show N/A if failed
                    'Overall Grade': student.calculated_overall_grade,
                    'Overall Status': student.calculated_is_passed ? 'Passed' : 'Failed',
                    'Failed Subjects List': student.calculated_failed_subjects,
                };
            } else if (activeReportView === 'meritList') {
                return {
                    'Merit Position': student.merit_position, ...baseInfo,
                    'Calculated GPA': student.calculated_gpa?.toFixed(2),
                    'Overall Total Marks': student.calculated_total_marks,
                    'Overall Grade': student.calculated_overall_grade,
                };
            } else if (activeReportView === 'failList') {
                return { ...baseInfo,
                    'Failed Subjects': student.calculated_failed_subjects,
                    'Calculated GPA': 'N/A', // Always N/A for failed students in fail list
                    'Overall Total Marks': student.calculated_total_marks,
                    'Overall Grade': student.calculated_overall_grade,
                };
            }
            return {};
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, activeReportView.replace('List', ' List'));
        XLSX.writeFile(wb, `${filename}.xlsx`);
        Swal.close();
        Swal.fire({ title: 'Success!', text: 'Excel generated successfully.', icon: 'success', timer: 2000, showConfirmButton: false });
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        Swal.close();
        Swal.fire('Error', `Failed to export to Excel. Error: ${error.message}`, 'error');
    }
  };


  const renderTabulationTable = () => {
    if (currentReportData.length === 0) return null;

    // Get all possible subject names to create dynamic headers from the *first* student in the processed data
    const exampleStudent = currentReportData[0];
    // Use `getAllExpectedSubjects` to get a structured list of all possible subjects for consistency.
    // Then map them to the display names potentially using `Religion_Name` if available on the student.
    const allPossibleSubjects = exampleStudent
        ? getAllExpectedSubjects(exampleStudent).sort((a,b) => a.name.localeCompare(b.name))
        : [];

    const displayData = showFullTable ? currentReportData : currentReportData.slice(0, 5);

    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">Total Students</h3>
            <p className="text-2xl font-bold text-blue-900">{currentReportData.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-sm font-medium text-green-800">Passed</h3>
            <p className="text-2xl font-bold text-green-900">
              {currentReportData.filter(s => s.calculated_is_passed).length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-sm font-medium text-red-800">Failed</h3>
            <p className="text-2xl font-bold text-red-900">
              {currentReportData.filter(s => !s.calculated_is_passed).length}
            </p>
          </div>
        </div>

        {/* Full Tabulation Table View */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merit Position</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  {/* {allPossibleSubjects.map(subDef => (
                    <th key={subDef.key + '_total'} className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {subDef.key === 'Religion' ? exampleStudent.Religion_Name || 'Religion' : subDef.name} (Total)
                    </th>
                  ))} */}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Total</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((student, index) => {
                  // Use the already calculated subject details stored in the student object
                  const studentSubjectDetails = student.calculated_all_subjects_details || [];
                  const subjectDetailsMap = {};
                  studentSubjectDetails.forEach(sub => { subjectDetailsMap[sub.subject] = sub; });

                  return (
                    <React.Fragment key={student.id}>
                      <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                            {student.calculated_is_passed ? student.merit_position_tabulation : 'N/A'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.roll}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.student_name}</td>
                        {/* {allPossibleSubjects.map(subDef => {
                            const subjectData = subjectDetailsMap[subDef.name]; // Access by displayed subject name
                            return (
                                <td key={`${student.id}-${subDef.key || subDef.subject}-total`} className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 text-center">
                                    {subjectData && typeof subjectData.total === 'number' ? subjectData.total : 'NA'}
                                </td>
                            );
                        })} */}
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.calculated_total_marks}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                            {student.calculated_is_passed ? student.calculated_gpa?.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.calculated_overall_grade}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.calculated_is_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {student.calculated_is_passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">
                          <button
                            onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            {expandedStudent === student.id ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>
                      {expandedStudent === student.id && (
                        <tr>
                          {/* Colspan needs to be dynamic based on the number of subject columns + fixed columns (Merit, Roll, Name, Overall Total, GPA, Grade, Status, Details) */}
                          <td colSpan={allPossibleSubjects.length + 8} className="p-4 bg-gray-100 border-t border-gray-200">
                            <h4 className="text-md font-semibold text-gray-700 mb-3">Full Marksheet for {student.student_name}</h4>
                            <StudentMarksheet studentData={student} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!showFullTable && currentReportData.length > 5 && (
            <div className="text-center py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowFullTable(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Show All {currentReportData.length} Students
              </button>
            </div>
          )}
          {showFullTable && currentReportData.length > 5 && (
            <div className="text-center py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setShowFullTable(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };


  const renderMeritListTable = () => {
    if (currentReportData.length === 0) return <p className="text-center text-gray-500">No students passed for this selection.</p>;

    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReportData.map((student, index) => (
                <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.merit_position}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.roll}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.student_name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{getClassText(student.class)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.section}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.calculated_total_marks}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.calculated_gpa?.toFixed(2)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.calculated_overall_grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFailListTable = () => {
    if (currentReportData.length === 0) return <p className="text-center text-gray-500">No students failed for this selection.</p>;

    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed Subjects</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReportData.map((student, index) => (
                <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.roll}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.student_name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{getClassText(student.class)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.section}</td>
                  <td className="px-3 py-2 text-sm text-red-700">{student.calculated_failed_subjects || 'N/A'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{student.calculated_total_marks}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{'N/A'}</td> {/* Explicitly N/A for failed in fail list */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Student Report Generator</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">Class:</label>
            <select
              id="class-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              value={reportFilters.class}
              onChange={(e) => setReportFilters({ ...reportFilters, class: e.target.value })}
            >
              <option value="">Select Class</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{getClassText(cls)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="section-select" className="block text-sm font-medium text-gray-700 mb-1">Section:</label>
            <select
              id="section-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              value={reportFilters.section}
              onChange={(e) => setReportFilters({ ...reportFilters, section: e.target.value })}
            >
              <option value="">Select Section</option>
              {uniqueSections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
            <select
              id="year-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              value={reportFilters.year}
              onChange={(e) => setReportFilters({ ...reportFilters, year: e.target.value })}
            >
              <option value="">Select Year</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="exam-type-select" className="block text-sm font-medium text-gray-700 mb-1">Exam Type:</label>
            <select
              id="exam-type-select"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              value={reportFilters.examType}
              onChange={(e) => setReportFilters({ ...reportFilters, examType: e.target.value })}
            >
              <option value="Annual Exam">Annual Exam</option>
              <option value="Half-Yearly Exam">Half-Yearly Exam</option>
              {/* Add more exam types as needed */}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Report Views</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveReportView('tabulation')}
            className={`px-5 py-2 rounded-lg font-medium transition duration-200 ease-in-out ${activeReportView === 'tabulation' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Tabulation Sheet
          </button>
          <button
            onClick={() => setActiveReportView('meritList')}
            className={`px-5 py-2 rounded-lg font-medium transition duration-200 ease-in-out ${activeReportView === 'meritList' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Merit List
          </button>
          <button
            onClick={() => setActiveReportView('failList')}
            className={`px-5 py-2 rounded-lg font-medium transition duration-200 ease-in-out ${activeReportView === 'failList' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Fail List
          </button>
        </div>

        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handleDownloadReportPDF}
            disabled={loading || currentReportData.length === 0 || !reportFilters.class || !reportFilters.section || !reportFilters.year}
            className={`px-4 py-2 bg-red-500 text-white rounded-md flex items-center space-x-2 transition duration-200 ease-in-out ${loading || currentReportData.length === 0 || !reportFilters.class || !reportFilters.section || !reportFilters.year ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M.5 8A.5.5 0 011 7.5h11.5a.5.5 0 010 1H1a.5.5 0 01-.5-.5zM.5 10a.5.5 0 01.5-.5h11.5a.5.5 0 010 1H1a.5.5 0 01-.5-.5zM.5 12a.5.5 0 01.5-.5h11.5a.5.5 0 010 1H1a.5.5 0 01-.5-.5zM14 4h-.5a.5.5 0 00-.5.5v3.293L12.646 7.146a.5.5 0 00-.708.708l1.5 1.5a.5.5 0 00.708 0l1.5-1.5a.5.5 0 00-.708-.708L14.5 7.793V4.5a.5.5 0 00-.5-.5z" clipRule="evenodd" />
            </svg>
            <span>Download PDF</span>
          </button>
          <button
            onClick={handleExportToExcel}
            disabled={loading || currentReportData.length === 0 || !reportFilters.class || !reportFilters.section || !reportFilters.year}
            className={`px-4 py-2 bg-green-500 text-white rounded-md flex items-center space-x-2 transition duration-200 ease-in-out ${loading || currentReportData.length === 0 || !reportFilters.class || !reportFilters.section || !reportFilters.year ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 01-1-1V4a1 1 0 011-1h14a1 1 0 011 1v12a1 1 0 01-1 1H3zm12-5a1 1 0 00-1-1h-2a1 1 0 100 2h2a1 1 0 001-1zM7 7a1 1 0 00-1-1H4a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V7z" clipRule="evenodd" />
            </svg>
            <span>Export to Excel</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        ) : (
          <div>
            {activeReportView === 'tabulation' && renderTabulationTable()}
            {activeReportView === 'meritList' && renderMeritListTable()}
            {activeReportView === 'failList' && renderFailListTable()}
          </div>
        )}

        {(!reportFilters.class || !reportFilters.section || !reportFilters.year) && (
          <p className="text-center text-gray-500 mt-8">Please select a Class, Section, and Year to view reports.</p>
        )}
        {currentReportData.length === 0 && reportFilters.class && reportFilters.section && reportFilters.year && !loading && (
          <p className="text-center text-gray-500 mt-8">No data found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;