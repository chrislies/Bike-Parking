"use client";
import React, { useState } from "react";
import { Mail, Spinner } from "@/components/svgs";
import styles from "../../css/contactPage.module.css";
import "../../css/contactPage.css";

interface TeamMemberProps {
  name: string;
  title: string;
  description: string;
  email: string;
  bio: string;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({
  name,
  title,
  description,
  email,
  bio,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const mailToLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&tf=1`;

  return (
    <div className={styles.column} onClick={() => setIsOpen(!isOpen)}>
      <div className={styles.card}>
        <div className={styles.container}>
          <h2>{name}</h2>
          <p className={styles.title}>{title}</p>
          <p>{description}</p>
          {isOpen && <p className={styles.bio}>{bio}</p>}
          <a href={mailToLink} target="_blank" rel="noopener noreferrer">
            <button className={styles.button}>Contact</button>
          </a>
        </div>
      </div>
    </div>
  );
};

const ContactPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Eric Ma",
      title: "Frontend Developer",
      description: "Specializes in React and CSS.",
      email: "ericma25.em@gmail.com",
      bio: "Eric has over 10 years of experience in front-end technologies including React, Angular, and Vue.js. He is passionate about building accessible, user-friendly web applications.",
    },
    {
      name: "Jiaxin Lin",
      title: "Backend Developer",
      description: "Expert in Node.js and databases.",
      email: "jiaxinlin200204@gmail.com",
      bio: "Jiaxin is a backend specialist with extensive experience in server-side languages and database management. He ensures our data systems are efficient and secure.",
    },
    {
      name: "Christopher Lai",
      title: "Full Stack Developer",
      description: "Focuses on user experience and design.",
      email: "clai20707@gmail.com",
      bio: "Christopher is our lead UI/UX designer. With a keen eye for design and user experience, he ensures all interfaces are intuitive and engaging.",
    },
    {
      name: "Xuanrong Hong",
      title: "Backend Developer",
      description: "Guarantees product quality and reliability.",
      email: "hxr3136754148@gmail.com",
      bio: "Xuanrong oversees our quality assurance processes, implementing rigorous testing methods to ensure our application meets high standards.",
    },
  ];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    nameError: "",
    emailError: "",
    messageError: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Set loading to true during submission

    try {
      const res = await fetch("api/contact", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const { msg, success } = await res.json();
      // console.log("Server response:", { msg, success }); // Log the server response

      if (success) {
        // console.log("Form submitted successfully"); // Log successful form submission
        setName("");
        setEmail("");
        setMessage("");
        setErrors({
          nameError: "",
          emailError: "",
          messageError: "",
        });
        setSuccess(true);
      } else {
        // console.log("Form submission failed", msg); // Log failed form submission and error messages
        // Map error messages to input fields
        const errorMap: Record<string, string | string[]> = {};
        msg.forEach((err: string | string[]) => {
          if (err.includes("Name")) {
            errorMap.nameError = err;
            const nameElement = document.querySelector(".name");
            if (nameElement) {
              nameElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }
          } else if (err.includes("valid name")) {
            errorMap.nameError = err;
            const nameElement = document.querySelector(".name");
            if (nameElement) {
              nameElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }
          } else if (err.includes("Email")) {
            errorMap.emailError = err;
            const emailElement = document.querySelector(".email");
            if (emailElement) {
              emailElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }
          } else if (err.includes("Phone")) {
            errorMap.phoneError = err;
          } else if (err.includes("Message")) {
            errorMap.messageError = err;
          } else {
            errorMap.emailError = err;
            const emailElement = document.querySelector(".email");
            if (emailElement) {
              emailElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }
          }
        });
        // console.log("New errors:", { ...errors, ...errorMap }); // Log the new errors

        setErrors((prevErrors) => ({
          ...prevErrors, // Preserve existing values
          ...errorMap, // Update with new values
        }));
        setSuccess(false);
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <>
      {/* <main className={styles.page} style={{ paddingTop: "100px" }}>
        <section className={`${styles.aboutSection}`} id="about">
          <h1>Contact Us</h1>
          <p>
            The Bike Parking app is designed to make it easy for anyone who
            rides a bike or scooter to find a <em>good</em> place to park.
          </p>
        </section>
        <section id="team">
          <div className={styles.row}>
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </section> 
      </main>
        */}
      <section className="w-[40%] max-md:w-[60%] max-sm:w-full rounded-xl bg-white mt-12">
        <form
          onSubmit={handleSubmit}
          className="pt-10 pb-10 flex flex-col items-center gap-5 2xl:px-[200pxd] max-2xl:px-[200pxd] max-xl:px-[100pxd] max-lg:px-8"
        >
          <div className="name">
            <label htmlFor="name">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              onChange={(event) => {
                setName(event.target.value);
                // Clear the error when the user starts typing
                setErrors((prevErrors) => ({ ...prevErrors, nameError: "" }));
              }}
              value={name}
              type="text"
              id="name"
              placeholder=""
              className={`${
                errors.nameError ? "border-red-500" : "border-slate-300"
              }`}
            />
            <span id="nameError" className="text-red-600">
              {errors.nameError}
            </span>
          </div>
          <div className="email">
            <label htmlFor="email">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              onChange={(event) => {
                setEmail(event.target.value);
                // Clear the error when the user starts typing
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  emailError: "",
                }));
              }}
              value={email}
              type="text"
              id="email"
              placeholder=""
              className={`${
                errors.emailError ? "border-red-500" : "border-slate-300"
              }`}
            />
            <span id="emailError" className="text-red-600">
              {errors.emailError}
            </span>
          </div>
          <div className="message">
            <label htmlFor="message">
              Message<span className="text-red-500">*</span>
            </label>
            <textarea
              onChange={(event) => {
                setMessage(event.target.value);
                // Clear the error when the user starts typing
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  messageError: "",
                }));
              }}
              value={message}
              style={{ minHeight: "128px", resize: "vertical" }}
              id="message"
              placeholder=""
              className={`${
                errors.messageError ? "border-red-500" : "border-slate-300"
              }`}
            ></textarea>
            <span id="messageError" className="text-red-600">
              {errors.messageError}
            </span>
          </div>
          <div>
            <button
              className="bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded p-3 w-[150pxd] text-white font-bold"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex flex-row justify-center">
                  <Spinner className="animate-spin h-6 mr-3"></Spinner>
                  Sending...
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
          <div className="2xl:h-5 max-2xl:h-5 max-sm:h-[30px]">
            {success && (
              <div
                className={`bg-slate-100 text-green-800 text-lg px-5 py-2`}
                key="success"
              >
                Message sent successfully.
              </div>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default ContactPage;
