'use client';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PrintIcon from '@mui/icons-material/Print';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCode from 'qrcode';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useSWR from 'swr';
import axios from '@/app/lib/axios';
import { useAuth } from '../hooks/useAuth';
import { useAuthorization } from '../hooks/useAuthorization';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './styles.module.scss';
import Table from '../components/Table';

const MySwal = withReactContent(Swal);

const Tables = () => {
    const { user } = useAuth();
    useAuthorization({ authorization: 'waiter' });
    const { isMobile } = useWindowSize();
    const { data: tables = [], mutate } = useSWR('/tables', async (url) => await axios.get(url).then((res) => res.data.data));

    const openAddTableModal = () => {
        Swal.fire({
            title: 'Yeni Masa Ekle',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Ekle',
            showLoaderOnConfirm: true,
            cancelButtonText: 'İptal',
            didOpen: () => {
                const input = Swal.getPopup().querySelector('#swal2-input');
                input.value = `Masa ${tables.length + 1}`;
                input.focus();
            },
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#swal2-input').value;
                try {
                    return axios.post('/tables', { name }).then((res) => {
                        mutate();
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


    useEffect(() => {
        mutate();
    }, []);


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
                function printAllQrCodes() {
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
        <div className='container'>
            <div className={styles.tablesTopButtons}>
                {!isMobile && (
                    <button className={styles.tablesTopButtonsQR} onClick={openAllQrModal}>
                        Tüm QR Kodlar <QrCode2Icon />
                    </button>
                )}
                {(user?.role === 'admin' || user?.role === 'superadmin') && (
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
                    return (<Table key={index} table={table} mutate={mutate} />);
                })}
            </div>
        </div>
    );
};

export default Tables;
