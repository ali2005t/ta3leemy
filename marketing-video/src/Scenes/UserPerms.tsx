import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const UserPerms = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill style={{
            background: '#f8fafc',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', color: '#334155', marginBottom: '40px' }}>👥 إدارة فريق العمل</h2>

            <div style={{ display: 'flex', gap: '30px' }}>
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    width: '300px'
                }}>
                    <div style={{ fontSize: '60px' }}>👨‍🏫</div>
                    <h3 style={{ fontFamily: 'Cairo', fontSize: '30px', margin: '10px 0' }}>المدرس</h3>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '5px 15px', borderRadius: '15px' }}>تحكم كامل</span>
                </div>

                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    width: '300px'
                }}>
                    <div style={{ fontSize: '60px' }}>🧑‍💻</div>
                    <h3 style={{ fontFamily: 'Cairo', fontSize: '30px', margin: '10px 0' }}>المساعد</h3>
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '5px 15px', borderRadius: '15px' }}>صلاحيات محددة</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};
