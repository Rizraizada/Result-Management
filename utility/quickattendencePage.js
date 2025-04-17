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
import "@fontsource/anek-bangla";

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
    padding: 30,
    backgroundColor: "#ffffff",
    fontFamily: "Anek Bangla",
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#000000",
    paddingBottom: 10,
    alignItems: "center",
  },
  logoSection: {
    width: 100,
    height: 100,
    marginRight: 10,
    justifyContent: "center",
  },
  logo: {
    width: 90,
    height: 90,
  },
  centerContent: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
  schoolName: {
    fontSize: 24,
    marginBottom: 5,
    textAlign: "center",
  },
  establishedYear: {
    fontSize: 10,
    marginBottom: 3,
    textAlign: "center",
  },
  addressText: {
    fontSize: 10,
    marginBottom: 3,
    textAlign: "center",
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 2,
  },
  contactText: {
    fontSize: 10,
    textAlign: "center",
    marginHorizontal: 5,
  },
  rightSection: {
    width: 100,
    justifyContent: "center",
    border: 1,
    borderColor: "#000000",
    padding: 5,
    borderRadius: 2,
  },
  codeText: {
    fontSize: 10,
    textAlign: "right",
  },
  reportTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: 10,
    marginBottom: 20,
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderStyle: "solid",
    alignItems: "stretch",
  },
  serialCell: {
    width: "7%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  classCell: {
    width: "8%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  sectionCell: {
    width: "7%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  studentGroupCell: {
    width: "20%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  totalStudentsCell: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  presentGroupCell: {
    width: "16%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  subGroupCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
    padding: 2,
  },
  totalPresentCell: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  absentCell: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  percentageCell: {
    width: "8%",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  headerText: {
    fontSize: 8,
    textAlign: "center",
  },
  cellContent: {
    padding: 2,
    textAlign: "center",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    paddingHorizontal: 50,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    width: 150,
    textAlign: "center",
    paddingTop: 5,
    fontSize: 10,
  },
});

export const AttendancePDF = ({ attendanceData = sampleData, date }) => {
  const calculateTotals = () => {
    return attendanceData.reduce(
      (acc, curr) => ({
        totalMaleStudents: acc.totalMaleStudents + (curr.maleStudents || 0),
        totalFemaleStudents:
          acc.totalFemaleStudents + (curr.femaleStudents || 0),
        totalPresentMale: acc.totalPresentMale + (curr.male_count || 0),
        totalPresentFemale: acc.totalPresentFemale + (curr.female_count || 0),
      }),
      {
        totalMaleStudents: 0,
        totalFemaleStudents: 0,
        totalPresentMale: 0,
        totalPresentFemale: 0,
      }
    );
  };

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
              <Text style={styles.contactText}>
                মোবাইল: {SCHOOL_INFO.mobile}
              </Text>
            </View>
            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>EIIN: {SCHOOL_INFO.eiin}</Text>
              <Text style={styles.contactText}>
                অধ্যক্ষের মোবাইল: {SCHOOL_INFO.principalMobile}
              </Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.codeText}>কোড: {SCHOOL_INFO.schoolCode}</Text>
          </View>
        </View>

        {/* Report Title */}
        <Text style={styles.reportTitle}>দৈনিক হাজিরা রিপোর্ট - {date}</Text>

        {/* Table Structure */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <View style={styles.serialCell}>
              <Text style={styles.headerText}>Serial</Text>
            </View>
            <View style={styles.classCell}>
              <Text style={styles.headerText}>শ্রেণি</Text>
            </View>
            <View style={styles.sectionCell}>
              <Text style={styles.headerText}>শাখা</Text>
            </View>
            <View style={styles.studentGroupCell}>
              <Text style={styles.headerText}>মোট ছাত্র/ছাত্রী</Text>
              <View style={{ flexDirection: "row", borderTopWidth: 1 }}>
                <View style={styles.subGroupCell}>
                  <Text style={styles.headerText}>ছাত্র</Text>
                </View>
                <View style={[styles.subGroupCell, { borderRightWidth: 0 }]}>
                  <Text style={styles.headerText}>ছাত্রী</Text>
                </View>
              </View>
            </View>
            <View style={styles.totalStudentsCell}>
              <Text style={styles.headerText}>মোট শিক্ষার্থী</Text>
            </View>
            <View style={styles.presentGroupCell}>
              <Text style={styles.headerText}>উপস্থিত শিক্ষার্থী</Text>
              <View style={{ flexDirection: "row", borderTopWidth: 1 }}>
                <View style={styles.subGroupCell}>
                  <Text style={styles.headerText}>ছাত্র</Text>
                </View>
                <View style={[styles.subGroupCell, { borderRightWidth: 0 }]}>
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

          {/* Data Rows */}
          {/* Data Rows */}
          {attendanceData.map((record, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.serialCell}>
                <Text style={styles.cellContent}>{index + 1}</Text>
              </View>
              <View style={styles.classCell}>
                <Text style={styles.cellContent}>{record.className}</Text>
              </View>
              <View style={styles.sectionCell}>
                <Text style={styles.cellContent}>{record.sectionName}</Text>
              </View>
              <View style={styles.studentGroupCell}>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.subGroupCell}>
                    <Text style={styles.cellContent}>
                      {parseInt(record.maleStudents || "100")}
                    </Text>
                  </View>
                  <View style={[styles.subGroupCell, { borderRightWidth: 0 }]}>
                    <Text style={styles.cellContent}>
                      {parseInt(record.femaleStudents || "100")}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.totalStudentsCell}>
                <Text style={styles.cellContent}>
                  {(() => {
                    return "N/A"; // Ensure "N/A" is a string
                  })()}
                </Text>
              </View>
              <View style={styles.presentGroupCell}>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.subGroupCell}>
                    <Text style={styles.cellContent}>
                      {parseInt(record.male_count || "0")}
                    </Text>
                  </View>
                  <View style={[styles.subGroupCell, { borderRightWidth: 0 }]}>
                    <Text style={styles.cellContent}>
                      {parseInt(record.female_count || "0")}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.totalPresentCell}>
                <Text style={styles.cellContent}>
                  {(() => {
                    const malePresentCount = parseInt(record.male_count || "0");
                    const femalePresentCount = parseInt(
                      record.female_count || "0"
                    );
                    return malePresentCount + femalePresentCount;
                  })()}
                </Text>
              </View>
              <View style={styles.absentCell}>
                <Text style={styles.cellContent}>
                  {(() => {
                    const totalPresent =
                      parseInt(record.male_count || "0", 10) +
                      parseInt(record.female_count || "0", 10) -
                      100;

                    return totalPresent;
                  })()}
                </Text>
              </View>
              <View style={styles.percentageCell}>
                <Text style={styles.cellContent}>
                  {(() => {
                    const totalStudents =
                      parseInt(record.maleStudents || "100") +
                      parseInt(record.femaleStudents || "100");
                    const totalPresent =
                      parseInt(record.male_count || "0") +
                      parseInt(record.female_count || "0");
                    if (totalStudents > 0) {
                      const percentage = (totalPresent / totalStudents) * 100;
                      return `${percentage.toFixed(2)}%`;
                    }
                    return "0%";
                  })()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureLine}>শ্রেণি শিক্ষকের স্বাক্ষর</Text>
          <Text style={styles.signatureLine}>প্রধান শিক্ষকের স্বাক্ষর</Text>
        </View>
      </Page>
    </Document>
  );
};
