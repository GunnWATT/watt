import React from 'react';
import styles from '../../../../temp/Ad.module.css';

const Ad = (props) => (
    <a href="http://gpac.tk" className={styles.ad} target="_blank" rel="noopener noreferrer">
        <span className={styles.adBadge}>Compelling utility</span>
        Martin's GPA Calculation Website
    </a>
)

export default Ad;