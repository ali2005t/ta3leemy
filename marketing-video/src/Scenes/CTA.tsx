import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const CTA = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        fps,
        frame,
        config: { damping: 100 },
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: '#4F46E5',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <h1 style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: '90px',
                fontWeight: 'bold',
                marginBottom: '40px',
                transform: `scale(${scale})`
            }}>
                📱 حمل التطبيق الآن
            </h1>
            <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '60px' }}>🤖</span>
                    <p style={{ fontFamily: 'Cairo', fontSize: '30px' }}>Android</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '60px' }}>💻</span>
                    <p style={{ fontFamily: 'Cairo', fontSize: '30px' }}>Windows</p>
                </div>
            </div>
        </AbsoluteFill>
    );
};
