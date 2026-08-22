import { Navigate } from 'react-router';
import UserDashboardLayout from '@/modules/user/layout/UserDashboardLayout';
import FeedView from '@/modules/user/pages/feed/FeedView';
import ContactsView from '@/modules/user/pages/contacts/ContactsView';
import ContactProfileView from '@/modules/user/pages/contacts/ContactProfileView';
import MarketplaceView from '@/modules/user/pages/marketplace/MarketplaceView';
import SavedListingsView from '@/modules/user/pages/marketplace/SavedListingsView';
import MyListingsView from '@/modules/user/pages/marketplace/MyListingsView';
import CreateListingView from '@/modules/user/pages/marketplace/CreateListingView';
import ListingDetailView from '@/modules/user/pages/marketplace/ListingDetailView';
import RecruitmentView from '@/modules/user/pages/recruitment/RecruitmentView';
import MyJobsView from '@/modules/user/pages/recruitment/MyJobsView';
import PostJobView from '@/modules/user/pages/recruitment/PostJobView';
import JobDetailView from '@/modules/user/pages/recruitment/JobDetailView';
import GeneralView from '@/modules/user/pages/general/GeneralView';
import MyGeneralPostsView from '@/modules/user/pages/general/MyGeneralPostsView';
import GeneralPostDetailView from '@/modules/user/pages/general/GeneralPostDetailView';
import MessagesView from '@/modules/user/pages/messages/MessagesView';
import BlogsView from '@/modules/user/pages/blogs/BlogsView';
import BlogDetailView from '@/modules/user/pages/blogs/BlogDetailView';
import NotificationsView from '@/modules/user/pages/notifications/NotificationsView';
import SubscriptionView from '@/modules/user/pages/subscription/SubscriptionView';
import ProfileView from '@/modules/user/pages/profile/ProfileView';
import ProfileSetupView from '@/modules/user/pages/profile/ProfileSetupView';

export const userRoutes = {
  element: <UserDashboardLayout />,
  children: [
    { path: '/feed', element: <FeedView /> },
    { path: '/contacts', element: <ContactsView /> },
    { path: '/contacts/:contactId', element: <ContactProfileView /> },
    { path: '/marketplace', element: <MarketplaceView /> },
    { path: '/marketplace/saved', element: <SavedListingsView /> },
    { path: '/marketplace/my-listings', element: <MyListingsView /> },
    { path: '/marketplace/create', element: <CreateListingView /> },
    { path: '/marketplace/:listingId', element: <ListingDetailView /> },
    { path: '/recruitment', element: <RecruitmentView /> },
    { path: '/recruitment/my-jobs', element: <MyJobsView /> },
    { path: '/recruitment/create', element: <PostJobView /> },
    { path: '/recruitment/:jobId', element: <JobDetailView /> },
    { path: '/general', element: <GeneralView /> },
    { path: '/general/my-posts', element: <MyGeneralPostsView /> },
    { path: '/general/:postId', element: <GeneralPostDetailView /> },
    { path: '/messages', element: <MessagesView /> },
    { path: '/blogs', element: <BlogsView /> },
    { path: '/blogs/:slug', element: <BlogDetailView /> },
    { path: '/notifications', element: <NotificationsView /> },
    { path: '/subscription', element: <SubscriptionView /> },
    { path: '/profile', element: <ProfileView /> },
    { path: '/profile/edit', element: <ProfileSetupView /> },
    { path: '/dashboard', element: <Navigate to="/feed" replace /> },
  ],
};
