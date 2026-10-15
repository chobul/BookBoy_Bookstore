import React from 'react';
import Navbar from './Navbar'; // Import Navbar component

const Section = () => {
  return (
    <section>
      <Navbar /> {/* Use Navbar component */}
      <div className="main" id="Home">
        <div className="main_content">
          <div className="main_image">
            <img src="/img/4.PNG" alt="" />
            <img src="/img/2.png" alt="" />
            {/* <img src="./src/img/kagurabachi.PNG" alt="Nike Shoes" /> */}
          </div>

          <div className="main_text">
            <h1>NUMBER 1 IN SALES<br /><span></span></h1>
            <p>
              {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry... */}
            </p>
          </div>
        </div>
        <div className="social_icon">
          <i className="fa-brands fa-facebook-f"></i>
          <i className="fa-brands fa-twitter"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-linkedin-in"></i>
        </div>
      </div>
    </section>
  );
};

export default Section;