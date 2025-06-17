import { useState } from 'react';
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer

const Layout = ({ children }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <>
      <Header 
        dropdownVisible={dropdownVisible} 
        toggleDropdown={toggleDropdown} 
      />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
