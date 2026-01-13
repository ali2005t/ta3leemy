import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const Gamification = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const trophyScale = spring({
        fps,
        frame,
        config: { damping: 12, stiffness: 100 }
    });

    const badgeScale = spring({
        fps,
        frame: frame - 15,
        config: { damping: 12, stiffness: 100 }
    });

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            color: '#78350f'
        }}>
            <h2 style={{
                fontFamily: 'Cairo',
                fontSize: '60px',
                fontWeight: 'bold',
                marginBottom: '40px',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                🏆 تنافس واكسب جوائز
            </h2>

            <div style={{
                display: 'flex',
                gap: '50px',
                alignItems: 'flex-end'
            }}>
                {/* Badge 1 */}
                <div style={{ transform: `scale(${badgeScale})`, textAlign: 'center' }}>
                    <div style={{ fontSize: '80px' }}>🥇</div>
                    <div style={{ fontFamily: 'Cairo', fontSize: '24px', fontWeight: 'bold' }}>الأول</div>
                </div>

                {/* Main Trophy */}
                <div style={{ transform: `scale(${trophyScale})`, textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '150px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>🏆</div>
                </div>

                {/* Badge 2 */}
                <div style={{ transform: `scale(${badgeScale})`, textAlign: 'center' }}>
                    <div style={{ fontSize: '80px' }}>🥈</div>
                    <div style={{ fontFamily: 'Cairo', fontSize: '24px', fontWeight: 'bold' }}>الثاني</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
