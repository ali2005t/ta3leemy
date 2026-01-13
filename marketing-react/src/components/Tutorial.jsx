import React from 'react';

const Step = ({ number, title, desc }) => (
    <div className="step" style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '40px',
        background: 'var(--card-bg)',
        padding: '20px',
        borderRadius: '15px',
        border: '1px solid var(--border)',
        alignItems: 'center'
    }}>
        <div className="step-number" style={{
            background: 'var(--primary)',
            color: 'white',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            flexShrink: 0
        }}>{number}</div>
        <div className="step-content">
            <h3 style={{ marginBottom: '5px', color: 'var(--accent)' }}>{title}</h3>
            <p>{desc}</p>
        </div>
    </div>
);

const Tutorial = () => {
    return (
        <div className="tutorial-page">
            <header className="hero" style={{ minHeight: '40vh', textAlign: 'center', paddingTop: '100px' }}>
                <h1 className="gradient-text">كيف تبدأ رحلتك؟</h1>
                <p>فيديو سريع يشرح لك كل مميزات المنصة وكيفية التسجيل.</p>
            </header>

            <section style={{ padding: '0 20px', textAlign: 'center' }}>
                <div className="video-container" style={{
                    width: '100%',
                    maxWidth: '900px',
                    margin: '0 auto 50px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    border: '1px solid var(--border)',
                    aspectRatio: '16/9',
                    background: '#000'
                }}>
                    <iframe
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="شرح منصة تعليمي"
                        allowFullScreen
                        style={{ width: '100%', height: '100%', border: 'none' }}
                    ></iframe>
                </div>
            </section>

            <section className="features" style={{ padding: '5rem 10%' }}>
                <div className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2>خطوات بسيطة للبدء</h2>
                </div>

                <div className="steps-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Step number="1" title="تحميل التطبيق" desc="قم بتحميل التطبيق المناسب لجهازك (أندرويد أو ويندوز) من الصفحة الرئيسية." />
                    <Step number="2" title="انشاء حساب جديد" desc="افتح التطبيق واختر 'انشاء حساب'. املأ بياناتك (الاسم، رقم الهاتف، والمرحلة الدراسية)." />
                    <Step number="3" title="تفعيل الحساب" desc="تواصل مع المدرس أو الدعم الفني للحصول على كود التفعيل الخاص بك." />
                    <Step number="4" title="انطلق! 🚀" desc="الآن يمكنك دخول الحصص، حل الامتحانات، ومتابعة دروسك بكل سهولة." />
                </div>
            </section>
        </div>
    );
};

export default Tutorial;
