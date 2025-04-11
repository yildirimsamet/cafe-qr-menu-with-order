'use client';

import { useState } from 'react';
import './styles.css';

const FaqSection = () => {
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
                        <div className="faq-answer">{faq.a}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FaqSection;
