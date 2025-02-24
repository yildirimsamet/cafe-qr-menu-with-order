'use client';

import styles from './styles.module.scss';

const Category = ({ category, onClick }) => {
    return (
        <div onClick={onClick} className={styles.category}>
            <div>{category.category_name}</div>
        </div>
    );
};

export default Category;
