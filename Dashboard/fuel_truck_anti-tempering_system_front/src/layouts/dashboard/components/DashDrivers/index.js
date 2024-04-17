import axios from 'axios';
import React, { useEffect, useState } from 'react';
import limitArray from '../../../../limitArray';
import styles from './index.module.css';
import userAvater from '../../../../assets/images/user.png';
import DetailsListItem from '../DetailsListItem';

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
            <DetailsListItem
              key={driver.id}
              avater={userAvater}
              valuePairs={[
                { name: 'Driver Name', value: driver.name },
                { name: 'Driver ID', value: driver.id },
                { name: 'Phone Number', value: driver.phone },
              ]}
            />
          ))}
      </ul>
      <button
        style={{
          border: 'none',
          cursor: 'pointer',
          marginLeft: '.5rem',
        }}
      >
        <a
          href='/drivers'
          style={{
            color: '#1A73E8',
            fontWeight: '700',
            textTransform: 'uppercase',
          }}
        >
          More drivers
        </a>
      </button>
    </section>
  );
};

export default Drivers;
