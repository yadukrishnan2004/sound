import React, { useContext, useState } from "react";
import { ApiContext } from "../context/ApiContext";
import axios from "axios";
import Navbar from "../Parts/Navbar";
import Footer from "../Parts/footer";

function Contact() {
  const { user,setRefresh } = useContext(ApiContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Thanks for reaching out, ${user.name}! We'll get back to you soon.`);

    try {
      const res = await user.contact;
      console.log(res);

      const updatedcontact = [...res, formData];

      await axios.patch(`http://localhost:5001/user/${user.id}`, {
        contact: updatedcontact,
      });

      setRefresh(prev=>!prev)
      console.log("Contact saved successfully");
    } catch (err) {
      console.error("Error saving contact:", err);
    }
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <Navbar color={"white"} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md shadow-xl rounded-xl p-8 md:p-12 border border-white/20">
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            Contact <span className="text-green-400">Us</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>

            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-4 text-gray-300">
              <p>
                Have questions? We'd love to hear from you! Reach out to us
                through the form or directly using the details below:
              </p>
              <p className="font-semibold text-white">📍 Location:</p>
              <p>123 Jersey Street, Football City, India</p>
              <p className="font-semibold text-white">📞 Phone:</p>
              <p>+91 98765 43210</p>
              <p className="font-semibold text-white">✉ Email:</p>
              <p>support@vestra.com</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Contact;
