import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const MultiPlatform = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideUp = spring({
        fps,
        frame,
        config: { damping: 15 }
    });

    return (
        <AbsoluteFill style={{
            background: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            color: 'white'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', marginBottom: '60px' }}>📱💻 تعمل على جميع الأجهزة</h2>

            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '30px',
                transform: `translateY(${(1 - slideUp) * 100}px)`,
                opacity: slideUp
            }}>
                {/* Mobile */}
                <div style={{
                    width: '100px',
                    height: '200px',
                    border: '4px solid #333',
                    borderRadius: '20px',
                    background: '#111'
                }} />

                {/* Tablet */}
                <div style={{
                    width: '200px',
                    height: '280px',
                    border: '4px solid #333',
                    borderRadius: '20px',
                    background: '#111'
                }} />

                {/* Laptop */}
                <div style={{
                    width: '400px',
                    height: '250px',
                    border: '4px solid #333',
                    borderRadius: '10px',
                    background: '#111',
                    marginBottom: '20px', // Align bottom
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '500px',
                        height: '10px',
                        background: '#333',
                        borderRadius: '0 0 10px 10px'
                    }} />
                </div>
            </div>
        </AbsoluteFill>
    );
};
