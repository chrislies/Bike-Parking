import React from 'react';
import Link from 'next/link';
import styles from './AboutUs.module.css'; // Make sure this is the correct path to your CSS module

const AboutUs: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.aboutSection}>
        <h1>About Us Page</h1>
        <p>Some text about who we are and what we do.</p>
        <p>Resize the browser window to see that this page is responsive by the way.</p>
      </div>

      <h2 className={styles.centerText}>Our Team</h2>
      <div className={styles.row}>
        {/* Team Member Jane */}
        <div className={styles.column}>
          <div className={styles.card}>
            <img src="/image.jpg" alt="Jane" className={styles.width100}/>
            <div className={styles.container}>
              <h2>Eric Ma</h2>
              <p className={styles.title}>CEO & Founder</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>ericma25em@example.com</p>
              <Link href="/contact-jane">
                <button className={styles.button}>Contact</button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className={styles.column}>
          <div className={styles.card}>
            <img src="/image.jpg" alt="Jane" className={styles.width100}/>
            <div className={styles.container}>
              <h2>Eric Ma</h2>
              <p className={styles.title}>CEO & Founder</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>ericma25em@example.com</p>
              <Link href="/contact-jane">
                <button className={styles.button}>Contact</button>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.card}>
            <img src="/image.jpg" alt="Jane" className={styles.width100}/>
            <div className={styles.container}>
              <h2>Eric Ma</h2>
              <p className={styles.title}>CEO & Founder</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>ericma25em@example.com</p>
              <Link href="/contact-jane">
                <button className={styles.button}>Contact</button>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.card}>
            <img src="/image.jpg" alt="Jane" className={styles.width100}/>
            <div className={styles.container}>
              <h2>Eric Ma</h2>
              <p className={styles.title}>CEO & Founder</p>
              <p>Some text that describes me lorem ipsum ipsum lorem.</p>
              <p>ericma25em@example.com</p>
              <Link href="/contact-jane">
                <button className={styles.button}>Contact</button>
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AboutUs;