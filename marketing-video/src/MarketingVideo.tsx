import { AbsoluteFill, Sequence } from 'remotion';
import { Intro } from './Scenes/Intro';
import { ProblemSolution } from './Scenes/ProblemSolution';
import { LiveChat } from './Scenes/LiveChat';
import { Showcase } from './Scenes/Showcase';
import { Gamification } from './Scenes/Gamification';
import { Security } from './Scenes/Security';
import { SuccessMoment } from './Scenes/SuccessMoment';
import { CTA } from './Scenes/CTA';

// Batch 1: Teacher Control
import { Dashboard } from './Scenes/Dashboard';
import { CodeGen } from './Scenes/CodeGen';
import { Financials } from './Scenes/Financials';
import { UserPerms } from './Scenes/UserPerms';
import { CourseMgmt } from './Scenes/CourseMgmt';

// Batch 2: Learning Experience
import { LivePlayer } from './Scenes/LivePlayer';
import { VideoPlayer } from './Scenes/VideoPlayer';
import { PDFViewer } from './Scenes/PDFViewer';
import { ExamView } from './Scenes/ExamView';
import { TrainingMode } from './Scenes/TrainingMode';

// Batch 3: System Features
import { Notifications } from './Scenes/Notifications';
import { DarkMode } from './Scenes/DarkMode';
import { Profile } from './Scenes/Profile';
import { Support } from './Scenes/Support';
import { MultiPlatform } from './Scenes/MultiPlatform';

export const MarketingVideo = () => {
    // Total Duration: 1620 frames (54 seconds)
    return (
        <AbsoluteFill style={{ backgroundColor: 'white' }}>
            {/* --- ACT 1: THE HOOK (10s | 300f) --- */}
            <Sequence from={0} durationInFrames={90}>
                <Intro />
            </Sequence>
            <Sequence from={90} durationInFrames={120}>
                <ProblemSolution />
            </Sequence>
            <Sequence from={210} durationInFrames={90}>
                <LiveChat />
            </Sequence>

            {/* --- ACT 2: TEACHER TOOLS (10s | 300f) --- */}
            <Sequence from={300} durationInFrames={60}><Dashboard /></Sequence>
            <Sequence from={360} durationInFrames={60}><CodeGen /></Sequence>
            <Sequence from={420} durationInFrames={60}><Financials /></Sequence>
            <Sequence from={480} durationInFrames={60}><UserPerms /></Sequence>
            <Sequence from={540} durationInFrames={60}><CourseMgmt /></Sequence>

            {/* --- ACT 3: STUDENT EXPERIENCE (10s | 300f) --- */}
            <Sequence from={600} durationInFrames={60}><LivePlayer /></Sequence>
            <Sequence from={660} durationInFrames={60}><VideoPlayer /></Sequence>
            <Sequence from={720} durationInFrames={60}><PDFViewer /></Sequence>
            <Sequence from={780} durationInFrames={60}><ExamView /></Sequence>
            <Sequence from={840} durationInFrames={60}><TrainingMode /></Sequence>

            {/* --- ACT 4: SYSTEM FEATURES (10s | 300f) --- */}
            <Sequence from={900} durationInFrames={60}><Notifications /></Sequence>
            <Sequence from={960} durationInFrames={60}><DarkMode /></Sequence>
            <Sequence from={1020} durationInFrames={60}><Profile /></Sequence>
            <Sequence from={1080} durationInFrames={60}><Support /></Sequence>
            <Sequence from={1140} durationInFrames={60}><MultiPlatform /></Sequence>

            {/* --- ACT 5: THE CLIMAX (14s | 420f) --- */}
            <Sequence from={1200} durationInFrames={90}><Showcase /></Sequence>
            <Sequence from={1290} durationInFrames={90}><Gamification /></Sequence>
            <Sequence from={1380} durationInFrames={90}><Security /></Sequence>
            <Sequence from={1470} durationInFrames={90}><SuccessMoment /></Sequence>
            <Sequence from={1560} durationInFrames={60}><CTA /></Sequence>
        </AbsoluteFill>
    );
};
