import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import ContactProfilePageContent from '@/components/data-display/ContactProfilePageContent/ContactProfilePageContent';
import ReportPostModal from '@/modules/user/components/feed/ReportPostModal';
import {
  fetchContactDetails,
  requestContactConnection,
  clearContactsError,
  clearSelectedContact,
  toContactProfileModel,
} from '@/features/user/contacts';
import NotFound from '@/shared/pages/NotFound';

const ContactProfileView = () => {
  const { contactId } = useParams();
  const dispatch = useDispatch();
  const {
    selectedContact,
    selectedContactLoading,
    connectingId,
    error,
  } = useSelector((state) => state.userContacts);

  const [reportPost, setReportPost] = useState(null);
  const [notFoundId, setNotFoundId] = useState(null);

  useEffect(() => {
    if (!contactId) return undefined;
    dispatch(clearContactsError());
    dispatch(fetchContactDetails(contactId)).then((result) => {
      if (fetchContactDetails.rejected.match(result)) {
        setNotFoundId(contactId);
      }
    });
    return () => {
      dispatch(clearSelectedContact());
    };
  }, [dispatch, contactId]);

  useEffect(() => {
    if (error && !selectedContactLoading) toast.error(error);
  }, [error, selectedContactLoading]);

  if (notFoundId === contactId) return <NotFound />;

  if (selectedContactLoading || (!selectedContact && !error)) {
    return (
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-[760px]">
          <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <span className="text-[14px] text-[#64748B]">Loading profile…</span>
          </div>
        </Container>
      </main>
    );
  }

  const contact = toContactProfileModel(selectedContact);
  if (!contact) return <NotFound />;

  const handleConnect = async () => {
    if (contact.connected || contact.pending || connectingId === contact.id) {
      return;
    }
    const result = await dispatch(requestContactConnection(contact.id));
    if (requestContactConnection.fulfilled.match(result)) {
      toast.success('Connection request sent');
    }
  };

  const handleReport = (post) => {
    setReportPost({
      ...post,
      targetType: 'USER',
      userId: contact.id,
      author: {
        ...(post?.author || {}),
        id: contact.id,
        name: contact.name,
      },
      targetSnippet: post?.content || contact.name,
    });
  };

  return (
    <>
      <main className="pt-6 pb-5 sm:pt-8 sm:pb-8">
        <Container className="max-w-[760px]">
          <Link
            to="/contacts"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to directory
          </Link>

          <ContactProfilePageContent
            contact={contact}
            posts={[]}
            onReport={handleReport}
            connected={contact.connected}
            pending={contact.pending || connectingId === contact.id}
            onConnect={handleConnect}
            messageHref="/messages"
          />
        </Container>
      </main>

      <ReportPostModal
        open={Boolean(reportPost)}
        post={reportPost}
        onClose={() => setReportPost(null)}
      />
    </>
  );
};

export default ContactProfileView;
