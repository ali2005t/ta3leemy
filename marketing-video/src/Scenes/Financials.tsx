import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const Financials = () => {
    const frame = useCurrentFrame();

    // Counter animation
    const counter = Math.min(10000 + Math.floor(frame * 100), 25000);

    return (
        <AbsoluteFill style={{
            background: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', color: '#64748b' }}>💰 متابعة الأرباح</h2>

            <h1 style={{
                fontFamily: 'Inter',
                fontSize: '120px',
                color: '#22c55e',
                fontWeight: 'bold',
                marginTop: '20px'
            }}>
                EGP {counter.toLocaleString()}
            </h1>

            <div style={{
                marginTop: '20px',
                color: '#ef4444',
                fontFamily: 'Cairo',
                fontSize: '30px',
                background: '#fee2e2',
                padding: '10px 20px',
                borderRadius: '20px'
            }}>
                🔼 +15% هذا الشهر
            </div>
        </AbsoluteFill>
    );
};
