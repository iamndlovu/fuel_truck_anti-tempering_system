import React from 'react';
import styles from './DetailsListItem.module.css';

const DetailsListItem = ({ avater, valuePairs = [] }) => {
  return (
    <>
      {valuePairs.length > 0 && avater && (
        <li className={styles.listItem}>
          <img src={avater} className={styles.avater} />
          <div className={styles.details}>
            {valuePairs.map((pair) => (
              <h6 key={`${pair.name}-${pair.value}`}>
                {pair.name}: <span>{pair.value}</span>
              </h6>
            ))}
          </div>
        </li>
      )}
    </>
  );
};

export default DetailsListItem;
