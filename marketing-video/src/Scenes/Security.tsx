import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const Security = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const shieldScale = spring({
        fps,
        frame,
        config: { damping: 15, stiffness: 120 }
    });

    const lockOpacity = spring({
        fps,
        frame: frame - 20,
        config: { damping: 200 }
    });

    return (
        <AbsoluteFill style={{
            background: '#111827',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            color: 'white'
        }}>
            <div style={{
                marginBottom: '40px',
                position: 'relative',
                width: '200px',
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Shield */}
                <div style={{
                    fontSize: '180px',
                    transform: `scale(${shieldScale})`,
                    zIndex: 1
                }}>🛡️</div>

                {/* Lock Overlay */}
                <div style={{
                    position: 'absolute',
                    fontSize: '80px',
                    opacity: lockOpacity,
                    transform: `scale(${lockOpacity}) translate(0, 10px)`,
                    zIndex: 2,
                    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))'
                }}>🔒</div>
            </div>

            <h2 style={{
                fontFamily: 'Cairo',
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#4ade80',
                opacity: lockOpacity
            }}>
                أمان تام للمحتوى
            </h2>
            <p style={{
                fontFamily: 'Cairo',
                fontSize: '30px',
                color: '#94a3b8',
                marginTop: '10px',
                opacity: lockOpacity
            }}>
                تشفير كامل وحماية ضد التسريب
            </p>
        </AbsoluteFill>
    );
};
