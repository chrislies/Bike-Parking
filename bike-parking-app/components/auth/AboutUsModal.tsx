import React from 'react';
import Link from 'next/link';
import styles from './AboutUs.module.css'; // Make sure this is the correct path to your CSS module
import { Toaster } from "react-hot-toast";

const AboutUs: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" />
      {/* Header section with navigation */}
      <header className="fixed inset-x-0 top-0 z-10 flex justify-between items-center p-6 bg-transparent">
        <h2 className="text-xl font-bold text-white">BikOU</h2>
        <div className="flex items-center space-x-4">
          <Link href="/about-us">
            <button className="py-2 px-4 rounded-md text-white bg-green-500 hover:bg-green-700 font-semibold">
              About Us
            </button>
          </Link>
          <Link href="/login">
            <button className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-700 font-semibold">
              Login
            </button>
          </Link>
        </div>
      </header>
      {/* Main content area */}
      <main className={styles.page} style={{ paddingTop: '100px' }}>
        <section className={styles.aboutSection}>
          <h1>About Us Page</h1>
          <p>Some text about who we are and what we do.</p>
          <p>Resize the browser window to see that this page is responsive by the way.</p>
        </section>

        <div className={styles.row}>
          {/* Iterating over team members */}
          {['Jane', 'John', 'Eric', 'Ana'].map((name, index) => (
            <div className={styles.column} key={index}>
              <div className={styles.card}>
                <img src="/image.jpg" alt={name} className={styles.width100}/>
                <div className={styles.container}>
                  <h2>{name}</h2>
                  <p className={styles.title}>CEO & Founder</p>
                  <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                  <p>{`${name.toLowerCase()}@example.com`}</p>
                  <Link href={`/contact-${name.toLowerCase()}`}>
                    <button className={styles.button}>Contact</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default AboutUs;