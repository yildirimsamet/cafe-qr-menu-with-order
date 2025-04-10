'use client';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
    faQrcode, faComments, faBell, faEdit, faChair, faUsersCog,
    faTachometerAlt, faMobileAlt, faChartLine, faCogs, faWifi, faHeadset,
    faQuoteLeft, faEnvelope, faPhone,
} from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useState } from 'react';

library.add(
    faQrcode, faComments, faBell, faEdit, faChair, faUsersCog,
    faTachometerAlt, faMobileAlt, faChartLine, faCogs, faWifi, faHeadset,
    faQuoteLeft, faEnvelope, faPhone, faInstagram,
);

const Landing = () => {
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqData = [
        {
            q: 'CafeQRMenü\'nün kurulumu zor mu?',
            a: 'Hayır, kurulum oldukça basittir. Size özel admin paneliniz dakikalar içinde hazır olur ve hemen kullanmaya başlayabilirsiniz. Gerekli kurulumları biz sağlıyoruz.',
        },
        {
            q: 'Mevcut sistemimizle entegre edilebilir mi?',
            a: 'CafeQRMenü bağımsız bir sistem olarak çalışır ve kendi kafenize göre özelleştirilebilir.',
        },
        {
            q: 'Müşterilerin uygulamayı indirmesi gerekiyor mu?',
            a: 'Hayır, müşteriler herhangi bir uygulama indirmeden, sadece telefonlarının kamerasıyla QR kodu okutarak doğrudan menüye erişebilir ve sipariş verebilirler.',
        },
        {
            q: 'Demo talep edebilir miyim?',
            a: 'Evet, demo talep edebilirsiniz.',
        },
        {
            q: 'Fiyatlandırma nasıl?',
            a: 'Tek fiyat ömür boyu kullanım. Demo talebiniz sonrası size özel teklif sunulacaktır.',
        },
    ];

    return (
        <>
            <div className='landing-wrapper'>
                <header className="hero">
                    <div className="landing-container">
                        <h1>QR Kodla Siparişin Geleceği Burada</h1>
                        <h2>Masadan Sipariş!</h2>
                        <p>CafeQRMenü ile tanışın: Cafe ve restoranlar için tasarlanmış, sipariş süreçlerini
                            dijitalleştiren, verimliliği artıran ve müşteri memnuniyetini zirveye taşıyan modern
                            QR kodlu menü ve sipariş sistemi.</p>
                        <Link
                            href="/login"
                            className="btn btn-primary"
                        >Bir Göz Atın</Link>
                        <a
                            href="#features"
                            className="btn btn-secondary"
                            data-letitgo
                        >Özellikleri Keşfet</a>
                    </div>
                </header>
                <section
                    id="features"
                    className="features"
                >
                    <div className="landing-container">
                        <h2 className="section-title">Öne Çıkan Özellikler</h2>
                        <div className="grid grid-3">
                            <div className="card card-order">
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faQrcode} />
                                    <h3>Akıllı QR Sipariş</h3>
                                    <p>
                                        Müşteriler masalarındaki QR kodu okutarak saniyeler içinde menüye ulaşır ve
                                        sipariş verir.
                                    </p>
                                </div>
                            </div>
                            <div className="card card-communication">
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faComments} />
                                    <h3>Masadan İletişim</h3>
                                    <p>Müşteriler uygulama üzerinden garson çağırabilir, hesap isteyebilir veya özel
                                        notlar iletebilir.
                                    </p>
                                </div>
                            </div>
                            <div className="card card-notification">
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faBell} />
                                    <h3>Anlık Bildirimler</h3>
                                    <p>Yeni siparişler, garson çağırma veya hesap istekleri geldiğinde sesli ve
                                        görsel bildirim alın.
                                    </p>
                                </div>
                            </div>
                            <div className="card card-menu">
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faEdit} />
                                    <h3>Esnek Menü Yönetimi</h3>
                                    <p>Ürünleri, kategorileri, boyutları ve fiyatları kolayca ekleyin,
                                        düzenleyin veya kaldırın.
                                    </p>
                                </div>
                            </div>
                            <div className="card card-table">
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faChair} />
                                    <h3>Masa Yönetimi</h3>
                                    <p>
                                        Masaların doluluk durumunu görün, her masa için özel QR kod oluşturun ve
                                        yazdırın.
                                    </p>
                                </div>
                            </div>
                            <div className="card card-user">
                                <div className="card-content">
                                    <FontAwesomeIcon icon={faUsersCog} />
                                    <h3>Kullanıcı Rolleri</h3>
                                    <p>İşletmeniz için farklı yetkilere sahip admin ve garson hesapları oluşturun ve
                                        yönetin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="benefits">
                    <div className="landing-container">
                        <h2 className="section-title">Neden CafeQRMenü?</h2>
                        <div className="grid grid-3">
                            <div className="card">
                                <FontAwesomeIcon icon={faTachometerAlt} />
                                <h3>Hız Kazanın</h3>
                                <p>Sipariş alma ve hazırlama süresini %50'ye varan oranlarda kısaltarak operasyonel
                                    verimliliği artırın.
                                </p>
                            </div>
                            <div className="card">
                                <FontAwesomeIcon icon={faMobileAlt} />
                                <h3>Daima Güncel Menü</h3>
                                <p>Kağıt menü masrafından kurtulun. Menünüzü dilediğiniz an, kolayca güncelleyin.</p>
                            </div>
                            <div className="card">
                                <FontAwesomeIcon icon={faChartLine} />
                                <h3>Anlık Takip</h3>
                                <p>Gelen siparişleri anlık olarak takip edin, detaylı raporlarla işletmenizin
                                    performansını analiz edin.
                                </p>
                            </div>
                            <div className="card">
                                <FontAwesomeIcon icon={faCogs} />
                                <h3>Kolay Yönetim</h3>
                                <p>Kullanıcı dostu admin paneli ile tüm süreci (menü, masalar, siparişler) tek
                                    yerden yönetin.
                                </p>
                            </div>
                            <div className="card">
                                <FontAwesomeIcon icon={faWifi} />
                                <h3>Temassız Deneyim</h3>
                                <p>Müşterilerinize hijyenik ve modern bir sipariş deneyimi sunun.</p>
                            </div>
                            <div className="card">
                                <FontAwesomeIcon icon={faHeadset} />
                                <h3>7/24 Destek</h3>
                                <p>
                                    İhtiyaç duyduğunuz her an yanınızda olan profesyonel destek ekibimizle güvendesiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="screenshots">
                    <div className="landing-container">
                        <h2 className="section-title">Uygulama Ekran Görüntüleri</h2>
                        <div className="grid grid-3">
                            <div className="screenshot-placeholder">
                                <img
                                    src="/images/landing/DesktopTablesMockup.png"
                                    alt="Admin Masalar Ekranı Görseli"
                                />
                            </div>
                            <div className="screenshot-placeholder">
                                <img
                                    src="/images/landing/MobileThreeMockup.png"
                                    alt="Mobil Menü Ekranı Görseli"
                                />
                            </div>
                            <div className="screenshot-placeholder">
                                <img
                                    src="/images/landing/DesktopOrdersMockup.png"
                                    alt="Admin Sipariş Ekranı Görseli"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="testimonials">
                    <div className="landing-container">
                        <h2 className="section-title">Müşterilerimiz Ne Diyor?</h2>
                        <div className="grid grid-3">
                            <div className="card">
                                <FontAwesomeIcon icon={faQuoteLeft} />
                                <p>“Cafeqrmenu sayesinde sipariş hataları neredeyse sıfıra indi. Garsonlarımız artık
                                    daha verimli.”
                                </p>
                                <h3>– Fincan Hikayesi</h3>
                            </div>
                            <div className="card">
                                <FontAwesomeIcon icon={faQuoteLeft} />
                                <p>“Özellikle yoğun saatlerde QR kodla sipariş almak büyük kolaylık sağlıyor.
                                    Müşterilerimiz de çok memnun.”
                                </p>
                                <h3>– Kahve Notası</h3>
                            </div>
                            <div className="card">
                                <FontAwesomeIcon icon={faQuoteLeft} />
                                <p>“Admin paneli çok kullanışlı. Menüyü güncellemek veya raporları incelemek
                                    saniyeler sürüyor.”
                                </p>
                                <h3>– Gece Demliği</h3>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="cta-container">
                    <div className="landing-container">
                        <div className="cta">
                            <h2 className="section-title">İşletmenizi Geleceğe Taşıyın!</h2>
                            <p>CafeQRMenü'nün sunduğu avantajları kendiniz deneyimleyin. Hemen demo talep edin,
                                işletmenizi dijitalleştirmenin keyfini çıkarın.</p>
                            <a
                                id='demo-btn'
                                href="#demo-form"
                                className="btn btn-primary"
                                data-letitgo
                            >Ücretsiz Demo Talep Et</a>
                        </div>
                    </div>
                </section>
                <section id="demo-form">
                    <div className="landing-container">
                        <h2 className="section-title">Demo Başvurusu</h2>
                        <form>
                            <input
                                type="text"
                                name="business"
                                placeholder="İşletme Adı *"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="E-posta Adresiniz *"
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Telefon Numaranız *"
                                required
                            />
                            <textarea
                                name="message"
                                rows="5"
                                placeholder="Eklemek istediğiniz bir mesaj var mı? (isteğe bağlı)"
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Demo Talebini
                                Gönder
                            </button>
                        </form>
                    </div>
                </section>
                <section className="faq">
                    <div className="landing-container">
                        <h2 className="section-title">Sıkça Sorulan Sorular</h2>
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                            >
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFaq(index)}
                                >
                                    {faq.q}
                                    <span className="faq-toggle-icon">{activeFaq === index ? '-' : '+'}</span>
                                </div>
                                {activeFaq === index && (
                                    <div className="faq-answer">{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                <footer>
                    <div className="landing-container">
                        <p className="footer-text">&copy; 2025 CafeQRMenü. Tüm hakları saklıdır.</p>
                        <p className='footer-links'>
                            <button className='link-button'>Gizlilik Politikası</button> |
                            <button className='link-button'>Kullanım Koşulları</button> |
                            <a
                                data-letitgo
                                href='#demo-form'
                            >İletişim</a>
                        </p>
                        <p className="footer-contact">
                            <a
                                data-letitgo
                                href="https://instagram.com/cafeqrmenu_"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faInstagram} /> cafeqrmenu_
                            </a>
                            <a
                                data-letitgo
                                href="mailto:iletisim@cafeqrmenu.online"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faEnvelope} /> iletisim@cafeqrmenu.online
                            </a>
                            <a
                                data-letitgo
                                href="tel:+905531883326"
                            >
                                <FontAwesomeIcon icon={faPhone} /> 0553 188 33 26
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Landing;
