import { library } from '@fortawesome/fontawesome-svg-core';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
    faQrcode, faComments, faBell, faEdit, faChair, faUsersCog,
    faTachometerAlt, faMobileAlt, faChartLine, faCogs, faWifi, faHeadset,
    faQuoteLeft, faEnvelope, faPhone, faArrowRight, faArrowDown, faEye, faGift,
} from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from '@/app/lib/axios';
import FaqSection from './FaqSection';

library.add(
    faQrcode, faComments, faBell, faEdit, faChair, faUsersCog,
    faTachometerAlt, faMobileAlt, faChartLine, faCogs, faWifi, faHeadset,
    faQuoteLeft, faEnvelope, faPhone, faInstagram, faArrowRight, faArrowDown, faEye, faGift,
);

const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] } },
};

const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] } },
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'backOut' } },
};

const rotateScaleIn = {
    hidden: { opacity: 0, scale: 0.5, rotate: -15 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Landing = () => {
    const [formData, setFormData] = useState({
        business: '',
        email: '',
        phone: '',
        message: '',
    });
    const [formStatus, setFormStatus] = useState({ loading: false, success: null, error: null });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ loading: true, success: null, error: null });

        if (!formData.phone) {
            setFormStatus({ loading: false, success: false, error: 'Telefon numarası zorunludur.' });
            return;
        }

        try {
            const response = await axios.post('/demo-requests', formData);
            if (response.status === 201) {
                setFormStatus({ loading: false, success: true, error: null });
                setFormData({ business: '', email: '', phone: '', message: '' });

                Swal.fire({
                    icon: 'success',
                    title: 'Başarıyla Gönderildi!',
                    text: 'Demo talebiniz başarıyla gönderildi. En kısa sürede ekibimiz size dönüş yapacaktır.',
                    confirmButtonText: 'Tamam',
                });
            } else {
                setFormStatus({ loading: false, success: false, error: 'Form gönderilirken bir hata oluştu.' });
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: 'Form gönderilirken bir hata oluştu.',
                    confirmButtonText: 'Tamam',
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Sunucu hatası, lütfen tekrar deneyin.';
            setFormStatus({ loading: false, success: false, error: errorMessage });
            Swal.fire({
                icon: 'error',
                title: 'Hata!',
                text: errorMessage,
                confirmButtonText: 'Tamam',
            });
        }
    };

    return (
        <>
            <motion.div
                className='landing-wrapper'
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.header
                    className="hero"
                >
                    <motion.div
                        className="landing-container"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div>
                            <motion.h1 variants={fadeInUp}>Kare Kod Menü ile Siparişin Geleceği: CafeQRMenü</motion.h1>
                            <motion.h2
                                variants={fadeInUp}
                                transition={{ delay: 0.1 }}
                            >Kolay ve Hızlı Kare Kod Menü Oluşturma</motion.h2>
                            <motion.p
                                variants={fadeInUp}
                                transition={{ delay: 0.2 }}
                            >CafeQRMenü ile tanışın: Cafe ve restoranlar için tasarlanmış, <strong>kare kod menü oluşturma</strong> süreçlerini
                                dijitalleştiren, verimliliği artıran ve müşteri memnuniyetini zirveye taşıyan modern
                                <strong>QR kodlu menü</strong> ve sipariş sistemi. <strong>QR menü fiyat</strong> avantajlarını keşfedin.</motion.p>
                        </motion.div>
                        <motion.div>
                            <motion.div
                                className="screenshot-cta cta-top"
                                variants={fadeInUp}
                            >
                                <Link
                                    href="/login"
                                    passHref
                                    legacyBehavior
                                >
                                    <motion.a
                                        target="_blank"
                                        className="btn btn-screenshot-cta"
                                        whileHover={{ scale: 1.1, y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)', color: 'var(--primary-color)', backgroundColor: 'var(--white-color)' }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        Bir Göz Atın <FontAwesomeIcon
                                            icon={faEye} //eye icon
                                            style={{ marginLeft: '8px' }}
                                        />
                                    </motion.a>
                                </Link>
                                <motion.a
                                    id='demo-btn'
                                    href="#demo-form"
                                    className="btn btn-secondary"
                                    variants={scaleUp}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Demo Talep Et <FontAwesomeIcon
                                        icon={faGift}
                                        style={{ marginLeft: '8px' }}
                                    />
                                </motion.a>
                            </motion.div>
                            <motion.a
                                href="#features"
                                className="btn btn-secondary"
                                data-letitgo
                                variants={scaleUp}
                                transition={{ delay: 0.3 }}
                                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.9 }}
                            >Özellikleri Keşfet <FontAwesomeIcon
                                icon={faArrowDown}
                                style={{ marginLeft: '8px' }}
                            /></motion.a>
                        </motion.div>
                    </motion.div>
                </motion.header>

                <motion.section
                    id="features"
                    className="features"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={staggerContainer}
                >
                    <div className="landing-container">
                        <motion.h2
                            className="section-title"
                            variants={fadeInUp}
                        >Öne Çıkan Özellikler</motion.h2>
                        <motion.div
                            className="grid grid-3"
                            variants={staggerContainer}
                        >
                            <motion.div
                                className="card card-order"
                                variants={slideInLeft}
                                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                            >
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faQrcode} />
                                    <h3>Akıllı Kare Kod Menü ile Sipariş</h3>
                                    <p>
                                        Müşteriler masalarındaki <strong>kare kod menü</strong>yü okutarak saniyeler içinde menüye ulaşır ve
                                        sipariş verir. <strong>QR menü oluşturma</strong> hiç bu kadar kolay olmamıştı.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="card card-communication"
                                variants={scaleUp}
                                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                            >
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faComments} />
                                    <h3>Masadan İletişim</h3>
                                    <p>Müşteriler uygulama üzerinden garson çağırabilir, hesap isteyebilir veya özel
                                        notlar iletebilir.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="card card-notification"
                                variants={slideInRight}
                                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                            >
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faBell} />
                                    <h3>Anlık Bildirimler</h3>
                                    <p>Yeni siparişler, garson çağırma veya hesap istekleri geldiğinde sesli ve
                                        görsel bildirim alın.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="card card-menu"
                                variants={slideInLeft}
                                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                            >
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faEdit} />
                                    <h3>Esnek Menü Yönetimi</h3>
                                    <p>Ürünleri, kategorileri, boyutları ve fiyatları kolayca ekleyin,
                                        düzenleyin veya kaldırın.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="card card-table"
                                variants={scaleUp}
                                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                            >
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faChair} />
                                    <h3>Masa Yönetimi</h3>
                                    <p>
                                        Masaların doluluk durumunu görün, her masa için özel QR kod oluşturun ve
                                        yazdırın.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="card card-user"
                                variants={slideInRight}
                                whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.2 } }}
                            >
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faUsersCog} />
                                    <h3>Kullanıcı Rolleri</h3>
                                    <p>İşletmeniz için farklı yetkilere sahip admin ve garson hesapları oluşturun ve
                                        yönetin.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.section
                    className="benefits"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={staggerContainer}
                >
                    <div className="landing-container">
                        <motion.h2
                            className="section-title"
                            variants={fadeInUp}
                        >Neden CafeQRMenü ile Kare Kod Menü Kullanmalısınız?</motion.h2>
                        <motion.div
                            className="grid grid-3"
                            variants={staggerContainer}
                        >
                            <motion.div
                                className="card"
                                variants={scaleUp}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <FontAwesomeIcon icon={faTachometerAlt} />
                                <h3>Hız Kazanın</h3>
                                <p>Sipariş alma ve hazırlama süresini %50'ye varan oranlarda kısaltarak operasyonel
                                    verimliliği artırın.
                                </p>
                            </motion.div>
                            <motion.div
                                className="card"
                                variants={scaleUp}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <FontAwesomeIcon icon={faMobileAlt} />
                                <h3>Daima Güncel Menü</h3>
                                <p>Kağıt menü masrafından kurtulun. <strong>Kare kod menü</strong>nüzü dilediğiniz an, uygun <strong>qr menü fiyat</strong> seçenekleriyle kolayca güncelleyin.</p>
                            </motion.div>
                            <motion.div
                                className="card"
                                variants={scaleUp}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <FontAwesomeIcon icon={faChartLine} />
                                <h3>Anlık Takip</h3>
                                <p>Gelen siparişleri anlık olarak takip edin, detaylı raporlarla işletmenizin
                                    performansını analiz edin.
                                </p>
                            </motion.div>
                            <motion.div
                                className="card"
                                variants={scaleUp}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <FontAwesomeIcon icon={faCogs} />
                                <h3>Kolay Yönetim</h3>
                                <p>Kullanıcı dostu admin paneli ile tüm süreci (menü, masalar, siparişler) tek
                                    yerden yönetin.
                                </p>
                            </motion.div>
                            <motion.div
                                className="card"
                                variants={scaleUp}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <FontAwesomeIcon icon={faWifi} />
                                <h3>Temassız Deneyim</h3>
                                <p>Müşterilerinize hijyenik ve modern bir sipariş deneyimi sunun.</p>
                            </motion.div>
                            <motion.div
                                className="card"
                                variants={scaleUp}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            >
                                <FontAwesomeIcon icon={faHeadset} />
                                <h3>7/24 Destek</h3>
                                <p>
                                    İhtiyaç duyduğunuz her an yanınızda olan profesyonel destek ekibimizle güvendesiniz.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.section
                    className="screenshots"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={staggerContainer}
                >
                    <div className="landing-container">
                        <motion.h2
                            className="section-title"
                            variants={fadeInUp}
                        >Uygulama Ekran Görüntüleri: Kare Kod Menü Yönetimi</motion.h2>
                        <motion.div
                            className="grid grid-3"
                            variants={staggerContainer}
                        >
                            <motion.div
                                className="screenshot-placeholder"
                                variants={rotateScaleIn}
                            >
                                <motion.img
                                    src="/images/landing/DesktopTablesMockup.png"
                                    alt="CafeQRMenü Admin Paneli - Kare Kod Menü Masa Yönetimi Ekranı"
                                    whileHover={{ scale: 1.4, rotate: -3 }}
                                />
                            </motion.div>
                            <motion.div
                                className="screenshot-placeholder"
                                variants={rotateScaleIn}
                                transition={{ delay: 0.1 }}
                            >
                                <motion.img
                                    src="/images/landing/MobileThreeMockup.png"
                                    alt="CafeQRMenü Mobil Müşteri Arayüzü - Kare Kod Menü Görünümü"
                                    whileHover={{ scale: 1.4, rotate: 0 }}
                                />
                            </motion.div>
                            <motion.div
                                className="screenshot-placeholder"
                                variants={rotateScaleIn}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.img
                                    src="/images/landing/DesktopOrdersMockup.png"
                                    alt="CafeQRMenü Admin Paneli - Gelen Kare Kod Menü Siparişleri Ekranı"
                                    whileHover={{ scale: 1.4, rotate: 3 }}
                                />
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="screenshot-cta"
                            variants={fadeInUp}
                        >
                            <Link
                                href="/login"
                                passHref
                                legacyBehavior
                            >
                                <motion.a
                                    target="_blank"
                                    className="btn btn-screenshot-cta"
                                    whileHover={{ scale: 1.1, y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)', color: 'var(--primary-color)', backgroundColor: 'var(--white-color)' }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Bir Göz Atın <FontAwesomeIcon
                                        icon={faArrowRight}
                                        style={{ marginLeft: '8px' }}
                                    />
                                </motion.a>
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.section
                    className="testimonials"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={staggerContainer}
                >
                    <div className="landing-container">
                        <motion.h2
                            className="section-title"
                            variants={fadeInUp}
                        >Müşterilerimiz Ne Diyor?</motion.h2>
                        <motion.div
                            className="grid grid-3"
                            variants={staggerContainer}
                        >
                            <motion.div
                                className="card"
                                variants={slideInLeft}
                            >
                                <FontAwesomeIcon icon={faQuoteLeft} />
                                <p>“Cafeqrmenu sayesinde sipariş hataları neredeyse sıfıra indi. Garsonlarımız artık
                                    daha verimli.”
                                </p>
                                <h3>– Fincan Hikayesi</h3>
                            </motion.div>
                            <motion.div
                                className="card"
                                variants={fadeInUp}
                            >
                                <FontAwesomeIcon icon={faQuoteLeft} />
                                <p>“Özellikle yoğun saatlerde QR kodla sipariş almak büyük kolaylık sağlıyor.
                                    Müşterilerimiz de çok memnun.”
                                </p>
                                <h3>– Kahve Notası</h3>
                            </motion.div>
                            <motion.div
                                className="card"
                                variants={slideInRight}
                            >
                                <FontAwesomeIcon icon={faQuoteLeft} />
                                <p>“Admin paneli çok kullanışlı. Menüyü güncellemek veya raporları incelemek
                                    saniyeler sürüyor.”
                                </p>
                                <h3>– Gece Demliği</h3>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.section
                    className="cta-container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={scaleUp}
                >
                    <div className="landing-container">
                        <motion.div
                            className="cta"
                            variants={staggerContainer}
                        >
                            <motion.h2
                                className="section-title"
                                variants={fadeInUp}
                            >İşletmenizi Kare Kod Menü ile Geleceğe Taşıyın!</motion.h2>
                            <motion.p
                                variants={fadeInUp}
                                transition={{ delay: 0.1 }}
                            >CafeQRMenü'nün sunduğu <strong>kare kod menü</strong> avantajlarını kendiniz deneyimleyin. Hemen <strong>qr menü oluşturma</strong> için demo talep edin,
                                işletmenizi dijitalleştirmenin keyfini çıkarın. Uygun <strong>qr menü fiyat</strong> seçeneklerimizi inceleyin.</motion.p>
                            <motion.a
                                id='demo-btn'
                                href="#demo-form"
                                className="btn btn-primary"
                                data-letitgo
                                variants={fadeInUp}
                                transition={{ delay: 0.2 }}
                                whileHover={{ scale: 1.1, y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                                whileTap={{ scale: 0.9 }}
                            >Ücretsiz Demo Talep Et</motion.a>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.section
                    id="demo-form"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={staggerContainer}
                >
                    <div className="landing-container">
                        <motion.h2
                            className="section-title"
                            variants={fadeInUp}
                        >Ücretsiz Kare Kod Menü Demo Başvurusu</motion.h2>
                        <motion.form
                            onSubmit={handleSubmit}
                            variants={staggerContainer}
                        >
                            <motion.input
                                type="text"
                                name="business"
                                value={formData.business} // Bind value
                                onChange={handleInputChange} // Add onChange
                                variants={slideInLeft}
                                placeholder="İşletme Adı (isteğe bağlı)"
                            />
                            <motion.input
                                type="email"
                                name="email"
                                placeholder="E-posta Adresiniz (isteğe bağlı)"
                                value={formData.email} // Bind value
                                onChange={handleInputChange} // Add onChange
                                variants={slideInRight}
                            />
                            <motion.input
                                type="tel"
                                name="phone"
                                value={formData.phone} // Bind value
                                onChange={handleInputChange} // Add onChange
                                placeholder="Telefon Numaranız *"
                                required
                                variants={slideInLeft}
                            />
                            <motion.textarea
                                name="message"
                                rows="3"
                                placeholder="Eklemek istediğiniz bir mesaj var mı? (isteğe bağlı)"
                                value={formData.message}
                                onChange={handleInputChange}
                                variants={slideInRight}
                            />
                            <motion.button
                                type="submit"
                                className="btn btn-primary"
                                disabled={formStatus.loading}
                                variants={scaleUp}
                                whileHover={{ scale: 1.1, y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {formStatus.loading ? 'Gönderiliyor...' : 'Demo Talebini Gönder'}
                            </motion.button>
                        </motion.form>
                    </div>
                </motion.section>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeInUp}
                >
                    <FaqSection />
                </motion.div>

                <motion.footer
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeInUp}
                >
                    <div className="landing-container">
                        <motion.p
                            className="footer-text"
                            variants={fadeInUp}
                        >&copy; 2025 CafeQRMenü. Tüm hakları saklıdır.</motion.p>
                        <motion.p
                            className='footer-links'
                            variants={fadeInUp}
                            transition={{ delay: 0.1 }}
                        >
                            <motion.button
                                className='link-button'
                                whileHover={{ scale: 1.1, color: 'var(--white-color)' }}
                                whileTap={{ scale: 0.9 }}
                            >Gizlilik Politikası</motion.button> |
                            <motion.button
                                className='link-button'
                                whileHover={{ scale: 1.1, color: 'var(--white-color)' }}
                                whileTap={{ scale: 0.9 }}
                            >Kullanım Koşulları</motion.button> |
                            <motion.a
                                className='link-button'
                                data-letitgo
                                href='#demo-form'
                                style={{ display: 'inline-block' }}
                                whileHover={{ scale: 1.1, color: 'var(--white-color)' }}
                                whileTap={{ scale: 0.9 }}
                            >İletişim</motion.a>
                        </motion.p>
                        <motion.p
                            className="footer-contact"
                            variants={fadeInUp}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.a
                                data-letitgo
                                href="https://instagram.com/cafeqrmenu_"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faInstagram} /> cafeqrmenu_
                            </motion.a>
                            <motion.a
                                data-letitgo
                                href="mailto:iletisim@cafeqrmenu.online"
                                whileHover={{ scale: 1.2, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faEnvelope} /> iletisim@cafeqrmenu.online
                            </motion.a>
                            <motion.a
                                data-letitgo
                                href="tel:+905531883326"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FontAwesomeIcon icon={faPhone} /> 0553 188 33 26
                            </motion.a>
                        </motion.p>
                    </div>
                </motion.footer>
            </motion.div>
        </>
    );
};

export default Landing;
