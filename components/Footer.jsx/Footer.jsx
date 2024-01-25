const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div>
        <p>
          &copy; <time dateTime={currentYear}>{currentYear}</time> BitCoinverter. All rights
          reserved.
        </p>
      </div>
      <address>
        <p>Contact: stoyan1020@gmail.com</p>
      </address>
    </footer>
  );
};

export default Footer;
