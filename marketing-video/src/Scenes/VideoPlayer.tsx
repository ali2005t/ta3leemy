import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const VideoPlayer = () => {
    return (
        <AbsoluteFill style={{
            background: '#0f172a',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', marginBottom: '30px' }}>🎬 حصص مسجلة احترافية</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                width: '80%'
            }}>
                {[1, 2, 3].map((i) => (
                    <div key={i} style={{
                        background: '#1e293b',
                        height: '200px',
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ fontSize: '50px' }}>▶️</div>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(0,0,0,0.7)',
                            fontFamily: 'Cairo',
                            fontSize: '18px'
                        }}>
                            الدرس {i}: الأساسيات
                        </div>
                    </div>
                ))}
            </div>
        </AbsoluteFill>
    );
};
