import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layout Shells
import { PublicLayout } from './components/layout/PublicLayout';
import { BuyerLayout } from './components/layout/BuyerLayout';
import { DealerLayout } from './components/layout/DealerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public pages
import { LandingPage } from './features/public/LandingPage';
import { HowItWorksPage } from './features/public/HowItWorksPage';
import { CarsPage } from './features/public/CarsPage';
import { CarDetailPage } from './features/public/CarDetailPage';
import { GroupsPage } from './features/public/GroupsPage';
import { AuthPage } from './features/public/AuthPage';
import { PrivacyPage } from './features/public/PrivacyPage';
import { TermsPage } from './features/public/TermsPage';
import { NotFoundPage } from './features/public/NotFoundPage';

// Buyer pages
import { BuyerDashboard } from './features/buyer/BuyerDashboard';
import { BuyerGroupsPage } from './features/buyer/BuyerGroupsPage';
import { BuyerGroupDetailPage } from './features/buyer/BuyerGroupDetailPage';
import { OfferComparePage } from './features/buyer/OfferComparePage';
import { OfferDetailPage } from './features/buyer/OfferDetailPage';
import { BuyerLeadsPage } from './features/buyer/BuyerLeadsPage';
import { BuyerLeadDetailPage } from './features/buyer/BuyerLeadDetailPage';
import { BuyerConsentsPage } from './features/buyer/BuyerConsentsPage';
import { BuyerProfilePage } from './features/buyer/BuyerProfilePage';

// Dealer pages
import { DealerDashboard } from './features/dealer/DealerDashboard';
import { DealerQuoteRequestsPage } from './features/dealer/DealerQuoteRequestsPage';
import { DealerQuoteRequestDetailPage } from './features/dealer/DealerQuoteRequestDetailPage';
import { DealerOffersPage } from './features/dealer/DealerOffersPage';
import { DealerOfferDetailPage } from './features/dealer/DealerOfferDetailPage';
import { DealerLeadsPage } from './features/dealer/DealerLeadsPage';
import { DealerLeadDetailPage } from './features/dealer/DealerLeadDetailPage';
import { DealerProfilePage } from './features/dealer/DealerProfilePage';

// Admin pages
import { AdminDashboard } from './features/admin/AdminDashboard';
import { AdminDealersPage } from './features/admin/AdminDealersPage';
import { AdminGroupsPage } from './features/admin/AdminGroupsPage';
import { AdminModerationPage } from './features/admin/AdminModerationPage';
import { AdminLeadsPage } from './features/admin/AdminLeadsPage';
import { AdminAuditPage } from './features/admin/AdminAuditPage';
import { AdminCataloguePage } from './features/admin/AdminCataloguePage';

export const router = createBrowserRouter([
  // 1. PUBLIC & MARKETING ROUTES
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'cars', element: <CarsPage /> },
      { path: 'cars/:carId', element: <CarDetailPage /> },
      { path: 'groups', element: <GroupsPage /> },
      { path: 'groups/:groupId', element: <BuyerGroupDetailPage /> },
      { path: 'login', element: <AuthPage defaultTab="login" /> },
      { path: 'register', element: <AuthPage defaultTab="register" /> },
      { path: 'signin', element: <AuthPage defaultTab="login" /> },
      { path: 'signup', element: <AuthPage defaultTab="register" /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
    ],
  },

  // 2. BUYER PORTAL ROUTES (Secured)
  {
    path: '/buyer',
    element: (
      <ProtectedRoute allowedRoles={['BUYER']}>
        <BuyerLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { path: 'dashboard', element: <BuyerDashboard /> },
      { path: 'cars', element: <CarsPage /> },
      { path: 'groups', element: <BuyerGroupsPage /> },
      { path: 'groups/:groupId', element: <BuyerGroupDetailPage /> },
      { path: 'offers', element: <OfferComparePage /> },
      { path: 'offers/:offerId', element: <OfferDetailPage /> },
      { path: 'leads', element: <BuyerLeadsPage /> },
      { path: 'leads/:leadId', element: <BuyerLeadDetailPage /> },
      { path: 'consents', element: <BuyerConsentsPage /> },
      { path: 'profile', element: <BuyerProfilePage /> },
    ],
  },

  // 3. DEALER PORTAL ROUTES (Secured)
  {
    path: '/dealer',
    element: (
      <ProtectedRoute allowedRoles={['DEALER']}>
        <DealerLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { path: 'dashboard', element: <DealerDashboard /> },
      { path: 'quote-requests', element: <DealerQuoteRequestsPage /> },
      { path: 'quote-requests/:requestId', element: <DealerQuoteRequestDetailPage /> },
      { path: 'offers', element: <DealerOffersPage /> },
      { path: 'offers/:offerId', element: <DealerOfferDetailPage /> },
      { path: 'leads', element: <DealerLeadsPage /> },
      { path: 'leads/:leadId', element: <DealerLeadDetailPage /> },
      { path: 'profile', element: <DealerProfilePage /> },
    ],
  },

  // 4. ADMIN CONSOLE ROUTES (Secured)
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'dealers', element: <AdminDealersPage /> },
      { path: 'groups', element: <AdminGroupsPage /> },
      { path: 'moderation', element: <AdminModerationPage /> },
      { path: 'leads', element: <AdminLeadsPage /> },
      { path: 'audit', element: <AdminAuditPage /> },
      { path: 'catalogue', element: <AdminCataloguePage /> },
    ],
  },

  // 5. CATCH-ALL 404 ROUTE
  {
    path: '*',
    element: <NotFoundPage />,
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});
