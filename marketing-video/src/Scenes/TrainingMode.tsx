import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const TrainingMode = () => {
    const frame = useCurrentFrame();

    const scale = spring({
        fps: 30,
        frame,
        config: { damping: 10, stiffness: 100 }
    });

    return (
        <AbsoluteFill style={{
            background: '#7c3aed',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '60px', marginBottom: '20px' }}>🏋️ وضع التدريب</h2>
            <p style={{ fontFamily: 'Cairo', fontSize: '30px', opacity: 0.8 }}>درب نفسك بدون درجات</p>

            <div style={{
                marginTop: '50px',
                fontSize: '150px',
                transform: `scale(${scale})`
            }}>
                🧠
            </div>
        </AbsoluteFill>
    );
};
