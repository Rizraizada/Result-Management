import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Font registration
Font.register({
  family: "Anek Bangla",
  src: "/fonts/AnekBangla-Regular.ttf",
});

// School Information
const SCHOOL_INFO = {
  name: "ভরাসার বহুমুখী উচ্চ বিদ্যালয়",
  establishedYear: "১৯২৬",
  address: "ডাকঘর: সদর ইছাপুরা, উপজেলা: বুড়িচং, জেলা: কুমিল্লা",
  email: "bharasarhs1926@gmail.com",
  principalMobile: "01719801505",
  schoolCode: "৮০৩৬",
  eiin: "১০৫২৫৬",
  mobile: "01309105256",
  logoPath: "/bhs-logo.png",
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
    fontFamily: "Anek Bangla",
    fontSize: 9,
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: "#000000",
    paddingBottom: 5,
    alignItems: "center",
  },
  logoSection: {
    width: 70,
    height: 70,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 65,
    height: 65,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  schoolName: {
    fontSize: 18,
    marginBottom: 2,
    textAlign: "center",
    fontWeight: "bold",
  },
  establishedYear: {
    fontSize: 9,
    marginBottom: 1,
    textAlign: "center",
  },
  addressText: {
    fontSize: 9,
    marginBottom: 1,
    textAlign: "center",
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 1,
  },
  contactText: {
    fontSize: 9,
    textAlign: "center",
    marginHorizontal: 3,
  },
  rightSection: {
    width: 70,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000000",
    padding: 3,
  },
  codeText: {
    fontSize: 9,
    textAlign: "center",
  },
  reportTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: 5,
    marginBottom: 5,
  },

  // Header Row Styles (Slightly taller)
  tableHeaderRow: {
    flexDirection: "row",
    minHeight: 35, // Restored to previous height
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  headerText: {
    fontSize: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  headerTextMain: {
    fontSize: 8,
    textAlign: "center",
    padding: 2,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  subGroupHeader: {
    flexDirection: "row",
    flex: 1,
  },

  // Data Row Styles (Smaller)
  tableDataRow: {
    flexDirection: "row",
    minHeight: 25, // Smaller height for data rows
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  totalRow: {
    backgroundColor: "#f0f0f0",
  },

  // Shared Cell Styles
  serialCell: {
    width: "7%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  classCell: {
    width: "8%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  sectionCell: {
    width: "7%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  studentGroupCell: {
    width: "20%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    flexDirection: "column",
  },
  totalStudentsCell: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  presentGroupCell: {
    width: "16%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    flexDirection: "column",
  },
  totalPresentCell: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  absentCell: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  percentageCell: {
    width: "8%",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },

  // Sub-group cell styles
  subGroupCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  subGroupCellLast: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
  },
  subGroupRow: {
    flexDirection: "row",
    flex: 1,
  },

  cellText: {
    fontSize: 7, // Smaller font size for data cells
    textAlign: "center",
  },
  totalRowText: {
    fontSize: 7, // Smaller font size for total row
    textAlign: "center",
    fontWeight: "bold",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 30,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    width: 120,
    textAlign: "center",
    paddingTop: 3,
    fontSize: 9,
  },
  absentListContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  absentListTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    borderBottom: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
  },
  absentListContent: {
    fontSize: 8,
    lineHeight: 1.2,
    textAlign: "left",
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
});

export const AttendancePDF = ({ attendanceData = [], date }) => {
  const calculateTotals = () => {
    return attendanceData.reduce(
      (acc, curr) => ({
        totalMaleStudents: acc.totalMaleStudents + parseInt(curr.total_male || 0),
        totalFemaleStudents: acc.totalFemaleStudents + parseInt(curr.total_female || 0),
        totalPresentMale: acc.totalPresentMale + parseInt(curr.male_count || 0),
        totalPresentFemale: acc.totalPresentFemale + parseInt(curr.female_count || 0),
        grandTotalStudents: acc.grandTotalStudents + parseInt(curr.total_students || 0),
      }),
      {
        totalMaleStudents: 0,
        totalFemaleStudents: 0,
        totalPresentMale: 0,
        totalPresentFemale: 0,
        grandTotalStudents: 0,
      }
    );
  };

  const absentStudentsText = attendanceData
    .filter(record => record.absent_student_ids && record.absent_student_ids.trim() !== "")
    .map(record => {
      const studentIds = record.absent_student_ids.split(',').map(id => id.trim()).join(', ');
      return `${record.className}-${record.sectionName}: ${studentIds}`;
    })
    .join('\n');

  const totals = calculateTotals();
  const totalPresent = totals.totalPresentMale + totals.totalPresentFemale;
  const totalAbsent = totals.grandTotalStudents - totalPresent;
  const overallPercentage = totals.grandTotalStudents > 0 
    ? ((totalPresent / totals.grandTotalStudents) * 100).toFixed(2) 
    : 0;

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <Image src={SCHOOL_INFO.logoPath} style={styles.logo} />
          </View>
          <View style={styles.centerContent}>
            <Text style={styles.schoolName}>{SCHOOL_INFO.name}</Text>
            <Text style={styles.establishedYear}>
              প্রতিষ্ঠিত: {SCHOOL_INFO.establishedYear}
            </Text>
            <Text style={styles.addressText}>{SCHOOL_INFO.address}</Text>
            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>ইমেইল: {SCHOOL_INFO.email}</Text>
              <Text style={styles.contactText}>মোবাইল: {SCHOOL_INFO.mobile}</Text>
            </View>
            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>EIIN: {SCHOOL_INFO.eiin}</Text>
              <Text style={styles.contactText}>অধ্যক্ষের মোবাইল: {SCHOOL_INFO.principalMobile}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.codeText}>কোড: {SCHOOL_INFO.schoolCode}</Text>
          </View>
        </View>

        {/* Report Title */}
        <Text style={styles.reportTitle}>দৈনিক হাজিরা রিপোর্ট - {date}</Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.serialCell}>
              <Text style={styles.headerText}>ক্রমিক</Text>
            </View>
            <View style={styles.classCell}>
              <Text style={styles.headerText}>শ্রেণি</Text>
            </View>
            <View style={styles.sectionCell}>
              <Text style={styles.headerText}>শাখা</Text>
            </View>

            {/* Total Students Header */}
            <View style={styles.studentGroupCell}>
              <Text style={styles.headerTextMain}>মোট ছাত্র/ছাত্রী</Text>
              <View style={styles.subGroupHeader}>
                <View style={styles.subGroupCell}>
                  <Text style={styles.headerText}>ছাত্র</Text>
                </View>
                <View style={styles.subGroupCellLast}>
                  <Text style={styles.headerText}>ছাত্রী</Text>
                </View>
              </View>
            </View>

            <View style={styles.totalStudentsCell}>
              <Text style={styles.headerText}>মোট শিক্ষার্থী</Text>
            </View>

            {/* Present Header */}
            <View style={styles.presentGroupCell}>
              <Text style={styles.headerTextMain}>উপস্থিত শিক্ষার্থী</Text>
              <View style={styles.subGroupHeader}>
                <View style={styles.subGroupCell}>
                  <Text style={styles.headerText}>ছাত্র</Text>
                </View>
                <View style={styles.subGroupCellLast}>
                  <Text style={styles.headerText}>ছাত্রী</Text>
                </View>
              </View>
            </View>

            <View style={styles.totalPresentCell}>
              <Text style={styles.headerText}>মোট উপস্থিত</Text>
            </View>
            <View style={styles.absentCell}>
              <Text style={styles.headerText}>মোট অনুপস্থিত</Text>
            </View>
            <View style={styles.percentageCell}>
              <Text style={styles.headerText}>শতকরা হার</Text>
            </View>
          </View>

          {/* Table Rows */}
          {attendanceData.map((record, index) => {
            const male = parseInt(record.total_male || 0);
            const female = parseInt(record.total_female || 0);
            const total = parseInt(record.total_students || 0);
            const malePresent = parseInt(record.male_count || 0);
            const femalePresent = parseInt(record.female_count || 0);
            const present = malePresent + femalePresent;
            const absent = total - present;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : "0";

            return (
              <View key={index} style={styles.tableDataRow}>
                <View style={styles.serialCell}>
                  <Text style={styles.cellText}>{index + 1}</Text>
                </View>
                <View style={styles.classCell}>
                  <Text style={styles.cellText}>{record.className}</Text>
                </View>
                <View style={styles.sectionCell}>
                  <Text style={styles.cellText}>{record.sectionName}</Text>
                </View>

                {/* Total Students */}
                <View style={styles.studentGroupCell}>
                  <View style={styles.subGroupRow}>
                    <View style={styles.subGroupCell}>
                      <Text style={styles.cellText}>{male}</Text>
                    </View>
                    <View style={styles.subGroupCellLast}>
                      <Text style={styles.cellText}>{female}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.totalStudentsCell}>
                  <Text style={styles.cellText}>{total}</Text>
                </View>

                {/* Present Students */}
                <View style={styles.presentGroupCell}>
                  <View style={styles.subGroupRow}>
                    <View style={styles.subGroupCell}>
                      <Text style={styles.cellText}>{malePresent}</Text>
                    </View>
                    <View style={styles.subGroupCellLast}>
                      <Text style={styles.cellText}>{femalePresent}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.totalPresentCell}>
                  <Text style={styles.cellText}>{present}</Text>
                </View>
                <View style={styles.absentCell}>
                  <Text style={styles.cellText}>{absent}</Text>
                </View>
                <View style={styles.percentageCell}>
                  <Text style={styles.cellText}>{percentage}%</Text>
                </View>
              </View>
            );
          })}

          {/* Total Row */}
          <View style={[styles.tableDataRow, styles.tableRowLast, styles.totalRow]}>
            <View style={styles.serialCell}>
              <Text style={styles.totalRowText}>মোট</Text>
            </View>
            <View style={styles.classCell}>
              <Text style={styles.totalRowText}>-</Text>
            </View>
            <View style={styles.sectionCell}>
              <Text style={styles.totalRowText}>-</Text>
            </View>

            {/* Total Male/Female */}
            <View style={styles.studentGroupCell}>
              <View style={styles.subGroupRow}>
                <View style={styles.subGroupCell}>
                  <Text style={styles.totalRowText}>{totals.totalMaleStudents}</Text>
                </View>
                <View style={styles.subGroupCellLast}>
                  <Text style={styles.totalRowText}>{totals.totalFemaleStudents}</Text>
                </View>
              </View>
            </View>

            <View style={styles.totalStudentsCell}>
              <Text style={styles.totalRowText}>{totals.grandTotalStudents}</Text>
            </View>

            {/* Total Present Male/Female */}
            <View style={styles.presentGroupCell}>
              <View style={styles.subGroupRow}>
                <View style={styles.subGroupCell}>
                  <Text style={styles.totalRowText}>{totals.totalPresentMale}</Text>
                </View>
                <View style={styles.subGroupCellLast}>
                  <Text style={styles.totalRowText}>{totals.totalPresentFemale}</Text>
                </View>
              </View>
            </View>

            <View style={styles.totalPresentCell}>
              <Text style={styles.totalRowText}>{totalPresent}</Text>
            </View>
            <View style={styles.absentCell}>
              <Text style={styles.totalRowText}>{totalAbsent}</Text>
            </View>
            <View style={styles.percentageCell}>
              <Text style={styles.totalRowText}>{overallPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Simplified Absent Student List Section */}
        {absentStudentsText && (
          <View style={styles.absentListContainer}>
            <Text style={styles.absentListTitle}>অনুপস্থিত শিক্ষার্থীদের তালিকা</Text>
            {attendanceData
              .filter(record => record.absent_student_ids && record.absent_student_ids.trim() !== "")
              .map((record, index) => {
                const studentIds = record.absent_student_ids.split(',').map(id => id.trim()).join(', ');
                return (
                  <Text key={index} style={styles.absentListContent}>
                    {record.className}-{record.sectionName}: {studentIds}
                  </Text>
                );
              })}
          </View>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureLine}>শ্রেণি শিক্ষকের স্বাক্ষর</Text>
          <Text style={styles.signatureLine}>প্রধান শিক্ষকের স্বাক্ষর</Text>
        </View>
      </Page>
    </Document>
  );
};