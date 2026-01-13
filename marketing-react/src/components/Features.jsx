import React from 'react';

const FeatureCard = ({ icon, title, desc }) => (
    <div className="card" style={{
        background: 'var(--card-bg)',
        padding: '30px',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(5px)',
        textAlign: 'center'
    }}>
        <span className="card-icon" style={{ fontSize: '3rem', marginBottom: '20px', display: 'block' }}>{icon}</span>
        <h3 style={{ marginBottom: '10px' }}>{title}</h3>
        <p style={{ color: 'var(--text-dim)' }}>{desc}</p>
    </div>
);

const Features = () => {
    const features = [
        { icon: "🎥", title: "حصص لايف عالية الجودة", desc: "شاهد مدرسك صوت وصورة وتفاعل معه لحظياً بأعلى جودة وبدون تقطيع." },
        { icon: "📝", title: "نظام امتحانات متطور", desc: "امتحانات تفاعلية، تصحيح تلقائي، ومعرفة نتيجتك فوراً بعد الانتهاء." },
        { icon: "📊", title: "تقارير وتحليلات", desc: "تابع مستواك خطوة بخطوة من خلال رسوم بيانية وتقارير تفصيلية لولي الأمر." },
        { icon: "🔒", title: "حماية وأمان", desc: "بياناتك ومحتواك في أمان تام مع أقوى أنظمة التشفير والحماية." }
    ];

    return (
        <section className="features" style={{ padding: '5rem 10%' }}>
            <div className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem' }}>لماذا تختار <span className="gradient-text">تعليمي</span>؟</h2>
                <p style={{ color: 'var(--text-dim)' }}>مميزات صممت خصيصاً لراحة الطالب والمدرس</p>
            </div>

            <div className="grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px'
            }}>
                {features.map((f, i) => (
                    <FeatureCard key={i} {...f} />
                ))}
            </div>
        </section>
    );
};

export default Features;
