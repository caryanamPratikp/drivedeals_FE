import React from 'react';
import { InfoTooltip } from './InfoTooltip';

export const StatusBadge = ({ status = 'ACTIVE', className = '', showInfo = false }) => {
  const getBadgeConfig = () => {
    switch (status) {
      // Group Statuses
      case 'COLLECTING_INTEREST':
      case 'FORMATION':
        return {
          label: 'Building Group',
          bg: 'bg-white/5 text-[#A1A1AA] border-white/10',
          infoTitle: 'Building the group',
          infoDesc: 'Buyers are pooling demand on this vehicle. Fleet quotations requested as group fills.'
        };
      case 'REQUESTING_QUOTES':
      case 'OPEN_FOR_QUOTES':
        return {
          label: 'Requesting Quotes',
          bg: 'bg-[#ED1725]/15 text-[#ED1725] border-[#ED1725]/30 font-bold',
          infoTitle: 'Requesting dealer offers',
          infoDesc: 'Dealer fleet offers are being requested from authorized regional dealerships.'
        };
      case 'UNDER_REVIEW':
      case 'OFFERS_AVAILABLE':
        return {
          label: 'Offers Under Review',
          bg: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30 font-bold',
          infoTitle: 'Offers ready to compare',
          infoDesc: 'Verified dealerships published itemized offers for this group.'
        };
      case 'CLOSED':
        return {
          label: 'Group Closed',
          bg: 'bg-white/5 text-[#71717A] border-white/10',
          infoTitle: 'Group closed',
          infoDesc: 'This allocation cycle has concluded.'
        };
      case 'CANCELLED':
        return {
          label: 'Group Cancelled',
          bg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
          infoTitle: 'Group cancelled',
          infoDesc: 'Target quota not met within expiration window.'
        };

      // Dealer Verification Statuses
      case 'VERIFIED':
        return {
          label: 'Verified Dealer',
          bg: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30 font-bold',
          infoTitle: 'Verified Dealership',
          infoDesc: 'Vetted by DriveDeals for authorized OEM franchise and physical showroom operations.'
        };
      case 'PENDING':
      case 'PENDING_VERIFICATION':
        return {
          label: 'Pending Verification',
          bg: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
        };
      case 'SUSPENDED':
        return {
          label: 'Suspended',
          bg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 font-bold'
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          bg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
        };

      // Quotation Statuses
      case 'PUBLISHED':
        return {
          label: 'Active Offer',
          bg: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30 font-bold'
        };
      case 'SUPERSEDED':
        return {
          label: 'Updated by Dealer',
          bg: 'bg-white/5 text-[#71717A] border-white/10'
        };
      case 'EXPIRED':
        return {
          label: 'Offer Expired',
          bg: 'bg-white/5 text-[#71717A] border-white/10'
        };
      case 'DRAFT':
        return {
          label: 'Draft Quote',
          bg: 'bg-white/5 text-[#A1A1AA] border-white/10 border-dashed'
        };
      case 'WITHDRAWN':
        return {
          label: 'Withdrawn',
          bg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
        };

      // Lead Statuses
      case 'DEMO_DELIVERED':
        return {
          label: 'Showroom Connected',
          bg: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30 font-bold'
        };
      case 'CONTACTED':
        return {
          label: 'Showroom Called You',
          bg: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30 font-bold'
        };
      case 'TEST_DRIVE_SCHEDULED':
        return {
          label: 'Test Drive Booked',
          bg: 'bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/30 font-bold'
        };
      case 'TEST_DRIVE_COMPLETED':
        return {
          label: 'Test Drive Done',
          bg: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30 font-bold'
        };
      case 'BOOKING_IN_PROGRESS':
      case 'BOOKED':
        return {
          label: 'Car Booked',
          bg: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30 font-bold'
        };
      case 'PURCHASED':
      case 'DELIVERED':
        return {
          label: 'Car Delivered 🎉',
          bg: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50 font-black'
        };
      case 'DISPUTED':
        return {
          label: 'Under Review',
          bg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 font-bold'
        };
      case 'REVOKED':
        return {
          label: 'Sharing Stopped',
          bg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
        };
      case 'LOST':
        return {
          label: 'Closed Without Purchase',
          bg: 'bg-white/5 text-[#71717A] border-white/10'
        };

      default:
        return {
          label: (status || 'UNKNOWN').replace(/_/g, ' '),
          bg: 'bg-white/5 text-[#A1A1AA] border-white/10',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className="inline-flex items-center gap-1.5 align-middle select-none">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border tracking-wide font-bold shadow-sm ${config.bg} ${className}`}
      >
        {config.label}
      </span>
      {showInfo && config.infoTitle && (
        <InfoTooltip title={config.infoTitle} content={config.infoDesc} iconSize={12} />
      )}
    </span>
  );
};
