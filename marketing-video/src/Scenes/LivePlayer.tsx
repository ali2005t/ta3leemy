import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const LivePlayer = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{
            background: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <div style={{
                width: '90%',
                height: '80%',
                border: '2px solid #333',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    background: 'red',
                    padding: '5px 15px',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '20px'
                }}>
                    🔴 LIVE
                </div>

                <h1 style={{ fontFamily: 'Cairo', fontSize: '60px' }}>شرح الكيمياء العضوية 🧪</h1>

                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '80px',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 20px',
                    gap: '20px'
                }}>
                    <span>▶️</span>
                    <div style={{ height: '5px', background: 'red', flex: 1 }}></div>
                    <span>🔊</span>
                </div>
            </div>
            <h2 style={{ fontFamily: 'Cairo', marginTop: '20px', color: '#94a3b8' }}>مشاهدة بجودة عالية وبدون تقطيع</h2>
        </AbsoluteFill>
    );
};
