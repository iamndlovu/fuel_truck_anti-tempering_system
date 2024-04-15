import axios from 'axios';
import React, { useEffect, useState } from 'react';
import limitArray from '../../../../limitArray';
import styles from './index.module.css';
import userAvater from '../../../../assets/images/user.png';

const Drivers = () => {
  const [limitedDrivers, setLimitedDrivers] = useState(null);
  useEffect(() => {
    axios
      .get('http://localhost:1999/driver')
      .then((res) => setLimitedDrivers(limitArray(res.data.drivers, 3)))
      .catch((err) =>
        console.error(`Failed to fetc drivers with err:\n${err}`)
      );
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.sectionHeader}>
        <h5>Drivers</h5>
      </div>
      <ul className={styles.content}>
        {limitedDrivers &&
          limitedDrivers.map((driver) => (
            <li key={driver.id} className={styles.listItem}>
              <img src={userAvater} className={styles.avater} />
              <div className={styles.driverDetails}>
                <h6>Driver Name: {driver.name}</h6>
                <h6>Driver ID: {driver.id}</h6>
                <h6>Phone Number: {driver.phone}</h6>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default Drivers;
