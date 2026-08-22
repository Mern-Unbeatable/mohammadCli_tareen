import { createBrowserRouter } from 'react-router';
import RootLayout from '../layout/RootLayout';
import AuthLayout from '../layout/AuthLayout';
import HomeView from '../pages/public/public_Home/HomeView';
import LoginView from '../pages/auth/LoginView';
import RegisterView from '../pages/auth/RegisterView';
import NotFound from '../pages/error/NotFound';
import FeedLayout from '../layout/FeedLayout';
import FeedView from '../pages/feed/FeedView';
import ContactsView from '../pages/contacts/ContactsView';
import ContactProfileView from '../pages/contacts/ContactProfileView';
import MarketplaceView from '../pages/marketplace/MarketplaceView';
import SavedListingsView from '../pages/marketplace/SavedListingsView';
import MyListingsView from '../pages/marketplace/MyListingsView';
import CreateListingView from '../pages/marketplace/CreateListingView';
import ListingDetailView from '../pages/marketplace/ListingDetailView';
import RecruitmentView from '../pages/recruitment/RecruitmentView';
import MyJobsView from '../pages/recruitment/MyJobsView';
import PostJobView from '../pages/recruitment/PostJobView';
import JobDetailView from '../pages/recruitment/JobDetailView';
import GeneralView from '../pages/general/GeneralView';
import MyGeneralPostsView from '../pages/general/MyGeneralPostsView';
import GeneralPostDetailView from '../pages/general/GeneralPostDetailView';
import MessagesView from '../pages/messages/MessagesView';
import BlogsView from '../pages/blogs/BlogsView';
import BlogDetailView from '../pages/blogs/BlogDetailView';
import NotificationsView from '../pages/notifications/NotificationsView';
import SubscriptionView from '../pages/subscription/SubscriptionView';
import ProfileView from '../pages/profile/ProfileView';
import ProfileSetupView from '../pages/profile/ProfileSetupView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginView />,
      },
    ],
  },
  {
    path: '/join',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <RegisterView />,
      },
    ],
  },
  {
    element: <FeedLayout />,
    children: [
      {
        path: '/feed',
        element: <FeedView />,
      },
      {
        path: '/contacts',
        element: <ContactsView />,
      },
      {
        path: '/contacts/:contactId',
        element: <ContactProfileView />,
      },
      {
        path: '/marketplace',
        element: <MarketplaceView />,
      },
      {
        path: '/marketplace/saved',
        element: <SavedListingsView />,
      },
      {
        path: '/marketplace/my-listings',
        element: <MyListingsView />,
      },
      {
        path: '/marketplace/create',
        element: <CreateListingView />,
      },
      {
        path: '/marketplace/:listingId',
        element: <ListingDetailView />,
      },
      {
        path: '/recruitment',
        element: <RecruitmentView />,
      },
      {
        path: '/recruitment/my-jobs',
        element: <MyJobsView />,
      },
      {
        path: '/recruitment/create',
        element: <PostJobView />,
      },
      {
        path: '/recruitment/:jobId',
        element: <JobDetailView />,
      },
      {
        path: '/general',
        element: <GeneralView />,
      },
      {
        path: '/general/my-posts',
        element: <MyGeneralPostsView />,
      },
      {
        path: '/general/:postId',
        element: <GeneralPostDetailView />,
      },
      {
        path: '/messages',
        element: <MessagesView />,
      },
      {
        path: '/blogs',
        element: <BlogsView />,
      },
      {
        path: '/blogs/:slug',
        element: <BlogDetailView />,
      },
      {
        path: '/notifications',
        element: <NotificationsView />,
      },
      {
        path: '/subscription',
        element: <SubscriptionView />,
      },
      {
        path: '/profile',
        element: <ProfileView />,
      },
      {
        path: '/profile/edit',
        element: <ProfileSetupView />,
      },
    ],
  },
]);
