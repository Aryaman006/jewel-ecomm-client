import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8" style={{marginTop:'50px',minHeight:"100vh"}}>
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Contact Us</h1>
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Email</h2>
            <a href="mailto:aryamansingh@gmail.com" className="text-blue-600 hover:underline"> aryamansingh005@gmail.com </a>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Phone</h2>
            <a href="tel:+91 6289379872" className="text-blue-600 hover:underline">+91 6289379872</a>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Address</h2>
            <p className="text-gray-600"> Titagarh 26 Road Brahmasthan  Kolkata-700119, West Bengal, India</p>
            <a href="https://maps.app.goo.gl/gVgiHaExdop1uR7c8" className="text-blue-600 hover:underline block">View on Map</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
