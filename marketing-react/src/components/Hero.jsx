import React from 'react';

const Hero = () => {
    return (
        <header className="hero" style={{
            minHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 20px'
        }}>
            <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                التعليم كما لم تره من قبل
            </h1>
            <p style={{
                fontSize: '1.25rem',
                color: 'var(--text-dim)',
                maxWidth: '600px',
                marginBottom: '2rem'
            }}>
                منصة تعليمية متكاملة تجمع بين سهولة الاستخدام وقوة الأداء. امتحانات، حصص مباشرة، وتقارير متابعة.. كل ذلك في مكان واحد.
            </p>

            <div className="buttons-group" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="#" className="btn btn-primary">📱 حمل للاندرويد</a>
                <a href="#" className="btn btn-primary" style={{ filter: 'hue-rotate(45deg)' }}>💻 حمل للويندوز</a>
            </div>
        </header>
    );
};

export default Hero;
