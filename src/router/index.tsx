import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import AuthGuard from './AuthGuard'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Video from '@/pages/Video'
import VideoLayout from '@/pages/Video/layout'
import VideoOverview from '@/pages/Video/Overview'
import VideoTasks from '@/pages/Video/Tasks'
import VideoAnalysis from '@/pages/Video/Analysis'
import VideoApiDebug from '@/pages/Video/ApiDebug'
import VideoConfig from '@/pages/Video/Config'
import VideoTaskDetail from '@/pages/Video/TaskDetail'
import Data from '@/pages/Data'
import DataLayout from '@/pages/Data/layout'
import DataOverview from '@/pages/Data/Overview'
import DataSources from '@/pages/Data/Sources'
import DataGovernance from '@/pages/Data/Governance'
import DataGovernanceResult from '@/pages/Data/GovernanceResult'
import DataAnalysisPage from '@/pages/Data/AnalysisPage'
import DataReports from '@/pages/Data/Reports'
import DataReportDetail from '@/pages/Data/ReportDetail'
import DataQuality from '@/pages/Data/Quality'
import DataAiAnalysis from '@/pages/Data/AiAnalysis'
import DataSync from '@/pages/Data/Sync'
import DataSystem from '@/pages/Data/System'
import DataTaskDetail from '@/pages/Data/TaskDetail'
import Audio from '@/pages/Audio'
import AudioLayout from '@/pages/Audio/layout'
import AudioOverview from '@/pages/Audio/Overview'
import AudioWorkspace from '@/pages/Audio/Workspace'
import AudioTranscription from '@/pages/Audio/Transcription'
import AudioExtraction from '@/pages/Audio/Extraction'
import AudioHistory from '@/pages/Audio/History'
import AudioSettings from '@/pages/Audio/Settings'
import AudioTaskDetail from '@/pages/Audio/TaskDetail'
import Crawler from '@/pages/Crawler'
import CrawlerLayout from '@/pages/Crawler/layout'
import CrawlerOverview from '@/pages/Crawler/Overview'
import CrawlerSearch from '@/pages/Crawler/Search'
import CrawlerSources from '@/pages/Crawler/Sources'
import CrawlerOpinion from '@/pages/Crawler/Opinion'
import CrawlerDataManage from '@/pages/Crawler/DataManage'
import CrawlerSettings from '@/pages/Crawler/Settings'
import CrawlerTaskDetail from '@/pages/Crawler/TaskDetail'
import Community from '@/pages/Community'
import CommunityLayout from '@/pages/Community/layout'
import CommunityOverview from '@/pages/Community/Overview'
import CommunityInbox from '@/pages/Community/Inbox'
import CommunityAiReply from '@/pages/Community/AiReply'
import CommunityPush from '@/pages/Community/Push'
import CommunityPortrait from '@/pages/Community/Portrait'
import CommunitySettings from '@/pages/Community/Settings'
import DataClean from '@/pages/DataClean'
import DataCleanLayout from '@/pages/DataClean/layout'
import DataCleanOverview from '@/pages/DataClean/Overview'
import DataCleanUpload from '@/pages/DataClean/Upload'
import DataCleanBatches from '@/pages/DataClean/Batches'
import DataCleanPipeline from '@/pages/DataClean/Pipeline'
import DataCleanQuality from '@/pages/DataClean/Quality'
import DataCleanSettings from '@/pages/DataClean/Settings'
import DataCleanTaskDetail from '@/pages/DataClean/TaskDetail'
import Knowledge from '@/pages/Knowledge'
import KnowledgeLayout from '@/pages/Knowledge/layout'
import KnowledgeOverview from '@/pages/Knowledge/Overview'
import KnowledgeBases from '@/pages/Knowledge/Bases'
import KnowledgeStructure from '@/pages/Knowledge/Structure'
import KnowledgeValidation from '@/pages/Knowledge/Validation'
import KnowledgeSearchPage from '@/pages/Knowledge/SearchPage'
import KnowledgeSync from '@/pages/Knowledge/Sync'
import KnowledgeDetail from '@/pages/Knowledge/Detail'
import Project from '@/pages/Project'
import ProjectDetail from '@/pages/Project/Detail'
import Task from '@/pages/Task'
import TaskLayout from '@/pages/Task/layout'
import TaskOverview from '@/pages/Task/Overview'
import TaskTasks from '@/pages/Task/Tasks'
import TaskTracking from '@/pages/Task/Tracking'
import TaskDocs from '@/pages/Task/Docs'
import TaskCollab from '@/pages/Task/Collab'
import TaskClosure from '@/pages/Task/Closure'
import TaskDetail from '@/pages/Task/TaskDetail'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'video',
        element: <VideoLayout />,
        children: [
          { index: true, element: <Video /> },
          { path: 'overview', element: <VideoOverview /> },
          { path: 'tasks', element: <VideoTasks /> },
          { path: 'analysis', element: <VideoAnalysis /> },
          { path: 'api-debug', element: <VideoApiDebug /> },
          { path: 'config', element: <VideoConfig /> },
          { path: 'task/:id', element: <VideoTaskDetail /> },
        ],
      },
      {
        path: 'data',
        element: <DataLayout />,
        children: [
          { index: true, element: <Data /> },
          { path: 'overview', element: <DataOverview /> },
          { path: 'sources', element: <DataSources /> },
          { path: 'governance', element: <DataGovernance /> },
          { path: 'governance/result', element: <DataGovernanceResult /> },
          { path: 'analysis', element: <DataAnalysisPage /> },
          { path: 'reports', element: <DataReports /> },
          { path: 'reports/:id', element: <DataReportDetail /> },
          { path: 'quality', element: <DataQuality /> },
          { path: 'ai-analysis', element: <DataAiAnalysis /> },
          { path: 'sync', element: <DataSync /> },
          { path: 'system', element: <DataSystem /> },
          { path: 'task/:id', element: <DataTaskDetail /> },
        ],
      },
      {
        path: 'audio',
        element: <AudioLayout />,
        children: [
          { index: true, element: <Audio /> },
          { path: 'overview', element: <AudioOverview /> },
          { path: 'workspace', element: <AudioWorkspace /> },
          { path: 'transcription', element: <AudioTranscription /> },
          { path: 'extraction', element: <AudioExtraction /> },
          { path: 'history', element: <AudioHistory /> },
          { path: 'settings', element: <AudioSettings /> },
          { path: 'task/:id', element: <AudioTaskDetail /> },
        ],
      },
      {
        path: 'crawler',
        element: <CrawlerLayout />,
        children: [
          { index: true, element: <Crawler /> },
          { path: 'overview', element: <CrawlerOverview /> },
          { path: 'search', element: <CrawlerSearch /> },
          { path: 'sources', element: <CrawlerSources /> },
          { path: 'opinion', element: <CrawlerOpinion /> },
          { path: 'data', element: <CrawlerDataManage /> },
          { path: 'settings', element: <CrawlerSettings /> },
          { path: 'task/:id', element: <CrawlerTaskDetail /> },
        ],
      },
      {
        path: 'community',
        element: <CommunityLayout />,
        children: [
          { index: true, element: <Community /> },
          { path: 'overview', element: <CommunityOverview /> },
          { path: 'inbox', element: <CommunityInbox /> },
          { path: 'ai-reply', element: <CommunityAiReply /> },
          { path: 'push', element: <CommunityPush /> },
          { path: 'portrait', element: <CommunityPortrait /> },
          { path: 'settings', element: <CommunitySettings /> },
        ],
      },
      {
        path: 'data-clean',
        element: <DataCleanLayout />,
        children: [
          { index: true, element: <DataClean /> },
          { path: 'overview', element: <DataCleanOverview /> },
          { path: 'upload', element: <DataCleanUpload /> },
          { path: 'batches', element: <DataCleanBatches /> },
          { path: 'pipeline', element: <DataCleanPipeline /> },
          { path: 'quality', element: <DataCleanQuality /> },
          { path: 'settings', element: <DataCleanSettings /> },
          { path: 'task/:id', element: <DataCleanTaskDetail /> },
        ],
      },
      {
        path: 'knowledge',
        element: <KnowledgeLayout />,
        children: [
          { index: true, element: <Knowledge /> },
          { path: 'overview', element: <KnowledgeOverview /> },
          { path: 'bases', element: <KnowledgeBases /> },
          { path: 'structure', element: <KnowledgeStructure /> },
          { path: 'validation', element: <KnowledgeValidation /> },
          { path: 'search', element: <KnowledgeSearchPage /> },
          { path: 'sync', element: <KnowledgeSync /> },
          { path: 'base/:id', element: <KnowledgeDetail /> },
          { path: ':id', element: <KnowledgeLegacyRedirect /> },
        ],
      },
      { path: 'project', element: <Project /> },
      { path: 'project/:id', element: <ProjectDetail /> },
      {
        path: 'task',
        element: <TaskLayout />,
        children: [
          { index: true, element: <Task /> },
          { path: 'overview', element: <TaskOverview /> },
          { path: 'tasks', element: <TaskTasks /> },
          { path: 'tracking', element: <TaskTracking /> },
          { path: 'docs', element: <TaskDocs /> },
          { path: 'collab', element: <TaskCollab /> },
          { path: 'closure', element: <TaskClosure /> },
          { path: 'task/:id', element: <TaskDetail /> },
        ],
      },
    ],
  },
], { basename })

function KnowledgeLegacyRedirect() {
  const { id } = useParams()
  return <Navigate to={`/knowledge/base/${id}`} replace />
}
