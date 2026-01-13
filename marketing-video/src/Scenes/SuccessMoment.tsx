import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const SuccessMoment = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        fps,
        frame,
        config: { damping: 10, stiffness: 100 }
    });

    const starScale = spring({
        fps,
        frame: frame - 20,
        config: { damping: 10, stiffness: 80 }
    });

    return (
        <AbsoluteFill style={{
            background: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', color: '#64748b', marginBottom: '20px' }}>
                نتائجك مضمونة! 💯
            </h2>

            <div style={{
                position: 'relative',
                width: '300px',
                height: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Circle */}
                <div style={{
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    border: '15px solid #22c55e',
                    position: 'absolute',
                    transform: `scale(${scale})`,
                    opacity: scale
                }} />

                {/* Score */}
                <h1 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '100px',
                    color: '#22c55e',
                    fontWeight: 'bold',
                    transform: `scale(${scale})`
                }}>
                    100%
                </h1>

                {/* Stars */}
                <div style={{ position: 'absolute', top: -50, right: -50, fontSize: '80px', transform: `scale(${starScale})` }}>⭐</div>
                <div style={{ position: 'absolute', bottom: -20, left: -60, fontSize: '60px', transform: `scale(${starScale})` }}>⭐</div>
                <div style={{ position: 'absolute', top: 100, right: -80, fontSize: '50px', transform: `scale(${starScale})` }}>✨</div>
            </div>
        </AbsoluteFill>
    );
};
