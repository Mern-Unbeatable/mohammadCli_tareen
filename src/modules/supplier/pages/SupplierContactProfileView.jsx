import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import ContactProfilePageContent from '@/components/data-display/ContactProfilePageContent/ContactProfilePageContent';
import ReportPostModal from '@/modules/user/components/feed/ReportPostModal';
import { feedPosts } from '@/modules/user/data/dashboard';
import { getContactById } from '@/modules/user/data/contacts';
import PanelPage from '@/shared/layout/PanelLayout/PanelPage';
import NotFound from '@/shared/pages/NotFound';

const SupplierContactProfileView = () => {
  const { contactId } = useParams();
  const contact = getContactById(contactId);
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState(false);
  const [reportPost, setReportPost] = useState(null);

  const activity = useMemo(
    () => feedPosts.filter((post) => contact?.postIds.includes(post.id)),
    [contact]
  );

  if (!contact) return <NotFound />;

  const handleConnect = () => {
    if (connected || pending) return;
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setConnected(true);
    }, 900);
  };

  return (
    <>
      <PanelPage>
        <Link
          to="/supplier/contacts"
          className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to directory
        </Link>

        <ContactProfilePageContent
          contact={contact}
          posts={activity}
          onReport={setReportPost}
          connected={connected}
          pending={pending}
          onConnect={handleConnect}
          messageHref="/supplier/messages"
        />
      </PanelPage>

      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
    </>
  );
};

export default SupplierContactProfileView;
