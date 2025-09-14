// src/components/report/ReportDocuments.jsx
import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Font registration for Bangla support
Font.register({
  family: "Anek Bangla",
  src: "/fonts/AnekBangla-Regular.ttf", // Ensure this path is correct and font file exists
});

// School Information
const SCHOOL_INFO = {
  name: 'ভরাসার বহুমুখী উচ্চ বিদ্যালয়',
  establishedYear: '১৯২৬',
  address: 'ডাকঘর: সদর ইছাপুরা, উপজেলা: বুড়িচং, জেলা: কুমিল্লা',
  addressEnglish: 'Post Office: Sadar Ichapura, Upazila: Burichang, District: Cumilla',
  email: 'bharasarhs1926@gmail.com',
  mobile: '০১৭১৯৮০১৫০৫',
  schoolCode: '৮০৩৬',
  eiin: '১০৫২৫৬',
  logo: '/bhs-logo.png' // Ensure this path is correct relative to the client-side bundle
};

// Mapping for subject display names (copied for self-containment in PDF module)
const SUBJECT_MAP = {
  // Ordered alphabetically
  Accounting_CQ: "Acc CQ",
  Accounting_MCQ: "Acc MCQ",
  ArtsCrafts_Assessment: "Arts&Crafts",
  Bangla_1st_CQ: "Bn1 CQ",
  Bangla_1st_MCQ: "Bn1 MCQ",
  Bangla_2nd_CQ: "Bn2 CQ",
  Bangla_2nd_MCQ: "Bn2 MCQ",
  BGS_CQ: "BGS CQ",
  BGS_MCQ: "BGS MCQ",
  Biology_CQ: "Bio CQ",
  Biology_MCQ: "Bio MCQ",
  Biology_Practical: "Bio Prac",
  BusinessEnt_CQ: "BE CQ",
  BusinessEnt_MCQ: "BE MCQ",
  Chemistry_CQ: "Chem CQ",
  Chemistry_MCQ: "Chem MCQ",
  Chemistry_Practical: "Chem Prac",
  Civics_CQ: "Civ CQ",
  Civics_MCQ: "Civ MCQ",
  continuous_assessment: "Cont Assmt",
  Economics_CQ: "Eco CQ",
  Economics_MCQ: "Eco MCQ",
  English_1st_CQ: "Eng1 CQ",
  English_1st_MCQ: "Eng1 MCQ",
  English_2nd_CQ: "Eng2 CQ",
  English_2nd_MCQ: "Eng2 MCQ",
  Finance_CQ: "Fin CQ",
  Finance_MCQ: "Fin MCQ",
  Geography_CQ: "Geo CQ",
  Geography_MCQ: "Geo MCQ",
  Geography_Practical: "Geo Prac",
  HigherMath_CQ: "HM CQ",
  HigherMath_MCQ: "HM MCQ",
  HigherMath_Practical: "HM Prac",
  History_CQ: "Hist CQ",
  History_MCQ: "Hist MCQ",
  ICT_CQ: "ICT CQ",
  ICT_MCQ: "ICT MCQ",
  ICT_Practical: "ICT Prac",
  Mathematics_CQ: "Math CQ",
  Mathematics_MCQ: "Math MCQ",
  Optional_Subject_Name: "Opt Sub", // Display name for the optional subject
  Optional_CQ: "Opt CQ",
  Optional_MCQ: "Opt MCQ",
  Optional_Practical: "Opt Prac",
  PhysicalEd_Practical: "PE Prac",
  PhysicalEd_Assessment: "PE Assmt",
  Physics_CQ: "Phy CQ",
  Physics_MCQ: "Phy MCQ",
  Physics_Practical: "Phy Prac",
  Religion_CQ: "Rel CQ",
  Religion_MCQ: "Rel MCQ",
  Science_CQ: "Sci CQ",
  Science_MCQ: "Sci MCQ",
};

