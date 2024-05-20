"use client";
import React, { useState } from "react";
import styles from "../../css/contactPage.module.css";

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
        {/* <img src="/contact-us-bg.jpg" alt={name} className={styles.width100} /> */}
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

  return (
    <>
      <main className={styles.page} style={{ paddingTop: "100px" }}>
        <section className={`${styles.aboutSection} bg-white/80`} id="about">
          <h1>Contact Us</h1>
          <p>
            The Bike Parking app is designed to make it easy for anyone who
            rides a bike or scooter to find a good place to park.
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
    </>
  );
};

export default ContactPage;
