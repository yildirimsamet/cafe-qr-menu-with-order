import axios from '@/app/lib/axios';
import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import styles from './styles.module.scss';
import { tr } from 'date-fns/locale';
import { DateRange } from 'react-date-range';
import Select from 'react-select';

const TableOrderCount = () => {
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
        endDate: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
        key: 'selection',
    });
    const [tableOrderCount, setTableOrderCount] = useState([]);
    const [tables, setTables] = useState([]);

    const getTables = async () => {
        try {
            const { data } = await axios.get('/tables');
            setTables(data.data);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        getTables();
    }, []);

    const handleSelect = (ranges) => {
        setSelectionRange(() => ({
            startDate: new Date(ranges.selection.startDate.getTime() + (3 * 60 * 60 * 1000)),
            endDate: new Date(ranges.selection.endDate.getTime() + (3 * 60 * 60 * 1000)),
            key: ranges.selection.key,
        }));
    };
    const getTableOrderCount = async () => {
        try {
            const { data } = await axios
                .get(`/statistics/table-order-count/${new Date(selectionRange.startDate).toISOString().slice(0, 19).replace('T', ' ').split(' ').splice(0, 1).join('') + ' 00:00:00'}/${new Date(selectionRange.endDate).toISOString().slice(0, 19).replace('T', ' ').split(' ').splice(0, 1).join('') + ' 23:59:59'}`);

            const fixedTableOrderCount = data.data.reduce((acc, item) => {
                if (acc[item.date] !== undefined) {
                    acc[item.date].push(item);
                } else {
                    acc[item.date] = [item];
                }

                return acc;
            }, {});

            console.log('fixedTableOrderCount', fixedTableOrderCount);
            setTableOrderCount(fixedTableOrderCount);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        getTableOrderCount();
    }, [selectionRange]);
    return (
        <div className={styles.tableOrderCount}>
            <div className={styles.tableOrderCountChartWrapper}>
                <BarChart
                    colors={[
                        '#7cb342',
                        '#039be5',
                        '#d81b60',
                        '#e53935',
                        '#43a047',
                        '#f4511e',
                        '#fdd835',
                        '#00897b',
                        '#f4511e',
                        '#d81b60',
                        '#c0ca33',
                        '#f4511e',
                        '#00acc1',
                        '#1e88e5',
                        '#5e35b1',
                        '#3949ab',
                        '#fb8c00',
                    ]}
                    xAxis={[
                        {
                            data: Object.keys(tableOrderCount).map(i => new Date(i)),
                            valueFormatter: (value) => (value == null ? 'NaN' : new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value))),
                            label: 'Tarih',
                            scaleType: 'band',
                        },
                    ]}
                    series={
                        tables.map(table => {
                            return ({
                                data: Object.values(tableOrderCount)
                                    .flatMap(i => i)
                                    .filter(i => i.table_slug == table.table_slug)
                                    .map(i => i.order_count),
                                label: table.table_name,
                            });
                        })

                    }

                />
            </div>
            <div className={styles.tableOrderCountDateRangeWrapper}>
                <DateRange
                    maxDate={new Date()}
                    locale={tr}
                    showMonthAndYearPickers={true}
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                />
            </div>
        </div>
    );
};

export default TableOrderCount;