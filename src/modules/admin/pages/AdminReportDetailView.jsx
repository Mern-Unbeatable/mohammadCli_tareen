import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronLeft,
  History,
  Shield,
  Trash2,
  User,
  UserX,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import FeedPost from '@/modules/user/components/feed/FeedPost';
import ModerationHistoryModal from '@/modules/admin/components/ModerationHistoryModal';
import ReasonModal from '@/modules/admin/components/ReasonModal';
import { getAdminReportById } from '@/modules/admin/data/reports';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';

const ModerationAction = ({ icon: Icon, label, tone, onClick }) => {
  const tones = {
    red: 'border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]',
    amber: 'border-[#FDE68A] bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7]',
    orange: 'border-[#FED7AA] bg-[#FFF7ED] text-[#EA580C] hover:bg-[#FFEDD5]',
    pink: 'border-pink-secondary bg-pink-secondary/30 text-pink-light hover:bg-pink-secondary/50',
    green: 'border-green-secondary bg-green-secondary text-green-primary hover:opacity-90',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-5 text-center transition-colors ${tones[tone]}`}
    >
      <Icon className="h-6 w-6" strokeWidth={1.8} />
      <span className="text-[12px] font-semibold leading-snug">{label}</span>
    </button>
  );
};

const PersonCard = ({ person, variant, onProfile, onAudit }) => (
  <Card className="h-full">
    <div className="flex items-start justify-between gap-3 border-b border-[#E4E7EC] px-5 py-4">
      <div className="flex items-center gap-3">
        <Avatar src={person.avatar} initials={person.initials} alt={person.name} size="md" />
        <div>
          <p className="text-[15px] font-bold text-deep-blue">{person.name}</p>
          <p className="text-[12px] text-[#64748B]">{person.title}</p>
          <p className="text-[12px] text-[#98A2B3]">
            {person.company}
            {person.country ? ` · ${person.country}` : ''}
          </p>
        </div>
      </div>
      {variant === 'reporter' && person.badge ? (
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-primary">
          {person.badge}
        </span>
      ) : null}
      {variant === 'reported' ? (
        <StatusBadge status="Active" label="Active" />
      ) : null}
    </div>

    {variant === 'reported' ? (
      <div className="border-b border-[#E4E7EC] px-5 py-3">
        <span className="inline-flex rounded-md bg-pink-secondary px-2.5 py-1 text-[11px] font-semibold text-pink-light">
          {person.totalReports} Reports
        </span>
        <p className="mt-2 text-[12px] text-[#64748B]">
          {person.totalReports} Total Reports + {person.warnings ?? 0} Warnings
        </p>
      </div>
    ) : null}

    <div className="flex flex-col gap-2 p-4 sm:flex-row">
      {variant === 'reporter' ? (
        <button
          type="button"
          onClick={onProfile}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-deep-blue hover:bg-[#F9FAFB]"
        >
          <User className="h-4 w-4" />
          View Reporter Profile
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onProfile}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-[13px] font-semibold text-deep-blue hover:bg-[#F9FAFB]"
          >
            User Profile
          </button>
          <button
            type="button"
            onClick={onAudit}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-pink-secondary bg-pink-secondary/20 px-4 py-2.5 text-[13px] font-semibold text-pink-light hover:bg-pink-secondary/40"
          >
            <History className="h-4 w-4" />
            Audit History
          </button>
        </>
      )}
    </div>
  </Card>
);

const AdminReportDetailView = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const report = getAdminReportById(reportId);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!report) return <Navigate to="/admin/reports" replace />;

  const reportedUserWithCases = {
    ...report.reportedUser,
    moderationCases: report.moderationCases,
  };

  return (
    <PanelPage>
      <Link
        to="/admin/reports"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Reports
      </Link>

      <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-5 py-4">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#EA580C]">
          Report reason: {report.reason}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[#9A3412]">
          &ldquo;{report.reasonDetail}&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PersonCard
          person={report.reporter}
          variant="reporter"
          onProfile={() => {}}
        />
        <PersonCard
          person={report.reportedUser}
          variant="reported"
          onProfile={() => navigate('/admin/users')}
          onAudit={() => setHistoryOpen(true)}
        />
      </div>

      {report.post ? (
        <FeedPost post={report.post} onReport={() => {}} />
      ) : null}

      <Card className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-[15px] font-bold text-deep-blue">Admin moderation decision actions</h2>
            <p className="text-[12px] text-[#64748B]">
              Choose appropriate measure based on evidence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <ModerationAction icon={Trash2} label="Remove Content" tone="red" onClick={() => {}} />
          <ModerationAction icon={AlertTriangle} label="Warn User" tone="amber" onClick={() => {}} />
          <ModerationAction
            icon={UserX}
            label="Suspend User"
            tone="orange"
            onClick={() => setRejectOpen(true)}
          />
          <ModerationAction icon={Ban} label="Ban User" tone="pink" onClick={() => setRejectOpen(true)} />
          <ModerationAction
            icon={CheckCircle2}
            label="Mark Resolved"
            tone="green"
            onClick={() => navigate('/admin/reports')}
          />
        </div>
      </Card>

      <ModerationHistoryModal
        open={historyOpen}
        user={reportedUserWithCases}
        onClose={() => setHistoryOpen(false)}
        onOpenCase={() => setHistoryOpen(false)}
      />

      <ReasonModal
        open={rejectOpen}
        title="Rejected User"
        submitLabel="Suspend"
        placeholder="Why rejected this advertisement"
        onClose={() => setRejectOpen(false)}
        onConfirm={() => {}}
      />
    </PanelPage>
  );
};

export default AdminReportDetailView;
