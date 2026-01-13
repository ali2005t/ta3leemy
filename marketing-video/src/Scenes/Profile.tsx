import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const Profile = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        fps,
        frame,
        config: { damping: 12 }
    });

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(to right, #4338ca, #3b82f6)',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '50px',
                borderRadius: '30px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
                transform: `scale(${scale})`
            }}>
                <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: '#fff',
                    margin: '0 auto 20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '80px',
                    border: '5px solid #60a5fa'
                }}>
                    👨‍🎓
                </div>
                <h2 style={{ fontFamily: 'Cairo', fontSize: '40px', margin: '0 0 10px' }}>أحمد علي</h2>
                <p style={{ fontFamily: 'Cairo', fontSize: '20px', opacity: 0.8 }}>الصف الثالث الثانوي</p>

                <div style={{ display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '10px' }}>
                        📚 5 كورسات
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '10px' }}>
                        ⭐ 480 نقطة
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
