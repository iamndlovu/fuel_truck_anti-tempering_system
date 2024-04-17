import axios from 'axios';
import React, { useEffect, useState } from 'react';
import limitArray from '../../../../limitArray';
import styles from './index.module.css';
import truckImg from '../../../../assets/images/truck.jpg';
import DetailsListItem from '../DetailsListItem';

const Trucks = () => {
  const [limitedTrucks, setLimitedTrucks] = useState(null);
  useEffect(() => {
    axios
      .get('http://localhost:1999/truck')
      .then((res) => setLimitedTrucks(limitArray(res.data.trucks, 3)))
      .catch((err) =>
        console.error(`Failed to fetc drivers with err:\n${err}`)
      );
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.sectionHeader}>
        <h5>Trucks</h5>
      </div>
      <ul className={styles.content}>
        {limitedTrucks &&
          limitedTrucks.map((truck) => (
            <DetailsListItem
              key={truck.id}
              avater={truckImg}
              valuePairs={[
                { name: 'Truck Make', value: truck.make },
                { name: 'Plate Number', value: truck.id },
                {
                  name: 'Truck Driver',
                  value: truck.driver ? truck.driver : 'Not Assigned',
                },
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
          href='/trucks'
          style={{
            color: '#1A73E8',
            fontWeight: '700',
            textTransform: 'uppercase',
          }}
        >
          More trucks
        </a>
      </button>
    </section>
  );
};

export default Trucks;
