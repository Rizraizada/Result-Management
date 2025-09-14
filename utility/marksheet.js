import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

// Font registration for Bangla support
Font.register({
  family: "Anek Bangla",
  src: "/fonts/AnekBangla-Regular.ttf",
});

const SCHOOL_INFO = {
    name: 'ভরাসার বহুমুখী উচ্চ বিদ্যালয়',
    establishedYear: '১৯২৬',
    address: 'ডাকঘর: সদর ইছাপুরা, উপজেলা: বুড়িচং, জেলা: কুমিল্লা',
    addressEnglish: 'Post Office: Sadar Ichapura, Upazila: Burichang, District: Cumilla',
    email: 'bharasarhs1926@gmail.com',
    mobile: '০১৭১৯৮০১৫০৫',
    schoolCode: '৮০৩৬',
    eiin: '১০৫২৫৬',
    logo: '/bhs-logo.png'
  };
  
  // Helper function to calculate grade and GPA
  const calculateGrade = (marks, totalPossible) => {
    const percentage = (marks / totalPossible) * 100;
    
    if (percentage >= 80) return { grade: 'A+', gpa: 5.0 };
    if (percentage >= 70) return { grade: 'A', gpa: 4.0 };
    if (percentage >= 60) return { grade: 'A-', gpa: 3.5 };
    if (percentage >= 50) return { grade: 'B', gpa: 3.0 };
    if (percentage >= 40) return { grade: 'C', gpa: 2.0 };
    if (percentage >= 33) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  };
  
  const styles = StyleSheet.create({
    page: {
      padding: 15,
      fontSize: 12,
      fontFamily: 'Anek Bangla'
    },
    header: {
      position: 'relative',
      alignItems: 'center',
      marginBottom: 20,
      height: 100,
      marginTop: 10,
      borderBottomWidth: 1.5,
      borderBottomColor: '#0d47a1',
      paddingBottom: 10,
    },
    logoContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 10
    },
    logo: {
      width: 80,
      height: 80
    },
  
    gradingBox: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 90,
      height: 89,
      borderWidth: 1,
      borderColor: '#333',
      backgroundColor: '#f9f9f9'
    },
    gradingTitle: {
      fontSize: 7,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 3,
      backgroundColor: '#e0e0e0',
      borderBottomWidth: 1,
      borderBottomColor: '#333'
    },
    gradingTable: {
      width: '100%',
      flex: 1
    },
    gradingRow: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#ccc',
      minHeight: 9
    },
    gradeCell: {
      fontSize: 6,
      padding: 1,
      borderRightWidth: 0.5,
      borderRightColor: '#ccc',
      width: '60%',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    gpaCell: {
      fontSize: 6,
      padding: 1,
      width: '40%',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    schoolInfoContainer: {
      alignItems: 'center',
      paddingHorizontal: 80,
    },
    schoolName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#1a365d',
      textAlign: 'center',
      marginBottom: 2,
    },
    establishedText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#00796b',
    },
    schoolDetails: {
      fontSize: 8.5,
      color: '#424242',
      textAlign: 'center',
    },
    contactInfo: {
      fontSize: 8,
      color: '#283593',
      textAlign: 'center',
    },
    codeInfo: {
      fontSize: 7.5,
      fontWeight: 'bold',
      color: '#d84315',
      textAlign: 'center',
      marginTop: 2,
    },
    title: {
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
      padding: 4,
      borderWidth: 1,
      borderColor: '#333333',
      backgroundColor: '#f5f5f5',
      color: '#333333'
    },
    titleLine1: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#3f51b5',
    },
    titleLine2: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#e91e63',
    },
  
    infoGrid: {
      flexDirection: 'row',
      marginBottom: 10,
      marginTop: 5,
      borderWidth: 1,
      borderColor: '#333',
      padding: 6
    },
    infoColumn: {
      flex: 1,
      paddingRight: 8
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 3
    },
    infoLabel: {
      width: 70,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#333'
    },
    infoColon: {
      width: 6,
      fontSize: 8
    },
    infoValue: {
      flex: 1,
      fontSize: 9,
      borderBottomWidth: 0.5,
      borderBottomColor: '#666',
      paddingBottom: 1
    },
    table: {
      borderWidth: 1,
      borderColor: '#333',
      marginBottom: 10
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f0f0f0',
      borderBottomWidth: 1,
      borderBottomColor: '#333'
    },
    headerCell: {
      fontSize: 9,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 3,
      borderRightWidth: 1,
      borderRightColor: '#333',
      paddingHorizontal: 1
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#666',
      minHeight: 14
    },
    tableCell: {
      fontSize: 9,
      paddingVertical: 2,
      textAlign: 'center',
      borderRightWidth: 0.5,
      borderRightColor: '#666',
      paddingHorizontal: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    subjectCell: {
      fontSize: 9,
      paddingVertical: 2,
      paddingLeft: 3,
      textAlign: 'left',
      borderRightWidth: 0.5,
      borderRightColor: '#666',
      justifyContent: 'center'
    },
  
    sectionHeader: {
      backgroundColor: '#e8f5e8',
      borderBottomWidth: 1,
      borderBottomColor: '#333',
      paddingVertical: 2
    },
    sectionTitle: {
      fontSize: 9,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#2d7d32',
      paddingVertical: 1
    },
  
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
      padding: 6,
      borderWidth: 1,
      borderColor: '#333',
      backgroundColor: '#f9f9f9'
    },
    summaryItem: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#333'
    },
  
    failedSection: {
      marginBottom: 8,
      padding: 6,
      borderWidth: 1,
      borderColor: '#d32f2f',
      backgroundColor: '#fff5f5'
    },
    failedTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      color: '#d32f2f',
      textAlign: 'center',
      marginBottom: 4
    },
    failedList: {
      fontSize: 8,
      color: '#b71c1c',
      textAlign: 'center',
      lineHeight: 1.3
    },
  
    footer: {
      marginTop: 20,
      borderTopWidth: 1,
      borderTopColor: '#333',
      paddingTop: 10
    },
    signatureRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginTop: 5,
      paddingHorizontal: 15
    },
    signature: {
      textAlign: 'center',
      fontSize: 8,
      fontWeight: 'bold',
      borderTopWidth: 1,
      borderTopColor: '#333',
      paddingTop: 5,
      width: 70,
      color: '#333'
    },
  
    w8: { width: '8%' },
    w10: { width: '12%' },
    w30: { width: '35%' },
    pass: { color: '#2e7d32' },
    fail: { color: '#d32f2f' }
  });
  
  // Helper function to convert numeric class to text for display
  const getClassText = (classNum) => {
    const classMap = {
      6: 'Six',
      7: 'Seven',
      8: 'Eight',
      9: 'Nine',
      10: 'Ten'
    };
    const parsedClass = parseInt(classNum);
    return classMap[parsedClass] || classNum;
  };
  
  // Helper function to get a reliable numeric class value
  const getNumericClass = (classValue) => {
    const classTextToNumberMap = {
      'six': 6,
      'seven': 7,
      'eight': 8,
      'nine': 9,
      'ten': 10
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

export const StudentMarksheet = ({ studentData, subjectConfig }) => {
  const student = studentData;

  const getSubjectStructure = () => {
    return subjectConfig;
  };

  const getSubjectData = () => {
    const structure = getSubjectStructure();
    const allProcessedSubjects = [];
    let serialNo = 1;
    let totalMarksObtained = 0;
    let totalPossibleMarks = 0;
    let failedSubjectsCount = 0;
    let totalGPA = 0;
    let gpaCounter = 0;

    const getSafeMark = (mark) => {
        return (mark !== undefined && mark !== null && mark !== '') ? Number(mark) : null;
    };

    structure.forEach(subjectDef => {
        const key = subjectDef.subject_key;
        let subjectName = subjectDef.subject_name;
        let passMark = subjectDef.pass_mark;

        // Determine the actual keys for marks in the student data
        let cqMark = getSafeMark(student[`${key}_CQ`]);
        let mcqMark = getSafeMark(student[`${key}_MCQ`]);
        let practicalMark = getSafeMark(student[`${key}_Practical`]);
        let totalMark = 0;
        let hasMarks = false;

        // Handle the special cases for Religion and Optional subjects where data keys are different
        if (key === 'Religion') {
            cqMark = getSafeMark(student.Religion_CQ);
            mcqMark = getSafeMark(student.Religion_MCQ);
            if (student.Religion_Name) {
                subjectName = student.Religion_Name;
            }
        }
        if (key === 'Optional') {
            cqMark = getSafeMark(student.Optional_CQ);
            mcqMark = getSafeMark(student.Optional_MCQ);
            practicalMark = getSafeMark(student.Optional_Practical);
            if (student.Optional_Subject_Name) {
                subjectName = student.Optional_Subject_Name;
            }
        }
        
        // Check for continuous assessment marks if they exist
        if (key.includes('Assessment') || key.includes('Practical')) {
            const assessmentMark = getSafeMark(student[key]);
            if (assessmentMark !== null) {
                totalMark = assessmentMark;
                hasMarks = true;
            }
        } else {
            // Sum up marks for standard subjects
            if (cqMark !== null) { totalMark += cqMark; hasMarks = true; }
            if (mcqMark !== null) { totalMark += mcqMark; hasMarks = true; }
            if (practicalMark !== null) { totalMark += practicalMark; hasMarks = true; }
        }

        // Only process subjects with available marks
        if (hasMarks) {
            let isPassed = true;
            let grade = 'N/A';
            let gpa = 'N/A';
            let totalPossible = subjectDef.total_marks;

            if (totalPossible > 0) {
                // Determine pass/fail status and grade
                isPassed = totalMark >= passMark;
                
                const percentage = (totalMark / totalPossible) * 100;
                
                if (percentage >= 80) { grade = 'A+'; gpa = 5.0; }
                else if (percentage >= 70) { grade = 'A'; gpa = 4.0; }
                else if (percentage >= 60) { grade = 'A-'; gpa = 3.5; }
                else if (percentage >= 50) { grade = 'B'; gpa = 3.0; }
                else if (percentage >= 40) { grade = 'C'; gpa = 2.0; }
                else if (percentage >= 33) { grade = 'D'; gpa = 1.0; }
                else { grade = 'F'; gpa = 0.0; }

                if (!isPassed) {
                    failedSubjectsCount++;
                }

                totalGPA += gpa;
                gpaCounter++;
                totalMarksObtained += totalMark;
                totalPossibleMarks += totalPossible;
            } else {
                // For subjects with 0 total marks, like assessments
                isPassed = true;
                totalPossible = 'N/A';
            }

            allProcessedSubjects.push({
                serial: serialNo++,
                subject: subjectName,
                cq: cqMark !== null ? cqMark : 'NA',
                mcq: mcqMark !== null ? mcqMark : 'NA',
                practical: practicalMark !== null ? practicalMark : 'NA',
                total: totalMark,
                grade: grade,
                gpa: gpa,
                passed: isPassed,
                totalPossible: totalPossible,
                isOptional: subjectDef.is_optional
            });
        }
    });

    return { 
        allSubjects: allProcessedSubjects,
        totalMarks: totalMarksObtained,
        failedSubjects: failedSubjectsCount,
        gpa: gpaCounter > 0 ? (totalGPA / gpaCounter).toFixed(2) : 0
    };
};

  const { allSubjects } = getSubjectData();
  
  // Filtering for GPA and total marks calculation
  const gpaEligibleSubjects = allSubjects.filter(sub =>
    sub.totalPossible > 0 && typeof sub.total === 'number'
  );
  
  const totalMarks = gpaEligibleSubjects.reduce((sum, sub) => sum + sub.total, 0);
  const totalGPA = gpaEligibleSubjects.reduce((sum, sub) => sum + (sub.passed ? sub.gpa : 0), 0);
  const passedSubjects = gpaEligibleSubjects.filter(sub => sub.passed);
  const failedSubjects = gpaEligibleSubjects.filter(sub => !sub.passed);

  const avgGPA = gpaEligibleSubjects.length > 0 ? (totalGPA / gpaEligibleSubjects.length).toFixed(2) : '0.00';
  const finalGrade = failedSubjects.length > 0 ? 'F' :
    (gpaEligibleSubjects.length > 0 ? calculateGrade(parseFloat(avgGPA) * 20, 100).grade : 'N/A');
  const finalResult = failedSubjects.length > 0 ? 'Fail' : 'Pass';

  const gradingData = [
    { grade: 'A+ (80-100%)', gpa: '5.0' },
    { grade: 'A (70-79%)', gpa: '4.0' },
    { grade: 'A- (60-69%)', gpa: '3.5' },
    { grade: 'B (50-59%)', gpa: '3.0' },
    { grade: 'C (40-49%)', gpa: '2.0' },
    { grade: 'D (33-39%)', gpa: '1.0' },
    { grade: 'F (0-32%)', gpa: '0.0' }
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} src={SCHOOL_INFO.logo} />
          </View>
          <View style={styles.schoolInfoContainer}>
            <Text style={styles.schoolName}>{SCHOOL_INFO.name}</Text>
            <Text style={styles.establishedText}>স্থাপিত: {SCHOOL_INFO.establishedYear} ইং</Text>
            <Text style={styles.schoolDetails}>{SCHOOL_INFO.address}</Text>
            <Text style={styles.schoolDetails}>{SCHOOL_INFO.addressEnglish}</Text>
            <Text style={styles.contactInfo}>Email: {SCHOOL_INFO.email} | Mobile: {SCHOOL_INFO.mobile}</Text>
            <Text style={styles.codeInfo}>School Code: {SCHOOL_INFO.schoolCode}, EIIN: {SCHOOL_INFO.eiin}</Text>
          </View>

          <View style={styles.gradingBox}>
            <Text style={styles.gradingTitle}>GRADE POINT AVERAGE</Text>
            <View style={styles.gradingTable}>
              {gradingData.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.gradingRow,
                    { borderBottomWidth: index === gradingData.length - 1 ? 0 : 0.5 }
                  ]}
                >
                  <Text style={styles.gradeCell}>{item.grade}</Text>
                  <Text style={[styles.gpaCell, { borderRightWidth: 0 }]}>
                    {item.gpa}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.title}>
          <Text style={styles.titleLine1}>STUDENT MARKSHEET</Text>
          <Text style={styles.titleLine2}>
            {student.exam_name ? `${student.exam_name} Examination` : 'Examination'}
          </Text>
        </View>

        {/* Student Information */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.student_name || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Father's Name</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.father_name || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mother's Name</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.mother_name || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Guardian Phone</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.guardian_phone || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Session</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.session || ''}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Roll</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.roll || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Class</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.class || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Section</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.section || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Group</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.group_name || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Year</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{student.year || ''}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.w8]}>SL</Text>
            <Text style={[styles.headerCell, styles.w30]}>SUBJECTS</Text>
            <Text style={[styles.headerCell, styles.w10]}>CQ</Text>
            <Text style={[styles.headerCell, styles.w10]}>MCQ</Text>
            <Text style={[styles.headerCell, styles.w10]}>Practical</Text>
            <Text style={[styles.headerCell, styles.w10]}>Total</Text>
            <Text style={[styles.headerCell, styles.w10]}>Grade</Text>
            <Text style={[styles.headerCell, { width: '12%', borderRightWidth: 0 }]}>GPA</Text>
          </View>
          {allSubjects.map((subject, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, styles.w8]}>{subject.serial}</Text>
              <Text style={[styles.subjectCell, styles.w30]}>{subject.subject}</Text>
              <Text style={[styles.tableCell, styles.w10]}>{subject.cq}</Text>
              <Text style={[styles.tableCell, styles.w10]}>{subject.mcq}</Text>
              <Text style={[styles.tableCell, styles.w10]}>{subject.practical}</Text>
              <Text style={[styles.tableCell, styles.w10]}>{subject.total}</Text>
              <Text style={[styles.tableCell, styles.w10, subject.passed ? styles.pass : styles.fail]}>{subject.grade}</Text>
              <Text style={[styles.tableCell, { width: '12%', borderRightWidth: 0 }, subject.passed ? styles.pass : styles.fail]}>
                {typeof subject.gpa === 'number' ? subject.gpa.toFixed(2) : subject.gpa}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryItem}>Total Marks: {totalMarks}</Text>
          <Text style={styles.summaryItem}>GPA: {avgGPA}</Text>
          <Text style={styles.summaryItem}>Grade: {finalGrade}</Text>
        </View>

        {failedSubjects.length > 0 && (
          <View style={styles.failedSection}>
            <Text style={styles.failedTitle}>Subjects Failed:</Text>
            <Text style={styles.failedList}>
              {failedSubjects.map(sub => sub.subject).join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.signatureRow}>
            <Text style={styles.signature}>Guardian's Signature</Text>
            <Text style={styles.signature}>Class Teacher's Signature</Text>
            <Text style={styles.signature}>Principal's Signature</Text>
          </View>
          <Text style={{ fontSize: 7, textAlign: 'center', marginTop: 5, color: '#666' }}>
            Generated on: {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};