import styles from './styles.module.scss';
// import { LineChart } from '@mui/x-charts/LineChart';

const Statistics = () => {
    return (
        <div className={styles.statistics}>
            <h1 className={styles.statisticsTitle}>İstatistikler</h1>
            <div className='container'>
                {/* <LineChart
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[
                        {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                        },
                    ]}
                    width={500}
                    height={300}
                /> */}
            </div>
        </div>
    );
};

export default Statistics;