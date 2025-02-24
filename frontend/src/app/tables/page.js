'use client';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PrintIcon from '@mui/icons-material/Print';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import cn from 'classnames';
import QrCode from 'qrcode';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from '@/app/lib/axios';
import { socket } from '@/app/lib/socket';
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './styles.module.scss';

const MySwal = withReactContent(Swal);

const Tables = () => {
    const { user } = useAuth();
    useAuthorization({ authorization: 'waiter' });
    const [tables, setTables] = useState([]);
    const { isMobile } = useWindowSize();

    const getTables = async () => {
        const { data } = await axios.get('/tables');

        setTables(data.data);
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

    const openAddTableModal = () => {
        Swal.fire({
            title: 'Yeni Masa Ekle',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Ekle',
            showLoaderOnConfirm: true,
            didOpen: () => {
                const input = Swal.getPopup().querySelector('#swal2-input');
                input.value = `Masa ${tables.length + 1}`;
                input.focus();
            },
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#swal2-input').value;
                try {
                    return axios.post('/tables', { name }).then((res) => {
                        getTables();
                        return;
                    }).catch((error) => {
                        Swal.showValidationMessage('Masa Eklenemedi!');
                        return;
                    });
                } catch (error) {
                    //
                }
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
                                    getTables();
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

    useEffect(() => {
        getTables();

        if (!socket.connected) {
            socket.connect();
        }

        if (!socket.hasListeners('orders')) {
            socket.on('orders', (data) => {
                getTables();
            });
        }

        return () => {
            if (socket.connected) {
                socket.off('orders');
                socket.disconnect();
            }
        };
    }, []);

    const closeOrder = async (id) => {
        try {
            await axios.put(`/orders/${id}/done`);
            socket.emit('order', 'update');
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
                getTables();
            }
        });
    };

    const openAllQrModal = () => {
        MySwal.fire({
            title: 'Tüm QR Kodlar',
            html: `
                <div class="${styles.allQrModal}">
                    ${tables
        .map((table, index) => {
            return `<canvas id="qr-canvas-${index}"></canvas>`;
        })
        .join('')}
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Kapat',
            confirmButtonText: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Yazdır <PrintIcon />
                </div>
            ),
            confirmButtonColor: '#3085d6',
            customClass: {
                popup: styles.swalAllQrModalPopup,
                htmlContainer: styles.swalAllQrModalHTMLContainer,
            },
            didOpen: () => {
                tables.forEach((table, index) => {
                    const canvas = document.getElementById(`qr-canvas-${index}`);
                    const ctx = canvas.getContext('2d');
                    const qrSize = 150;
                    const textHeight = 20;

                    // Canvas boyutunu ayarla
                    canvas.width = qrSize;
                    canvas.height = qrSize + textHeight;

                    // Masa adını çiz
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'black';
                    ctx.fillText(table.table_name, qrSize / 2, 15);

                    // QR Kodunu oluştur ve canvas'a çiz
                    QrCode.toCanvas(
                        document.createElement('canvas'),
                        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/table/${table.table_slug}`,
                        (error, qrCanvas) => {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            ctx.drawImage(qrCanvas, 0, textHeight, qrSize, qrSize);
                        },
                    );
                });
            },
            preConfirm: () => {
                function printAllQrCodes () {
                    const qrCanvases = tables.map((_, index) => document.getElementById(`qr-canvas-${index}`));
                    const qrSize = 150;
                    const margin = 10;
                    const cols = 2;
                    const rows = 3;
                    const pageWidth = cols * (qrSize + margin);
                    const pageHeight = rows * (qrSize + margin);

                    let pageIndex = 0;
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    canvas.width = pageWidth;
                    canvas.height = pageHeight;

                    const printWindow = window.open('', '_blank');
                    printWindow.document.write('<html><head><title>Yazdır</title></head><body>');

                    qrCanvases.forEach((qrCanvas, index) => {
                        const x = (index % cols) * (qrSize + margin);
                        const y = (Math.floor(index / cols) % rows) * (qrSize + margin);

                        if (Math.floor(index / (cols * rows)) > pageIndex) {
                            const imgData = canvas.toDataURL('image/png');
                            printWindow.document.write(`
                                <img src="${imgData}" style="display: block; margin-bottom: 20px; width: 100%;"/>`);
                            pageIndex++;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        }

                        if (x === 0 && y === 0 && index !== 0) {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        }

                        ctx.drawImage(qrCanvas, x, y, qrSize, qrSize);
                    });

                    // Son canvas'ı ekleyin
                    const lastImgData = canvas.toDataURL('image/png');
                    printWindow.document.write(`
                        <img src="${lastImgData}" style="display: block; margin-bottom: 20px; width: 100%;"/>`);

                    printWindow.document.write(`
                        <script>
                            window.onload = function() { window.print(); window.close(); }
                        <\/script>
                    </body></html>`);
                    printWindow.document.close();
                }

                printAllQrCodes();
                return false;
            },
        });
    };

    return (
        <div>
            <div className={styles.tablesTopButtons}>
                {!isMobile && (
                    <button className={styles.tablesTopButtonsQR} onClick={openAllQrModal}>
                        Tüm QR Kodlar <QrCode2Icon />
                    </button>
                )}
                {user?.role === 'admin' && (
                    <button
                        className={styles.tablesTopButtonsAdd}
                        onClick={openAddTableModal}
                    >
                        Masa Oluştur
                        <AddCircleIcon />
                    </button>
                )}
            </div>
            <div className={styles.tablesWrapper}>
                {tables.map((table, index) => {
                    const isTableEmpty = table.items.length <= 0;
                    return (
                        <div key={index} className={styles.table}>
                            <h2 className={styles.tableTitle}>{table.table_name}</h2>
                            <div
                                className={cn(
                                    styles.tableStatus,
                                    isTableEmpty
                                        ? styles.tableStatusEmpty
                                        : styles.tableStatusActive,
                                )}
                            >
                                {isTableEmpty ? 'Boş' : 'Dolu'}
                            </div>
                            <div
                                className={cn(styles.tableOrders, {
                                    'display-none': isTableEmpty,
                                })}
                            >
                                <div className={styles.tableOrdersTitles}>
                                    <div className={styles.tableOrdersTitle}>Urun</div>
                                    <div className={styles.tableOrdersTitle}>Boyut</div>
                                    <div className={styles.tableOrdersTitle}>Adet</div>
                                    <div className={styles.tableOrdersTitle}>Fiyat</div>
                                </div>
                                {table.items.map((item, index) => {
                                    return (
                                        <div key={index} className={styles.tableOrdersItem}>
                                            <div className={styles.tableOrdersItemName}>
                                                {item.item_name}
                                            </div>
                                            <div className={styles.tableOrdersItemSize}>
                                                {item.item_size}
                                            </div>
                                            <div className={styles.tableOrdersItemQuantity}>
                                                {item.item_quantity}
                                            </div>
                                            <div className={styles.tableOrdersItemPrice}>
                                                {item.item_price}₺
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
                                        Math.ceil(table.items.reduce(
                                            (total, item) => total + Number(item.item_price),
                                            0,
                                        ) * 100) / 100
                                    ).toFixed(2)}
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
                                <button
                                    className={styles.tableButtonsQr}
                                    onClick={() =>
                                        generateQRCode(table.table_name, table.table_slug)
                                    }
                                >
                                    QR Kod
                                </button>
                            </div>
                            {user?.role === 'admin' && (
                                <div className={styles.tableDelete}>
                                    <button
                                        className={styles.tableDeleteButton}
                                        onClick={() => {
                                            openDeleteTableModal(table.table_slug, table.order_id);
                                        }}
                                    >
                                        Masayı Sil
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tables;
