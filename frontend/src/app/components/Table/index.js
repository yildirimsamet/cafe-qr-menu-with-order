import ListAltIcon from '@mui/icons-material/ListAlt';
import PrintIcon from '@mui/icons-material/Print';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import cn from 'classnames';
import moment from 'moment';
import Link from 'next/link';
import QrCode from 'qrcode';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from '@/app/hooks/useAuth';
import useNotification from '@/app/hooks/useNotification';
import axios from '@/app/lib/axios';
import { formatPrice } from '@/app/utils';
import styles from './styles.module.scss';
import 'moment/locale/tr';

const MySwal = withReactContent(Swal);

const Table = ({ table, mutate }) => {
    const { socket, notificationCallback } = useNotification();
    const { user } = useAuth();
    const [isLastOrdersListOpen, setIsLastOrdersListOpen] = useState(false);
    const [lastOrders, setLastOrders] = useState([]);
    const isTableEmpty = table.items.length === 0;

    const getLastOrdersToday = async () => {
        try {
            const { data } = await axios.get(`/orders/last/${table.table_slug}`);

            return data;
        } catch (error) {
            return [];
        }
    };

    const handleOpenLastOrdersList = async () => {
        const result = await getLastOrdersToday();

        if (result.status !== 200) {
            return Swal.fire({
                icon: 'error',
                title: 'Bir hata oluştu.',
                text: result.message,
            });
        }

        setIsLastOrdersListOpen(true);
        setLastOrders(result.data);
    };

    const generateQRCode = (table_name, table_slug) => {
        MySwal.fire({
            title: `${table_name} için QR Kodu`,
            html: '<canvas id="qr-canvas"></canvas>',
            showCancelButton: true,
            cancelButtonText: 'Kapat',
            confirmButtonText: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Yazdır <PrintIcon />
                </div>
            ),
            confirmButtonColor: '#3085d6',
            didOpen: () => {
                QrCode.toCanvas(
                    document.getElementById('qr-canvas'),
                    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/table/${table_slug}`,
                    (error) => {
                        if (error) {
                            console.error(error);
                        }
                    },
                );
            },
            preConfirm: () => {
                function printCanvas () {
                    const canvas = document.getElementById('qr-canvas');
                    const imgData = canvas.toDataURL('image/png');

                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>Yazdır</title>
                                <style>
                                    @media print {
                                        body { text-align: center; }
                                        img { width: 50mm; height: auto; }
                                    }
                                </style>
                            </head>
                            <body>
                                <img src="${imgData}"/>
                                <script>
                                    window.onload = function() { window.print(); window.close(); }
                                <\/script>
                            </body>
                        </html>
                    `);
                    printWindow.document.close();
                }

                printCanvas();
                return false;
            },
        });
    };

    const openDeleteTableModal = (table_slug, order_id) => {
        if (order_id) {
            return Swal.fire({
                title: 'Masa Silinemiyor.',
                text: 'Masa dolu oldugundan silinemez.',
                icon: 'warning',
                showConfirmButton: true,
            });
        }

        Swal.fire({
            title: 'Masa Sil',
            text: 'Masa silmek istediginizden emin misiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır',
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Dikkat!',
                    html: '<div style="font-weight: bold; margin-bottom: 10px">Bu işlem masayı siler.</div> Yine de devam etmek istiyor musunuz?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Evet',
                    cancelButtonText: 'Hayır',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await axios
                            .delete(`/tables/${table_slug}`)
                            .then((res) => {
                                if (res.status === 200) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Masa Silindi',
                                        showConfirmButton: false,
                                    });
                                    mutate();
                                    return;
                                }

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Bir hata oluştu.',
                                    text: 'Masa silinirken bir hata olştu.',
                                });
                            })
                            .catch((err) => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Bir hata oluştu.',
                                    text: 'Masa silinirken bir hata olştu.',
                                });
                            });
                    }
                });
            }
        });
    };
    const closeOrder = async (id) => {
        try {
            await axios.put(`/orders/${id}/done`);
            notificationCallback(() => {
                socket.emit('order', 'update');
            });
        } catch (error) {
            //
        }
    };

    const openCloseOrderModal = (id) => {
        Swal.fire({
            title: 'Siparişi Sonlandır',
            text: 'Siparişi sonlandırmak istediginizden emin misiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await closeOrder(id);
                mutate();
            }
        });
    };
    return (
        <div className={styles.table}>
            <div className={styles.tableHeader}>
                <h2 className={styles.tableHeaderTitle}>{table.table_name}
                    <ListAltIcon
                        onClick={() => {
                            handleOpenLastOrdersList();
                        }}
                        className={styles.tableHeaderTitleListIcon}
                    />
                </h2>
                <div
                    className={cn(
                        styles.tableHeaderStatus,
                        isTableEmpty
                            ? styles.tableHeaderStatusEmpty
                            : styles.tableHeaderStatusActive,
                    )}
                >
                    {isTableEmpty ? 'Boş' : 'Dolu'}
                </div>
            </div>
            <div
                className={cn(styles.tableOrders, {
                    'display-none': isTableEmpty,
                })}
            >
                <div className={styles.tableOrdersTitles}>
                    <div className={styles.tableOrdersTitle}>Ürün</div>
                    <div className={styles.tableOrdersTitle}>Boyut</div>
                    <div className={styles.tableOrdersTitle}>Adet</div>
                    <div className={styles.tableOrdersTitle}>Fiyat</div>
                </div>
                {table.items.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={styles.tableOrdersItem}
                        >
                            <div className={styles.tableOrdersItemName}>
                                {item.item_name}
                            </div>
                            <div className={styles.tableOrdersItemSize}>
                                {item.item_size}
                            </div>
                            <div className={styles.tableOrdersItemQuantity}>
                                {item.item_quantity} ad.
                            </div>
                            <div className={styles.tableOrdersItemPrice}>
                                {formatPrice(item.item_price)}₺
                            </div>
                        </div>
                    );
                })}
            </div>
            <div
                className={cn(styles.tableOrdersEmpty, {
                    'display-none': !isTableEmpty,
                })}
            >
                Masa Boş
            </div>
            <div
                className={cn(styles.tableTotal, {
                    'display-none': isTableEmpty,
                })}
            >
                <span>Toplam:</span>
                <span>
                    {(
                        formatPrice(Math.ceil(table.items.reduce(
                            (total, item) => total + Number(item.item_price) * item.item_quantity,
                            0,
                        ) * 100) / 100)
                    )}
                    ₺
                </span>
            </div>
            <div className={styles.tableButtons}>
                <button
                    onClick={() => openCloseOrderModal(table.order_id)}
                    className={cn(styles.tableButtonsFinish, {
                        'display-none': isTableEmpty,
                    })}
                >
                    Siparişi Sonlandır
                </button>
                <Link
                    target="_blank"
                    href={`/table/${table.table_slug}`}
                    className={styles.tableButtonsOrder}
                >Masaya Sipariş Ver</Link>

            </div>
            <div className={styles.tableFooter}>
                <button
                    className={styles.tableFooterQr}
                    onClick={() =>
                        generateQRCode(table.table_name, table.table_slug)
                    }
                >
                    QR Kod
                </button>
                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                    <div className={styles.tableFooterDelete}>
                        <button
                            className={styles.tableFooterDeleteButton}
                            onClick={() => {
                                openDeleteTableModal(table.table_slug, table.order_id);
                            }}
                        >
                            Masayı Sil
                        </button>
                    </div>
                )}
            </div>
            {
                isLastOrdersListOpen && (
                    <Dialog
                        open={isLastOrdersListOpen}
                        onClose={() => setIsLastOrdersListOpen(false)}
                        fullWidth
                        slotProps={{ backdrop: { invisible: true } }}
                        closeAfterTransition={true}
                    >
                        <DialogTitle>Son Siparişler <span className={styles.lastOrdersPopupTitleTime}>{'(son 18 saat)'}</span></DialogTitle>
                        <DialogContent>
                            {lastOrders.length > 0 ? (
                                lastOrders.map((order, index) => (
                                    <div
                                        key={index}
                                        className={styles.lastOrder}
                                    >
                                        <div className={styles.lastOrderDate}>
                                            {moment(order.done_at).subtract(3, 'hours').locale('tr').format('HH:mm:ss DD.MM.YYYY')}
                                        </div>
                                        <div className={styles.lastOrderItems}>
                                            {
                                                order.items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className={styles.lastOrderItemsItem}
                                                    >
                                                        <div className={styles.lastOrderItemsItemName}>
                                                            {item.item_name}
                                                        </div>
                                                        <div className={styles.lastOrderItemsItemSize}>
                                                            {item.item_size}
                                                        </div>
                                                        <div className={styles.lastOrderItemsItemQuantity}>
                                                            {item.item_quantity}
                                                        </div>
                                                        <div className={styles.lastOrderItemsItemPrice}>
                                                            {formatPrice(item.item_price)}₺
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.lastOrdersEmpty}>Son 18 saat içinde sipariş bulunamadı.</div>
                            )}
                            <div>
                                {

                                }
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            }
        </div>
    );
};

export default Table;