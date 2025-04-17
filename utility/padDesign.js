import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import "@fontsource/anek-bangla";
import { Font } from "@react-pdf/renderer";
import { htmlToText } from "html-to-text"; // Import html-to-text library

// Register Bengali font
Font.register({
  family: "Anek Bangla",
  src: "/fonts/AnekBangla-Regular.ttf",
});

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
  },
  headerText: {
    position: "absolute",
    top: 10,
    left: 30,
    fontFamily: "Anek Bangla",
    fontSize: 10,
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#666",
    paddingBottom: 10,
    alignItems: "center", // Align items vertically
  },
  logoSection: {
    width: 100, // Increased width for larger logo
    height: 100, // Added height to maintain aspect ratio
    marginRight: 10,
    justifyContent: "center",
  },
  logo: {
    width: 90, // Larger logo size
    height: 90, // Maintain aspect ratio
  },
  centerContent: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
  schoolName: {
    fontFamily: "Anek Bangla",
    fontSize: 24,
    marginBottom: 5,
    textAlign: "center",
  },
  establishedYear: {
    fontFamily: "Anek Bangla",
    fontSize: 10,
    marginBottom: 3,
    textAlign: "center",
  },
  addressText: {
    fontFamily: "Anek Bangla",
    fontSize: 10,
    marginBottom: 3,
    textAlign: "center",
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginVertical: 2,
  },
  contactText: {
    fontFamily: "Anek Bangla",
    fontSize: 10,
    textAlign: "center",
  },
  rightSection: {
    width: 120,
    justifyContent: "center",
    border: 1, // Thin border
    borderColor: "#666", // Border color
    padding: 5, // Padding inside the box
    borderRadius: 2, // Optional: for slightly rounded corners
  },

  codeText: {
    fontFamily: "Anek Bangla",
    fontSize: 10,
    textAlign: "right",
    marginVertical: 2,
  },
  referenceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
  },
  referenceText: {
    fontFamily: "Anek Bangla",
    fontSize: 10,
    flexDirection: "row",
  },
  underline: {
    borderBottom: 1,
    borderBottomColor: "#666",
    width: 100,
  },
  content: {
    fontFamily: "Anek Bangla",
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: "justify", // Keep text justified without breaking
    wordBreak: "normal", // Ensure no breaks between words
    wordWrap: "normal", // Prevent word-breaking
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  contentDate: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: "right",
  },
  contentText: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: "justify",
    wordWrap: "normal", // Ensures content doesn't break on its own
    whiteSpace: "pre-wrap", // Handle spaces properly
  },
});

const NoticePDF = ({ fullNotice }) => {
  // Convert HTML to plain text, ensuring proper formatting
  const convertedContent = htmlToText(fullNotice.content, {
    wordwrap: false, // Disable wordwrap to avoid forced line breaks
    ignoreHref: true, // Ignore any hyperlinks
    ignoreImage: true, // Ignore images
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Header Text */}
        <Text style={styles.headerText}>প্রধান শিক্ষক/সম্পাদক</Text>

        {/* Main Header */}
        <View style={styles.headerContainer}>
          {/* Logo */}
          <View style={styles.logoSection}>
            <Image src={SCHOOL_INFO.logoPath} style={styles.logo} />
          </View>

          {/* Center Content */}
          <View style={styles.centerContent}>
            <Text style={styles.schoolName}>{SCHOOL_INFO.name}</Text>
            <Text style={styles.establishedYear}>
              স্থাপিতঃ {SCHOOL_INFO.establishedYear} ইং
            </Text>
            <Text style={styles.addressText}>{SCHOOL_INFO.address}</Text>
            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>ইমেইল: {SCHOOL_INFO.email}</Text>
              <Text style={styles.contactText}>
                প্রধান শিক্ষকের মোবাইল: {SCHOOL_INFO.principalMobile}
              </Text>
            </View>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            <Text style={styles.codeText}>
              বিদ্যালয় কোড: {SCHOOL_INFO.schoolCode}
            </Text>
            <Text style={styles.codeText}>EIIN: {SCHOOL_INFO.eiin}</Text>
            <Text style={styles.codeText}>মোবাইল: {SCHOOL_INFO.mobile}</Text>
          </View>
        </View>

        {/* Reference Numbers */}
        <View style={styles.referenceContainer}>
          <View style={styles.referenceText}>
            <Text>স্মারক নং: </Text>
            <View style={styles.underline}></View>
          </View>
          <View style={styles.referenceText}>
            <Text>
              তারিখঃ {new Date(fullNotice.date).toLocaleDateString("bn-BD")}
            </Text>
          </View>
        </View>

        {/* Notice Content */}
        <View style={styles.content}>
          <Text style={styles.contentTitle}>{fullNotice.title}</Text>

          <Text style={styles.contentText}>{convertedContent}</Text>
        </View>
      </Page>
    </Document>
  );
};

const NoticePDFViewer = ({ fullNotice }) => {
  return (
    <div className="mt-4">
      <PDFDownloadLink
        document={<NoticePDF fullNotice={fullNotice} />}
        fileName={`${fullNotice?.title || "notice"}.pdf`}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {({ loading }) =>
          loading ? "জেনারেট হচ্ছে..." : "পিডিএফ ডাউনলোড করুন"
        }
      </PDFDownloadLink>
    </div>
  );
};

export default NoticePDFViewer;
