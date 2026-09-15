import React, { useState } from 'react';
import {
  X,
  Database,
  ExternalLink,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FirestoreStatus } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

interface FirebaseDetailsModalProps {
  status: FirestoreStatus;
  onClose: () => void;
}

export const FirebaseDetailsModal: React.FC<FirebaseDetailsModalProps> = ({
  status,
  onClose,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const projectId = firebaseConfig.projectId || 'applied-vortex-pds98';
  const databaseId =
    firebaseConfig.firestoreDatabaseId ||
    'ai-studio-aidrivenpathtoco-72bcdf5f-fc54-4048-8782-28c247242244';
  const collectionName = 'cm360_p2c_touchpoints';

  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore/databases/${databaseId}/data/~2F${collectionName}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Cloud Firestore Project Registry
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Cloud Database
                </span>
              </div>
              <p className="text-xs text-indigo-200/70 mt-0.5">
                Target Google Cloud / Firebase resource details and console coordinates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Console Action Banner */}
          <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-indigo-950 block">
                Direct Firebase Console Access
              </span>
              <p className="text-xs text-indigo-700 mt-0.5">
                Inspect raw documents, indexes, and real-time reads/writes in Google Cloud
              </p>
            </div>
            <a
              href={consoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs whitespace-nowrap cursor-pointer"
            >
              <span>Open in Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Database Parameters Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Provisioned Cloud Resource Coordinates
            </h3>

            {/* Project ID */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Firebase Project ID
                </span>
                <code className="text-xs font-mono font-bold text-slate-900">
                  {projectId}
                </code>
              </div>
              <button
                onClick={() => handleCopy(projectId, 'projectId')}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Copy Project ID"
              >
                {copiedField === 'projectId' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Firestore Database ID */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Firestore Database ID
                </span>
                <code className="text-xs font-mono font-bold text-slate-900 break-all">
                  {databaseId}
                </code>
              </div>
              <button
                onClick={() => handleCopy(databaseId, 'databaseId')}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer ml-2"
                title="Copy Database ID"
              >
                {copiedField === 'databaseId' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Collection Name */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Target Collection Path
                </span>
                <code className="text-xs font-mono font-bold text-indigo-700">
                  /{collectionName}/
                </code>
              </div>
              <button
                onClick={() => handleCopy(collectionName, 'collectionName')}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Copy Collection Name"
              >
                {copiedField === 'collectionName' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Status & Sync Stats */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span className="text-xs font-bold text-emerald-700">Connected</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block">Documents</span>
                <span className="text-xs font-bold text-slate-900">{status.documentCount} records</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block">Rules Status</span>
                <span className="text-xs font-bold text-indigo-700">Deployed</span>
              </div>
            </div>
          </div>

          {/* Navigation Steps */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              How to view this project in the Firebase Console:
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
              <li>
                Open{' '}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  console.firebase.google.com
                </a>{' '}
                using your Google account.
              </li>
              <li>
                Look for the project titled{' '}
                <strong className="text-slate-900 font-mono">
                  {projectId}
                </strong>
                .
              </li>
              <li>
                In the left sidebar under <strong>Build</strong>, click{' '}
                <strong>Firestore Database</strong>.
              </li>
              <li>
                If prompted, switch the database dropdown to{' '}
                <strong className="text-slate-900 font-mono text-[11px]">
                  {databaseId}
                </strong>
                .
              </li>
              <li>
                Click into the collection{' '}
                <strong className="text-indigo-700 font-mono">
                  {collectionName}
                </strong>{' '}
                to inspect all conversion touchpoints in real time.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
