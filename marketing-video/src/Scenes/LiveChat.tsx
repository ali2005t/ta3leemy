import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, spring } from 'remotion';

const ChatBubble = ({ text, isStudent, delay }: { text: string; isStudent: boolean; delay: number }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = spring({
        fps,
        frame: frame - delay,
        config: { damping: 200 },
    });

    const translateY = spring({
        fps,
        frame: frame - delay,
        config: { damping: 200 },
        from: 20,
        to: 0,
    });

    return (
        <div style={{
            alignSelf: isStudent ? 'flex-end' : 'flex-start',
            backgroundColor: isStudent ? '#4F46E5' : '#e2e8f0',
            color: isStudent ? 'white' : '#1e293b',
            padding: '15px 25px',
            borderRadius: '20px',
            borderBottomRightRadius: isStudent ? '5px' : '20px',
            borderBottomLeftRadius: isStudent ? '20px' : '5px',
            fontSize: '30px',
            fontFamily: 'Cairo',
            maxWidth: '70%',
            marginBottom: '20px',
            opacity,
            transform: `translateY(${translateY}px)`
        }}>
            {text}
        </div>
    );
};

export const LiveChat = () => {
    return (
        <AbsoluteFill style={{
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '50px'
        }}>
            <h2 style={{
                fontFamily: 'Cairo',
                fontSize: '50px',
                color: '#64748b',
                position: 'absolute',
                top: 50
            }}>
                💬 تفاعل مباشر مع المدرس
            </h2>

            <div style={{
                width: '800px',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '50px'
            }}>
                <ChatBubble text="يا مستر، ممكن تعيد النقطة دي؟ ✋" isStudent={true} delay={10} />
                <ChatBubble text="أكيد يا أحمد! ركز معايا..." isStudent={false} delay={50} />
                <ChatBubble text="تمام فهمتها شكراً! ❤️" isStudent={true} delay={90} />
                <ChatBubble text="ممتاز! من يحل السؤال القادم؟" isStudent={false} delay={130} />
            </div>
        </AbsoluteFill>
    );
};