// Utility to get subject keys with non-null values for a student
const getSubjectDetails = (studentData) => {
  const subjects = {};
  for (const key in SUBJECT_MAP) {
    if (Object.prototype.hasOwnProperty.call(studentData, key) && studentData[key] !== null && studentData[key] !== undefined) {
      subjects[key] = studentData[key];
    }
  }
  return subjects;
};

// Common Header Component - now accepts customStyles
const ReportHeader = ({ customStyles = {} }) => (
  <View style={{ ...styles.header, ...customStyles.header }}>
    <View style={{ ...styles.logoContainer, ...customStyles.logoContainer }}>
      {SCHOOL_INFO.logo && <Image src={SCHOOL_INFO.logo} style={{ ...styles.logo, ...customStyles.logo }} />}
    </View>
    <View style={{ ...styles.schoolInfoContainer, ...customStyles.schoolInfoContainer }}>
      <Text style={{ ...styles.schoolName, ...customStyles.schoolName }}>{SCHOOL_INFO.name}</Text>
      <Text style={{ ...styles.establishedText, ...customStyles.establishedText }}>{SCHOOL_INFO.name} (Established {SCHOOL_INFO.establishedYear})</Text>
      <Text style={{ ...styles.schoolDetails, ...customStyles.schoolDetails }}>{SCHOOL_INFO.address}</Text>
      <Text style={{ ...styles.contactInfo, ...customStyles.contactInfo }}>Mobile: {SCHOOL_INFO.mobile} | Email: {SCHOOL_INFO.email}</Text>
      <Text style={{ ...styles.codeInfo, ...customStyles.codeInfo }}>School Code: {SCHOOL_INFO.schoolCode} | EIIN: {SCHOOL_INFO.eiin}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 12,
    fontFamily: 'Anek Bangla'
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 15,
    height: 95, // Default height
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
    paddingBottom: 10
  },
  logoContainer: {
    position: 'absolute',
    left: 50,
    top: 0,
    zIndex: 10
  },
  logo: {
    width: 80, // Default size
    height: 80 // Default size
  },
  schoolInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 100,
    paddingTop: 5
  },
  schoolName: {
    fontSize: 20, // Default size
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1a365d',
    textAlign: 'center',
    fontFamily: 'Anek Bangla',
  },
  establishedText: {
    fontSize: 10, // Default size
    color: '#2d7d32',
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: 'Anek Bangla',
  },
  schoolDetails: {
    fontSize: 8, // Default size
    color: '#424242',
    textAlign: 'center',
    marginBottom: 1,
    fontFamily: 'Anek Bangla',
  },
  contactInfo: {
    fontSize: 7, // Default size
    color: '#5e35b1',
    textAlign: 'center',
    marginBottom: 1,
    fontFamily: 'Anek Bangla',
  },
  codeInfo: {
    fontSize: 7, // Default size
    color: '#c62828',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Anek Bangla',
  },

  reportTitle: {
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
  filterInfo: {
    fontSize: 8.5,
    textAlign: 'center',
    marginBottom: 8,
  },

  // Table Styles
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
    minHeight: 15
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

  boldText: { fontWeight: 'bold' },
  passed: { color: 'green' },
  failed: { color: 'red' },

  footer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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


export const TabulationSheetPDF = ({ data, filters }) => {
  // Define custom header styles for Tabulation Sheet
  const tabulationHeaderStyles = StyleSheet.create({
    header: {
      height: 120, // Increased height for larger content
      paddingBottom: 15,
    },
    logoContainer: {
      left: 30, // Adjust position if needed
      top: 5,
    },
    logo: {
      width: 100, // Bigger logo
      height: 100, // Bigger logo
    },
    schoolInfoContainer: {
      paddingHorizontal: 120, // Adjust padding
      paddingTop: 10,
    },
    schoolName: {
      fontSize: 26, // Bigger font
      marginBottom: 3,
    },
    establishedText: {
      fontSize: 12, // Bigger font
      marginBottom: 3,
    },
    schoolDetails: {
      fontSize: 10, // Bigger font
      marginBottom: 2,
    },
    contactInfo: {
      fontSize: 9, // Bigger font
      marginBottom: 2,
    },
    codeInfo: {
      fontSize: 9, // Bigger font
    },
  });

  // Get all unique subject keys present across all students in the data
  let allSubjectKeys = Array.from(new Set(data.flatMap(student => Object.keys(getSubjectDetails(student)))));

  // Define the order of subjects to move to the end
  const subjectsToEnd = ["ArtsCrafts_Assessment", "BGS_CQ", "BGS_MCQ", "PhysicalEd_Practical", "PhysicalEd_Assessment", "continuous_assessment"];

  // Filter out subjects to be moved and then append them
  let reorderedSubjectKeys = allSubjectKeys
    .filter(key => !subjectsToEnd.includes(key))
    .sort(); // Sort the remaining subjects alphabetically

  // Ensure Religion related keys are sorted correctly and placed logically
  const religionKeys = ['Religion_CQ', 'Religion_MCQ'].filter(key => reorderedSubjectKeys.includes(key));
  reorderedSubjectKeys = reorderedSubjectKeys.filter(key => !religionKeys.includes(key)); // Remove them first

  if (religionKeys.length > 0) {
      const ictIndex = reorderedSubjectKeys.findIndex(key => key.startsWith('ICT_'));
      if (ictIndex !== -1) {
          reorderedSubjectKeys.splice(ictIndex, 0, ...religionKeys.sort()); // Insert before ICT
      } else {
          reorderedSubjectKeys.push(...religionKeys.sort()); // Or just add to the end if no better place found
      }
  }

  // Append the specified subjects in their desired order
  reorderedSubjectKeys = reorderedSubjectKeys.concat(
    subjectsToEnd.filter(key => allSubjectKeys.includes(key)) // Only add if they exist in the data
  );

  // Define dynamic column widths based on the number of subjects
  // Fixed columns: Merit Position (3%), Roll (2%), Name (5%), Total Marks (3.5%), GPA (2.5%), Status (3%)
  const meritPosColWidth = '3%'; // New column width
  const rollColWidth = '2%';
  const nameColWidth = '5%';
  const totalMarksColWidth = '3.5%';
  const gpaColWidth = '2.5%';
  const statusColWidth = '3%';

  const fixedColsTotalWidth = parseFloat(meritPosColWidth) + parseFloat(rollColWidth) + parseFloat(nameColWidth) +
                             parseFloat(totalMarksColWidth) + parseFloat(gpaColWidth) + parseFloat(statusColWidth); // Sum of fixed percentages

  const dynamicColWidthPercentage = reorderedSubjectKeys.length > 0
    ? (100 - fixedColsTotalWidth) / reorderedSubjectKeys.length
    : 0; // Distribute remaining width among subjects

  // Merge existing styles with new header-specific styles
  const tabulationStyles = StyleSheet.create({
    ...styles, // Inherit common styles
    // Specific Column Widths (percentages based on A3 landscape for better fit)
    meritPosCol: { width: meritPosColWidth }, // Added Merit Position column width
    rollCol: { width: rollColWidth },
    nameCol: { width: nameColWidth },
    totalMarksCol: { width: totalMarksColWidth },
    gpaCol: { width: gpaColWidth },
    statusCol: { width: statusColWidth },
    // Apply dynamic width to headerCell and tableCell for subject columns
    subjectHeaderCol: { width: `${dynamicColWidthPercentage}%` },
    subjectDataCol: { width: `${dynamicColWidthPercentage}%` },
  });

  return (
    <Document>
      <Page size="A3" orientation="landscape" style={tabulationStyles.page}>
        <ReportHeader customStyles={tabulationHeaderStyles} /> {/* Pass custom styles here */}

        <Text style={tabulationStyles.reportTitle}>Academic Tabulation Sheet</Text>
        <Text style={tabulationStyles.filterInfo}>
          Class: {filters.class || 'N/A'} | Section: {filters.section || 'N/A'} | Year: {filters.year || 'N/A'} | Exam: {filters.examType || 'N/A'}
        </Text>

        <View style={tabulationStyles.table}>
          {/* Table Header Row */}
          <View style={tabulationStyles.tableHeader} fixed> {/* 'fixed' property keeps header on every page */}
            <Text style={{ ...tabulationStyles.headerCell, ...tabulationStyles.meritPosCol }}>Merit Position</Text>
            <Text style={{ ...tabulationStyles.headerCell, ...tabulationStyles.rollCol }}>Roll</Text>
            <Text style={{ ...tabulationStyles.headerCell, ...tabulationStyles.nameCol }}>Student Name</Text>
            {reorderedSubjectKeys.map(key => (
              <Text key={key} style={{ ...tabulationStyles.headerCell, ...tabulationStyles.subjectHeaderCol }}>
                {SUBJECT_MAP[key] || key.replace(/_/g, ' ')}
              </Text>
            ))}
            <Text style={{ ...tabulationStyles.headerCell, ...tabulationStyles.totalMarksCol }}>Total Marks</Text>
            <Text style={{ ...tabulationStyles.headerCell, ...tabulationStyles.gpaCol }}>GPA</Text>
            <Text style={{ ...tabulationStyles.headerCell, ...tabulationStyles.statusCol }}>Status</Text>
          </View>

          {/* Table Data Rows */}
          {data.map((s, index) => (
            <View key={s.id || index} style={tabulationStyles.tableRow}>
              <Text style={{ ...tabulationStyles.tableCell, ...tabulationStyles.meritPosCol }}>
                {s.calculated_is_passed ? s.merit_position_tabulation : 'N/A'}
              </Text>
              <Text style={{ ...tabulationStyles.tableCell, ...tabulationStyles.rollCol }}>{s.roll}</Text>
              <Text style={{ ...tabulationStyles.subjectCell, ...tabulationStyles.nameCol }}>{s.student_name}</Text>
              {reorderedSubjectKeys.map(key => (
                <Text key={`${s.id}-${key}`} style={{ ...tabulationStyles.tableCell, ...tabulationStyles.subjectDataCol }}>
                  {s[key] !== null && s[key] !== undefined ? s[key] : '-'}
                </Text>
              ))}
              <Text style={{ ...tabulationStyles.tableCell, ...tabulationStyles.totalMarksCol, ...tabulationStyles.boldText }}>
                {s.calculated_total_marks || 'N/A'}
              </Text>
              <Text style={{ ...tabulationStyles.tableCell, ...tabulationStyles.gpaCol, ...tabulationStyles.boldText }}>
                {s.calculated_gpa?.toFixed(2) || 'N/A'}
              </Text>
              <Text style={{
                ...tabulationStyles.tableCell, ...tabulationStyles.statusCol,
                ...(s.calculated_is_passed ? tabulationStyles.passed : tabulationStyles.failed)
              }}>
                {s.calculated_is_passed ? 'Passed' : 'Failed'}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};


export const MeritListPDF = ({ data, filters }) => {
  // Merge existing styles with new header-specific styles
  const meritStyles = StyleSheet.create({
    ...styles, // Inherit common styles
    // Specific Column Widths
    meritPosCol: { width: '12%' },
    rollCol: { width: '12%' },
    nameCol: { width: '34%' },
    gpaCol: { width: '21%' },
    totalMarksCol: { width: '21%' },
  });

  return (
    <Document>
      <Page size="A4" style={meritStyles.page}>
        <ReportHeader /> {/* No custom styles passed, uses default smaller header */}

        <Text style={meritStyles.reportTitle}>Merit List</Text>
        <Text style={meritStyles.filterInfo}>
          Class: {filters.class || 'N/A'} | Section: {filters.section || 'N/A'} | Year: {filters.year || 'N/A'} | Exam: {filters.examType || 'N/A'}
        </Text>

        <View style={meritStyles.table}>
          <View style={meritStyles.tableHeader} fixed>
            <Text style={{ ...meritStyles.headerCell, ...meritStyles.meritPosCol }}>Merit Position</Text>
            <Text style={{ ...meritStyles.headerCell, ...meritStyles.rollCol }}>Roll</Text>
            <Text style={{ ...meritStyles.headerCell, ...meritStyles.nameCol }}>Student Name</Text>
            <Text style={{ ...meritStyles.headerCell, ...meritStyles.gpaCol }}>GPA</Text>
            <Text style={{ ...meritStyles.headerCell, ...meritStyles.totalMarksCol }}>Total Marks</Text>
          </View>

          {data.map((s, index) => (
            <View key={s.id || index} style={meritStyles.tableRow}>
              <Text style={{ ...meritStyles.tableCell, ...meritStyles.meritPosCol, ...meritStyles.boldText }}>{s.merit_position}</Text>
              <Text style={{ ...meritStyles.tableCell, ...meritStyles.rollCol }}>{s.roll}</Text>
              <Text style={{ ...meritStyles.subjectCell, ...meritStyles.nameCol }}>{s.student_name}</Text>
              <Text style={{ ...meritStyles.tableCell, ...meritStyles.gpaCol }}>{s.calculated_gpa?.toFixed(2) || 'N/A'}</Text>
              <Text style={{ ...meritStyles.tableCell, ...meritStyles.totalMarksCol }}>{s.calculated_total_marks || 'N/A'}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export const FailListPDF = ({ data, filters }) => {
  // Merge existing styles with new header-specific styles
  const failStyles = StyleSheet.create({
    ...styles, // Inherit common styles
    // Specific Column Widths
    rollCol: { width: '15%' },
    nameCol: { width: '30%' },
    failedSubjectsCol: { width: '40%' },
    gpaCol: { width: '15%' },
  });

  return (
    <Document>
      <Page size="A4" style={failStyles.page}>
        <ReportHeader /> {/* No custom styles passed, uses default smaller header */}

        <Text style={failStyles.reportTitle}>Fail List</Text>
        <Text style={failStyles.filterInfo}>
          Class: {filters.class || 'N/A'} | Section: {filters.section || 'N/A'} | Year: {filters.year || 'N/A'} | Exam: {filters.examType || 'N/A'}
        </Text>

        <View style={failStyles.table}>
          <View style={failStyles.tableHeader} fixed>
            <Text style={{ ...failStyles.headerCell, ...failStyles.rollCol }}>Roll</Text>
            <Text style={{ ...failStyles.headerCell, ...failStyles.nameCol }}>Student Name</Text>
            <Text style={{ ...failStyles.headerCell, ...failStyles.failedSubjectsCol }}>Failed Subjects</Text>
            <Text style={{ ...failStyles.headerCell, ...failStyles.gpaCol }}>GPA</Text>
          </View>

          {data.map((s, index) => (
            <View key={s.id || index} style={failStyles.tableRow}>
              <Text style={{ ...failStyles.tableCell, ...failStyles.rollCol }}>{s.roll}</Text>
              <Text style={{ ...failStyles.subjectCell, ...failStyles.nameCol }}>{s.student_name}</Text>
              <Text style={{ ...failStyles.tableCell, ...failStyles.failedSubjectsCol, ...failStyles.failedText }}>{s.calculated_failed_subjects || 'N/A'}</Text>
              <Text style={{ ...failStyles.tableCell, ...failStyles.gpaCol }}>{s.calculated_gpa?.toFixed(2) || 'N/A'}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};