import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const Support = () => {
    const frame = useCurrentFrame();

    // Pulse animation
    const scale = 1 + Math.sin(frame / 10) * 0.05;

    return (
        <AbsoluteFill style={{
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', marginBottom: '50px', color: '#1e293b' }}>🛠️ دعم فني 24/7</h2>

            <div style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: '#dbeafe',
                    borderRadius: '50%',
                    transform: `scale(${scale})`,
                    opacity: 0.5
                }} />

                <div style={{
                    fontSize: '100px',
                    zIndex: 1
                }}>
                    🎧
                </div>
            </div>

            <div style={{
                marginTop: '40px',
                background: '#2563eb',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '50px',
                fontFamily: 'Cairo',
                fontSize: '25px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
            }}>
                <span>تواصل معنا الآن</span>
                <span>💬</span>
            </div>
        </AbsoluteFill>
    );
};
