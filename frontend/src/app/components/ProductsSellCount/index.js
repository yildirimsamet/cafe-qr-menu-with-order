import { BarChart } from '@mui/x-charts/BarChart';
import { tr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import Select from 'react-select';
import axios from '@/app/lib/axios';
import styles from './styles.module.scss';

const ProductsSellCount = () => {
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
        endDate: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
        key: 'selection',
    });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [menu, setMenu] = useState([]);
    const [productsSellCount, setProductsSellCount] = useState([]);

    const handleProductChange = (selectedProducts) => {
        setSelectedProducts(selectedProducts);
    };

    useEffect(() => {
        getProductsSellCount();
    }, [selectedProducts, selectionRange]);

    const getMenus = async () => {
        try {
            const { data } = await axios.get('/menu');
            setMenu(data.data);
            console.log(data.data);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        getMenus();
    }, []);

    const handleSelect = (ranges) => {
        setSelectionRange(() => ({
            startDate: new Date(ranges.selection.startDate.getTime() + (3 * 60 * 60 * 1000)),
            endDate: new Date(ranges.selection.endDate.getTime() + (3 * 60 * 60 * 1000)),
            key: ranges.selection.key,
        }));
    };

    const getAllProductsWithSizes = (menu = []) => {
        return menu.reduce((acc, category) => {
            category.items.map((item) => {
                item.sizes.map((size) => {
                    acc.push({
                        value: `${item.item_id}-${size.size_id}`,
                        label: `${item.item_name} (${size.size_name})`,
                    });
                });
            });
            return acc;
        }, []);
    };

    const getProductsSellCount = async () => {
        try {
            const { data } = await axios
                .post(`/statistics/products-sell-count/${new Date(selectionRange.startDate).toISOString().slice(0, 19).replace('T', ' ').split(' ').splice(0, 1).join('') + ' 00:00:00'}/${new Date(selectionRange.endDate).toISOString().slice(0, 19).replace('T', ' ').split(' ').splice(0, 1).join('') + ' 23:59:59'}`, {
                    products: selectedProducts.map(i => {
                        const [productId, sizeId] = i.value.split('-');
                        return { productId, sizeId };
                    }),
                });

            const fixedProductsSellCount = data.data.reduce((acc, item) => {
                if (acc[item.date] !== undefined) {
                    acc[item.date].push(item);
                } else {
                    acc[item.date] = [item];
                }

                return acc;
            }, {});

            setProductsSellCount(fixedProductsSellCount);
        } catch (error) {
            //
        }
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.productsSellCount}>
                <div className={styles.productsSellCountLeft}>
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
                        className={styles.productsSellCountLeftChart}
                        xAxis={[
                            {
                                data: Object.keys(productsSellCount).map(i => new Date(i)),
                                valueFormatter: (value) => (value == null ? 'NaN' : new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value))),
                                label: 'Tarih',
                                scaleType: 'band',
                            },
                        ]}
                        series={
                            selectedProducts.map(i => {
                                const [productId, sizeId] = i.value.split('-');
                                return ({
                                    data: Object.values(productsSellCount).flatMap(i => i).filter(i => i.productId == productId && i.sizeId == sizeId).map(i => i.total_quantity),
                                    label: i.label,
                                });
                            })
                        }

                    />
                </div>
                <div className={styles.productsSellCountRight}>
                    <DateRange
                        className={styles.productsSellCountRightDateRange}
                        maxDate={new Date()}
                        locale={tr}
                        showMonthAndYearPickers={true}
                        ranges={[selectionRange]}
                        onChange={handleSelect}
                    />
                </div>
            </div>
            <Select
                className={styles.wrapperSelect}
                closeMenuOnSelect={false}
                isMulti
                isClearable
                isSearchable
                name="Ürünler"
                placeholder="Ürünler (En az bir ürün seçiniz)"
                options={getAllProductsWithSizes(menu)}
                onChange={handleProductChange}
                close
            />
        </div>
    );
};

export default ProductsSellCount;