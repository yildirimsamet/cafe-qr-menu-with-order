import { tr } from 'date-fns/locale';
import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import { FaChevronCircleRight, FaChevronCircleLeft } from 'react-icons/fa';
import Select from 'react-select';
import axios from '@/app/lib/axios';
import styles from './styles.module.scss';
import './override.scss';
import 'moment/locale/tr';
import { useWindowSize } from '@/app/hooks/useWindowSize';

const Orders = () => {
    const { isMobile } = useWindowSize();
    const [tables, setTables] = useState([]);
    const [orders, setOrders] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
        endDate: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
        key: 'selection',
    });

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;
        const scrollAmount = isMobile ? 250 : 450;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const getTables = async () => {
        try {
            const { data } = await axios.get('/tables');
            setTables(data.data);
        } catch (error) {
            //
        }
    };

    const handleSelect = (ranges) => {
        setSelectionRange(() => ({
            startDate: new Date(ranges.selection.startDate.getTime() + (3 * 60 * 60 * 1000)),
            endDate: new Date(ranges.selection.endDate.getTime() + (3 * 60 * 60 * 1000)),
            key: ranges.selection.key,
        }));
    };

    const getOrders = async () => {
        try {
            const { data } = await axios.post(`/statistics/orders/${new Date(selectionRange.startDate).toISOString().slice(0, 19).replace('T', ' ').split(' ').splice(0, 1).join('') + ' 00:00:00'}/${new Date(selectionRange.endDate).toISOString().slice(0, 19).replace('T', ' ').split(' ').splice(0, 1).join('') + ' 23:59:59'}`, {
                tableSlug: selectedTable?.table_slug || selectedTable?.value,
            });

            const orders = data.data.reduce((acc, order) => {
                const date = order.done_at.substr(0, 10);
                if (acc[date]) {
                    acc[date].push({
                        done_at: order.done_at,
                        items: order.items,
                    });
                } else {
                    acc[date] = [
                        {
                            done_at: order.done_at,
                            items: order.items,
                        },
                    ];
                }
                return acc;
            }, {});

            setOrders(orders);
            console.log('orders', orders)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTables();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            getOrders();
        }
    }, [selectionRange, selectedTable]);

    return (
        <div
            id='orders'
            className={styles.orders}
        >
            <div className={styles.ordersLeft}>
                {selectedTable ? <div className={styles.ordersLeftTitle}>
                    {selectedTable?.label}
                </div> : <div className={styles.ordersLeftEmpty}>
                    {'Bir masa seçiniz.'}
                </div>}
                <div className="order-grid-container">
                    {!isMobile && <FaChevronCircleLeft
                        className="scroll-button left"
                        onClick={() => scroll('left')}
                    />}
                    <div
                        className="order-grid-scroll"
                        ref={scrollRef}
                    >
                        {Object.entries(orders || {}).map(([date, orders]) => (
                            <div
                                key={date}
                                className="order-grid-date-card"
                            >
                                <h2 className="order-grid-date-title">{date} <span>(Siparişler: {orders.length})</span></h2>
                                <div className='order-end-of-day-total'>
                                    Total: {(orders
                                        .reduce((acc, order) => acc + order.items
                                            .reduce((acc2, item) => acc2 + item.item_price * item.item_quantity, 0), 0))
                                        .toFixed(2)}₺
                                </div>
                                <div className="order-grid-order-list">
                                    {orders.map((order, idx) => (
                                        <div
                                            key={idx}
                                            className="order-grid-order-card"
                                        >
                                            <div className="order-grid-order-time">
                                                {moment(order.done_at).subtract(3, 'hours').locale('tr').format('HH:mm:ss')}
                                            </div>
                                            <ul className="order-grid-item-list">
                                                {order.items.map((item, i) => (
                                                    <li
                                                        key={i}
                                                        className="order-grid-item"
                                                    >
                                                        <span>{item.item_name} ({item.item_quantity}x)</span>
                                                        <span className="order-grid-item-size">{item.item_size}</span>
                                                        <span className="order-grid-item-price">
                                                            {(item.item_price * item.item_quantity).toFixed(2)}₺
                                                        </span>
                                                    </li>
                                                ))}
                                                <div className="order-grid-item-total">
                                                    Total: {(order.items
                                                        .reduce((acc, item) =>
                                                            acc + item.item_price * item.item_quantity, 0))
                                                        .toFixed(2)}₺
                                                </div>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {!isMobile && <FaChevronCircleRight
                        className="scroll-button right"
                        onClick={() => scroll('right')}
                    />}
                </div>
            </div>
            <div className={styles.ordersRight}>
                <DateRange
                    className={styles.ordersRightDateRange}
                    maxDate={new Date()}
                    locale={tr}
                    showMonthAndYearPickers={true}
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                />
                <Select
                    className={styles.ordersRightSelect}
                    options={tables.map(i => ({ value: i.table_slug, label: i.table_name }))}
                    onChange={(selectedOption) => setSelectedTable(selectedOption)}
                    placeholder="Masa Seçiniz"
                    value={selectedTable}
                    isSearchable
                />
            </div>
        </div>
    );
};

export default Orders;