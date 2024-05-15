import React from 'react';
import Link from 'next/link';
import styles from './AdminModal.module.css'; // Ensure the path is correct

const AdminModal: React.FC = () => {
  return (
    <div className={styles.modalContainer}>
      <h1 className={styles.modalTitle}>Admin Dashboard</h1>
      <ul className={styles.actionList}>
        {/* Link to the Dashboard page within your app */}
        <li>
          <Link href="/admin/dashboard" className={styles.actionLink}>
            View Dashboard
          </Link>
        </li>
        {/* Link to the Home/Login page */}
        <li>
          <Link href="/login" className={styles.actionLink}>
            Log Out
          </Link>
        </li>
        {/* Link to the Settings page within the Admin section */}
        <li>
          <Link href="/admin/settings" className={styles.actionLink}>
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminModal;