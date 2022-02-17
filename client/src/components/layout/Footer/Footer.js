import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./footer.css";
const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>EQUILIBRIUM</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; Eichiro Oda</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/goyal._13">
          <i className="fa fa-instagram fa-2x"></i>
        </a>
        <a href="http://youtube.com/">
          <i className="fa fa-youtube fa-2x"></i>
        </a>
        <a href="https://www.linkedin.com/in/himanshu-goyal-581881214/">
          <i className="fa fa-linkedin fa-2x"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
