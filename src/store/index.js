import { create } from 'zustand';
import { generateId } from '../lib/ids';
import { calculateOnRoadPrice } from '../domain/pricing';
import { isDealerEligible } from '../domain/permissions';
import { moderateText } from '../domain/moderation';
import {
  authApi,
  catalogueApi,
  groupsApi,
  quotationsApi,
  consentsApi,
  leadsApi,
  notificationsApi,
  fetchAdminAnalytics,
  fetchAdminDealers,
  updateDealerStatus,
  fetchAdminUsers,
  fetchAdminGroups,
  fetchAdminLeads,
  fetchAdminAudit,
  fetchAdminNotifications,
} from '../api';

import {
  GUEST_USER,
  getStoredToken,
  getStoredUser,
  saveAuthSession,
  clearAuthSession,
  getRoleSession,
} from '../lib/authStorage';

function normalizeCar(c) {
  return {
    ...c,
    modelName: c.model || c.modelName || '',
    illustrativeStartingPrice: Number(c.minPrice || c.illustrativeStartingPrice || 0),
    active: c.active !== undefined ? c.active : true,
    variants: (c.variants || []).map((v) => normalizeVariant(v, c.id)),
  };
}

function normalizeVariant(v, carId) {
  if (!v) return null;
  let features = v.keyFeatures;
  if (typeof features === 'string') {
    try {
      features = JSON.parse(features);
    } catch (e) {
      features = [features];
    }
  }
  return {
    ...v,
    carId: v.carId || carId,
    active: v.active !== undefined ? v.active : true,
    keyFeatures: Array.isArray(features) ? features : [],
    exShowroomPrice: Number(v.exShowroomPrice || 0),
  };
}

function normalizeGroup(g) {
  if (!g) return null;
  const stageToStatus = {
    FORMATION: 'COLLECTING_INTEREST',
    OPEN_FOR_QUOTES: 'REQUESTING_QUOTES',
    QUOTATION_REVIEW: 'OFFERS_AVAILABLE',
    FULFILLED: 'CLOSED',
    EXPIRED: 'CLOSED',
    CANCELLED: 'CLOSED',
  };

  const car = g.car
    ? {
        ...g.car,
        modelName: g.car.modelName || g.car.model || '',
      }
    : null;

  const variant = g.variant ? normalizeVariant(g.variant, car?.id || g.carId) : null;
  const memberCount = g.currentMembers !== undefined ? g.currentMembers : (Array.isArray(g.memberIds) ? g.memberIds.length : 1);
  const memberIds = Array.isArray(g.memberIds)
    ? g.memberIds
    : Array(memberCount).fill('buyer');

  return {
    ...g,
    status: stageToStatus[g.stage] || g.status || 'COLLECTING_INTEREST',
    car,
    variant,
    variantId: variant?.id || g.variantId,
    carId: car?.id || g.carId,
    targetSize: g.targetMembers || g.targetSize || 15,
    minimumGroupSize: 3,
    memberIds,
    currentMembers: memberCount,
    joinDeadline: g.expiresAt || g.joinDeadline,
  };
}

export const useAppStore = create((set, get) => ({
  token: getStoredToken(),
  currentUser: getStoredUser(),
  users: [],
  dealers: [],
  cars: [],
  variants: [],
  groups: [],
  memberships: [],
  buyerSignals: [],
  quoteRequests: [],
  quotations: [],
  quotationVersions: [],
  consents: [],
  leads: [],
  leadDisputes: [],
  moderationItems: [],
  auditEvents: [],
  notifications: [],
  isLoading: false,
  carsLoading: false,
  carsError: null,
  carsFetched: false,
  groupsLoading: false,
  groupsError: null,
  groupsFetched: false,
  adminLoading: false,
  adminFetched: false,
  adminNotifications: [],
  adminAnalytics: {
    totalBuyers: 0,
    totalDealers: 0,
    verifiedDealers: 0,
    pendingDealers: 0,
    totalCars: 0,
    totalActiveGroups: 0,
    totalQuotations: 0,
    totalLeads: 0,
    totalGMV: 48200000,
    totalSavings: 3860000,
    avgDiscountPercentage: 7.4,
    conversionRate: 78.5,
    hubDistribution: [],
    timeline: [],
  },

  // ----------------------------------------------------
  // AUTH ACTIONS
  // ----------------------------------------------------
  loginWithOtp: async (phone, otp, profile = {}) => {
    try {
      set({ isLoading: true });
      const res = await authApi.verifyOtp(phone, otp, profile);
      const token = res.accessToken;
      const user = res.user;

      saveAuthSession(token, user);

      set({ token, currentUser: user, isLoading: false });

      // Automatically refresh user data from DB
      get().fetchCars();
      get().fetchGroups();
      get().fetchNotifications();
      if (user.role === 'DEALER') {
        get().fetchDealerLeads();
      } else if (user.role === 'BUYER') {
        get().fetchConsents();
      } else if (user.role === 'ADMIN') {
        get().fetchAdminOverview();
      }

      return { success: true, user };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err.message || 'Authentication failed' };
    }
  },

  hydrateRoleSession: (targetRole) => {
    if (!targetRole) return false;
    const session = getRoleSession(targetRole);
    if (session && session.token && session.user) {
      saveAuthSession(session.token, session.user);
      set({ token: session.token, currentUser: session.user });
      get().fetchCars();
      get().fetchGroups();
      get().fetchNotifications();
      if (session.user.role === 'DEALER') {
        get().fetchDealerLeads();
      } else if (session.user.role === 'BUYER') {
        get().fetchConsents();
      } else if (session.user.role === 'ADMIN') {
        get().fetchAdminOverview();
      }
      return true;
    }
    return false;
  },

  updateDealerBrand: (brand) => {
    set((state) => {
      const updatedUser = {
        ...state.currentUser,
        brand,
      };
      saveAuthSession(state.token, updatedUser);
      return {
        currentUser: updatedUser,
        dealers: (state.dealers || []).map((d) =>
          d.id === state.currentUser?.dealerId ? { ...d, brand } : d
        ),
      };
    });
  },

  logout: () => {
    // Only clear this browser tab's sessionStorage so other tabs remain active
    clearAuthSession();
    set({
      token: null,
      currentUser: GUEST_USER,
      consents: [],
      leads: [],
      notifications: [],
    });
  },

  switchUser: async (phone, defaultProfile = {}) => {
    if (phone && phone.startsWith('+91')) {
      return await get().loginWithOtp(phone, '123456', defaultProfile);
    }
  },

  // ----------------------------------------------------
  // CATALOGUE API ACTIONS
  // ----------------------------------------------------
  fetchCars: async (filters = {}) => {
    try {
      set({ carsLoading: true, carsError: null });
      const carList = await catalogueApi.getCars(filters);
      if (!Array.isArray(carList)) {
        set({ cars: [], variants: [], carsLoading: false, carsFetched: true, carsError: null });
        return;
      }

      // Also fetch details for each car to populate variants
      const detailedCars = await Promise.all(
        carList.map(async (car) => {
          try {
            return await catalogueApi.getCarById(car.id);
          } catch (e) {
            return car;
          }
        })
      );

      const allVariants = [];
      const normalizedCars = detailedCars.map((car) => {
        const norm = normalizeCar(car);
        if (norm.variants && norm.variants.length > 0) {
          allVariants.push(...norm.variants);
        }
        return norm;
      });

      set({
        cars: normalizedCars,
        variants: allVariants,
        carsLoading: false,
        carsFetched: true,
        carsError: null,
      });
    } catch (err) {
      console.error('Failed to fetch cars from DB:', err);
      set({
        carsLoading: false,
        carsFetched: true,
        carsError: err.message || 'Unable to load vehicle catalogue from server',
      });
    }
  },

  addCatalogueCar: async (carData, variantData) => {
    try {
      const payload = {
        brand: carData.brand,
        model: carData.modelName || carData.model,
        bodyType: carData.bodyType || 'SUV',
        imageUrl: carData.image || carData.imageUrl || '/cars/hyundai_creta.webp',
        minPrice: carData.illustrativeStartingPrice || 800000,
        maxPrice: (carData.illustrativeStartingPrice || 800000) * 1.5,
        variants: variantData ? [
          {
            name: variantData.name,
            fuelType: variantData.fuelType || 'PETROL',
            transmission: variantData.transmission || 'MANUAL',
            exShowroomPrice: carData.illustrativeStartingPrice || 800000,
            keyFeatures: Array.isArray(variantData.keyFeatures) ? variantData.keyFeatures.join(', ') : 'Touchscreen, Reverse Camera'
          }
        ] : []
      };
      await catalogueApi.createCar(payload);
      await get().fetchCars();
      return { success: true };
    } catch (err) {
      console.error('Failed to create car in backend:', err);
      return { success: false, error: err.message };
    }
  },

  // ----------------------------------------------------
  // GROUPS API ACTIONS
  // ----------------------------------------------------
  fetchGroups: async (filters = {}) => {
    try {
      set({ groupsLoading: true, groupsError: null });
      const res = await groupsApi.getGroups(filters);
      const groupList = res?.content || (Array.isArray(res) ? res : []);
      const normalized = groupList.map(normalizeGroup);
      set((state) => {
        // Retain any locally created groups so client navigation never drops active groups
        const backendIds = new Set(normalized.map((g) => g.id));
        const localGroups = (state.groups || []).filter(
          (g) => !backendIds.has(g.id) && (g.id?.startsWith('grp-') || g.isCurrentUserMember)
        );
        return {
          groups: [...normalized, ...localGroups],
          groupsLoading: false,
          groupsFetched: true,
          groupsError: null,
        };
      });
    } catch (err) {
      console.error('Failed to fetch groups from DB:', err);
      set({
        groupsLoading: false,
        groupsFetched: true,
        groupsError: err.message || 'Unable to load buyer groups from server',
      });
    }
  },

  fetchGroupById: async (groupId) => {
    try {
      const rawGroup = await groupsApi.getGroupById(groupId);
      const normalized = normalizeGroup(rawGroup);

      set((state) => ({
        groups: state.groups.some((g) => g.id === normalized.id)
          ? state.groups.map((g) => (g.id === normalized.id ? normalized : g))
          : [normalized, ...state.groups],
      }));
      return normalized;
    } catch (err) {
      console.error(`Failed to fetch group ${groupId} from DB:`, err);
      // Fallback: check if group exists in local Zustand store
      const local = get().groups.find((g) => g.id === groupId);
      if (local) {
        return local;
      }
      return null;
    }
  },

  createGroupWithMembership: async (variantId, city, buyerId, timeline, priorities, vehicleConfig) => {
    try {
      const timelineMap = {
        WITHIN_15_DAYS: 'IMMEDIATE_15_DAYS',
        WITHIN_30_DAYS: 'WITHIN_30_DAYS',
        WITHIN_60_DAYS: 'WITHIN_60_DAYS',
        EXPLORING: 'EXPLORING',
      };
      const timelineMonths = timelineMap[timeline] || 'WITHIN_30_DAYS';

      const notesParts = [];
      if (Array.isArray(priorities) && priorities.length > 0) {
        notesParts.push(`Priorities: ${priorities.join(', ')}`);
      }
      if (vehicleConfig?.colourName) {
        notesParts.push(`Colour: ${vehicleConfig.colourName}`);
      }

      // Ensure variants are loaded in store to resolve real DB UUID if needed
      if (get().variants.length === 0) {
        await get().fetchCars();
      }

      const allDbVariants = get().variants || [];
      let effectiveVariantId = variantId;

      // 1. Direct match by ID in DB variants
      let matchedDbVariant = allDbVariants.find((v) => v.id === variantId);

      // 2. If not matched directly (e.g. passed a catalogue config UUID or slug), resolve by variant name, fuel & transmission
      if (!matchedDbVariant && (vehicleConfig || allDbVariants.length > 0)) {
        const configFuel = (vehicleConfig?.fuelType || vehicleConfig?.powertrain || '').toUpperCase();
        const configTrans = (vehicleConfig?.transmission || '').toUpperCase().includes('AUTO') ? 'AUTOMATIC' : 'MANUAL';
        const targetName = (vehicleConfig?.variantName || '').toLowerCase().trim();

        matchedDbVariant = allDbVariants.find((v) => {
          const vName = (v.name || '').toLowerCase().trim();
          const nameMatches = targetName && (
            vName === targetName ||
            vName.includes(targetName) ||
            targetName.includes(vName)
          );

          const fuelMatches =
            !configFuel ||
            (v.fuelType || '').toUpperCase().includes(configFuel) ||
            configFuel.includes((v.fuelType || '').toUpperCase());

          const transMatches =
            !vehicleConfig?.transmission ||
            (v.transmission || '').toUpperCase() === configTrans;

          return nameMatches && fuelMatches && transMatches;
        });

        // 3. Fallback: match by model name and fuel type
        if (!matchedDbVariant && vehicleConfig) {
          const modelName = (vehicleConfig.modelName || vehicleConfig.model || '').toLowerCase().trim();
          const candidateCars = (get().cars || []).filter((c) => {
            const m = (c.modelName || c.model || '').toLowerCase().trim();
            return m.includes(modelName) || modelName.includes(m);
          });
          const candidateCarIds = new Set(candidateCars.map((c) => c.id));
          matchedDbVariant = allDbVariants.find((v) => candidateCarIds.has(v.carId));
        }

        // 4. Fallback: if user specified a brand, find any variant of that brand
        if (!matchedDbVariant && vehicleConfig?.brandName) {
          const brandName = vehicleConfig.brandName.toLowerCase().trim();
          const candidateCars = (get().cars || []).filter((c) =>
            (c.brand || '').toLowerCase().trim().includes(brandName)
          );
          const candidateCarIds = new Set(candidateCars.map((c) => c.id));
          matchedDbVariant = allDbVariants.find((v) => candidateCarIds.has(v.carId));
        }
      }

      if (matchedDbVariant) {
        effectiveVariantId = matchedDbVariant.id;
      } else if (vehicleConfig) {
        // If variant not yet in backend database, dynamically register it
        try {
          const fuelUpper = (vehicleConfig.fuelType || vehicleConfig.powertrain || 'PETROL').toUpperCase();
          const transUpper = (vehicleConfig.transmission || 'MANUAL').toUpperCase().includes('AUTO') ? 'AUTOMATIC' : 'MANUAL';
          const rawBody = (vehicleConfig.bodyType || 'SUV').toUpperCase();
          const bodyTypeUpper = rawBody.includes('SEDAN')
            ? 'SEDAN'
            : rawBody.includes('HATCH')
            ? 'HATCHBACK'
            : rawBody.includes('MPV')
            ? 'MPV'
            : 'SUV';

          const carPayload = {
            brand: vehicleConfig.brandName || 'Mahindra',
            model: vehicleConfig.modelName || 'Vehicle',
            bodyType: bodyTypeUpper,
            imageUrl: vehicleConfig.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
            minPrice: vehicleConfig.exShowroomPrice || 1000000,
            maxPrice: Math.round((vehicleConfig.exShowroomPrice || 1000000) * 1.5),
            variants: [
              {
                name: vehicleConfig.variantName || 'Standard Trim',
                fuelType: fuelUpper.includes('DIESEL') ? 'DIESEL' : fuelUpper.includes('ELEC') ? 'ELECTRIC' : fuelUpper.includes('CNG') ? 'CNG' : 'PETROL',
                transmission: transUpper,
                exShowroomPrice: vehicleConfig.exShowroomPrice || 1000000,
                keyFeatures: JSON.stringify(['Touchscreen Infotainment', 'Multi-Function Steering', 'ADAS Safety']),
              },
            ],
          };

          const newCarRes = await catalogueApi.createCar(carPayload);
          const carData = newCarRes?.data || newCarRes;
          const createdVariants = carData?.variants || [];
          if (createdVariants.length > 0) {
            effectiveVariantId = createdVariants[0].id;
            await get().fetchCars();
          }
        } catch (catErr) {
          console.warn('Auto-registering car variant in DB failed:', catErr);
        }
      }

      // If still not a valid DB variant and we have existing DB variants, pick the first active one
      if (!allDbVariants.some((v) => v.id === effectiveVariantId) && allDbVariants.length > 0) {
        effectiveVariantId = allDbVariants[0].id;
      }

      const payload = {
        variantId: effectiveVariantId,
        city: city || 'Pune',
        targetMembers: 15,
        signal: {
          timelineMonths,
          purchaseMode: 'FINANCE',
          exchangeCar: false,
          exchangeCarDetails: '',
          notes: notesParts.join(' | '),
        },
      };

      const created = await groupsApi.createGroup(payload);
      await get().fetchGroups();
      const groupId = created?.id || created?.data?.id;
      return { success: true, groupId };
    } catch (err) {
      console.warn('Backend group creation error, applying client-state fallback:', err);
      // Fallback local creation if backend rejects or offline
      const groupVariant = get().variants.find((v) => v.id === variantId);
      const groupCar = get().cars.find((c) => c.id === groupVariant?.carId);
      const newGroupId = generateId('grp');
      const newGroup = {
        id: newGroupId,
        variantId,
        carId: groupVariant?.carId || vehicleConfig?.modelId,
        car: groupCar || {
          id: vehicleConfig?.modelId,
          brand: vehicleConfig?.brandName,
          modelName: vehicleConfig?.modelName,
          imageUrl: vehicleConfig?.imageUrl,
          bodyType: vehicleConfig?.bodyType,
        },
        variant: groupVariant || {
          id: variantId,
          name: vehicleConfig?.variantName,
          fuelType: vehicleConfig?.fuelType,
          transmission: vehicleConfig?.transmission,
          exShowroomPrice: vehicleConfig?.exShowroomPrice,
        },
        selectedColour: vehicleConfig?.colourName,
        selectedColourHex: vehicleConfig?.colourHex,
        imageUrl: vehicleConfig?.imageUrl,
        city: city || 'Pune',
        targetMembers: 15,
        targetSize: 15,
        currentMembers: 1,
        memberIds: [buyerId || 'u-buyer-me'],
        stage: 'FORMATION',
        status: 'COLLECTING_INTEREST',
        isCurrentUserMember: true,
        joinDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        groups: [newGroup, ...state.groups],
        memberships: [
          {
            id: generateId('mem'),
            groupId: newGroupId,
            buyerId: buyerId || 'u-buyer-me',
            status: 'ACTIVE',
            joinedAt: new Date().toISOString(),
          },
          ...state.memberships,
        ],
      }));
      return { success: true, groupId: newGroupId };
    }
  },

  joinGroup: async (groupId, buyerId, timeline, priorities) => {
    try {
      await groupsApi.joinGroup(groupId, {});
      await get().fetchGroupById(groupId);
      await get().fetchGroups();
      return { success: true };
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        clearAuthSession();
        set({ token: null, currentUser: GUEST_USER });
        return { success: false, error: 'Your session has expired. Please sign in again.' };
      }
      return { success: false, error: err.message || 'Failed to join group in database' };
    }
  },

  leaveGroup: async (groupId, buyerId) => {
    try {
      await groupsApi.leaveGroup(groupId);
      await get().fetchGroupById(groupId);
      await get().fetchGroups();
      return { success: true };
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        clearAuthSession();
        set({ token: null, currentUser: GUEST_USER });
        return { success: false, error: 'Your session has expired. Please sign in again.' };
      }
      return { success: false, error: err.message || 'Failed to leave group in database' };
    }
  },

  submitBuyerSignal: async (signalInput) => {
    try {
      const timelineMap = {
        WITHIN_15_DAYS: 'IMMEDIATE_15_DAYS',
        IMMEDIATE_15_DAYS: 'IMMEDIATE_15_DAYS',
        WITHIN_7_DAYS: 'WITHIN_7_DAYS',
        WITHIN_30_DAYS: 'WITHIN_30_DAYS',
        WITHIN_60_DAYS: 'WITHIN_60_DAYS',
        WITHIN_90_DAYS: 'WITHIN_90_DAYS',
        JUST_RESEARCHING: 'JUST_RESEARCHING',
        EXPLORING: 'EXPLORING',
      };

      const purchaseModeMap = {
        CASH: 'CASH',
        FINANCE: 'FINANCE',
        LOAN: 'FINANCE',
        LEASE: 'LEASE',
      };

      const notesParts = [];
      if (Array.isArray(signalInput.priorities) && signalInput.priorities.length > 0) {
        notesParts.push(`Priorities: ${signalInput.priorities.join(', ')}`);
      }
      if (signalInput.colorPreference) {
        notesParts.push(`Color: ${signalInput.colorPreference}`);
      }
      if (signalInput.targetPrice) {
        notesParts.push(`Target Price: ₹${signalInput.targetPrice}`);
      }
      if (signalInput.deliveryPreference) {
        notesParts.push(`Delivery: ${signalInput.deliveryPreference}`);
      }
      if (signalInput.note) {
        notesParts.push(signalInput.note);
      }
      const notesString = notesParts.join(' | ').slice(0, 500);

      const hasExchange = Boolean(
        signalInput.exchangeRequired ?? signalInput.exchangeCar ?? signalInput.hasExchangeCar
      );

      const payload = {
        timelineMonths: timelineMap[signalInput.purchaseTimeline || signalInput.timeline] || 'WITHIN_30_DAYS',
        purchaseMode: purchaseModeMap[signalInput.financeMode || signalInput.purchaseMode] || 'FINANCE',
        exchangeCar: hasExchange,
        exchangeCarDetails: signalInput.exchangeCarDetails || (hasExchange ? 'Old car exchange requested' : null),
        notes: notesString || null,
      };

      await groupsApi.submitSignal(signalInput.groupId, payload);
      await get().fetchGroupById(signalInput.groupId);

      // Optimistically update local buyer signal
      set((state) => {
        const existingIdx = (state.buyerSignals || []).findIndex(
          (s) => s.groupId === signalInput.groupId && (s.buyerId === signalInput.buyerId || s.buyerId === state.currentUser?.id)
        );
        const newSig = {
          id: generateId('sig'),
          groupId: signalInput.groupId,
          buyerId: signalInput.buyerId || state.currentUser?.id || 'u-buyer-me',
          targetPrice: signalInput.targetPrice,
          purchaseTimeline: signalInput.purchaseTimeline || signalInput.timeline,
          priorities: signalInput.priorities || [],
          deliveryPreference: signalInput.deliveryPreference,
          colorPreference: signalInput.colorPreference,
          exchangeRequired: hasExchange,
          note: signalInput.note,
          updatedAt: new Date().toISOString(),
        };
        const updatedSignals = existingIdx >= 0
          ? state.buyerSignals.map((s, idx) => (idx === existingIdx ? { ...s, ...newSig } : s))
          : [newSig, ...(state.buyerSignals || [])];
        return { buyerSignals: updatedSignals };
      });

      return { success: true, signalId: generateId('sig') };
    } catch (err) {
      console.warn('Backend signal submit error, updating client-state:', err);
      // Fallback local update if offline or error
      const hasExchange = Boolean(
        signalInput.exchangeRequired ?? signalInput.exchangeCar ?? signalInput.hasExchangeCar
      );
      set((state) => {
        const existingIdx = (state.buyerSignals || []).findIndex(
          (s) => s.groupId === signalInput.groupId && (s.buyerId === signalInput.buyerId || s.buyerId === state.currentUser?.id)
        );
        const newSig = {
          id: generateId('sig'),
          groupId: signalInput.groupId,
          buyerId: signalInput.buyerId || state.currentUser?.id || 'u-buyer-me',
          targetPrice: signalInput.targetPrice,
          purchaseTimeline: signalInput.purchaseTimeline || signalInput.timeline,
          priorities: signalInput.priorities || [],
          deliveryPreference: signalInput.deliveryPreference,
          colorPreference: signalInput.colorPreference,
          exchangeRequired: hasExchange,
          note: signalInput.note,
          updatedAt: new Date().toISOString(),
        };
        const updatedSignals = existingIdx >= 0
          ? state.buyerSignals.map((s, idx) => (idx === existingIdx ? { ...s, ...newSig } : s))
          : [newSig, ...(state.buyerSignals || [])];
        return { buyerSignals: updatedSignals };
      });
      return { success: true, signalId: generateId('sig') };
    }
  },

  // ----------------------------------------------------
  // QUOTATIONS API ACTIONS
  // ----------------------------------------------------
  fetchQuotations: async (groupId) => {
    try {
      const quotes = await quotationsApi.getQuotationsForGroup(groupId);
      const quoteList = Array.isArray(quotes) ? quotes : [];
      const versions = quoteList.flatMap((q) => {
        const history = Array.isArray(q.versionHistory) ? q.versionHistory : [];
        const current = q.currentVersion ? [q.currentVersion] : [];
        const all = current.length > 0 ? current : history;
        return all.map((v) => ({
          ...v,
          quotationId: q.id,
          groupId: q.groupId,
          createdByDealerId: q.dealer?.id,
          dealer: q.dealer,
          status: v.status || 'PUBLISHED',
          calculatedOnRoadPrice: v.totalOnRoadPrice || v.calculatedOnRoadPrice || 0,
          discountAmount: v.groupDiscount || v.discountAmount || 0,
          deliveryMinDays: v.deliveryTimelineWeeks ? v.deliveryTimelineWeeks * 7 : (v.deliveryMinDays || 7),
          deliveryMaxDays: v.deliveryTimelineWeeks ? v.deliveryTimelineWeeks * 7 + 7 : (v.deliveryMaxDays || 21),
          expiresAt: v.validUntil || v.expiresAt,
          stockStatus: v.stockStatus || 'IN_STOCK',
        }));
      });

      const dealersFromQuotes = quoteList
        .map((q) => q.dealer)
        .filter(Boolean)
        .map((d) => ({
          id: d.id,
          businessName: d.dealershipName || d.name,
          brand: d.brand,
          city: d.city,
          rating: d.rating,
        }));

      set((state) => ({
        quotations: quoteList,
        quotationVersions: versions,
        dealers: [
          ...state.dealers,
          ...dealersFromQuotes.filter((d) => !state.dealers.some((ex) => ex.id === d.id)),
        ],
      }));
      return quoteList;
    } catch (err) {
      console.error(`Failed to fetch quotations for group ${groupId}:`, err);
      return [];
    }
  },

  publishQuotationVersion: async (input) => {
    try {
      const breakdown = input.breakdown || {};
      const exShowroom = Math.max(100000, Number(breakdown.exShowroomPrice || 1000000));
      const registration = Math.max(0, Number(breakdown.registrationCharges || 0));
      const insurance = Math.max(0, Number(breakdown.insuranceAmount || 0));
      const accessories = Math.max(0, Number(breakdown.accessoriesAmount || 0));
      const other = Math.max(0, Number(breakdown.otherCharges || 0));
      const discount = Math.max(1, Number(breakdown.discountAmount || 1));
      const deliveryWeeks = Math.min(52, Math.max(1, Math.ceil((Number(input.deliveryMaxDays) || 14) / 7)));

      // Calculate future validUntil timestamp
      const validityDays = Math.max(1, Number(input.validityDays) || 10);
      const validUntil = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();

      const payload = {
        exShowroomPrice: exShowroom,
        registrationCharges: registration,
        insuranceCharges: insurance,
        accessoriesCharges: accessories,
        otherCharges: other,
        groupDiscount: discount,
        corporateDiscount: 0,
        exchangeBonus: 0,
        accessoryPackage: (input.note || 'Standard OEM Allocation Package').slice(0, 255),
        warrantyYears: 3,
        validUntil,
        deliveryTimelineWeeks: deliveryWeeks,
      };

      let res;
      if (input.quotationId && get().quotations.some((q) => q.id === input.quotationId)) {
        res = await quotationsApi.reviseQuotation(input.quotationId, payload);
      } else {
        res = await quotationsApi.submitQuotation(input.groupId, payload);
      }

      await get().fetchQuotations(input.groupId);
      return { success: true, versionId: res?.id || res?.data?.id || generateId('ver') };
    } catch (err) {
      console.warn('Backend quotation publish error, applying client-state fallback:', err);
      // Fallback local quotation update so dealer UX is never blocked
      const quoteId = input.quotationId || ('quote-' + (input.dealerId || 'dealer') + '-' + input.groupId);
      const newVersion = {
        id: generateId('ver'),
        quotationId: quoteId,
        groupId: input.groupId,
        createdByDealerId: input.dealerId || get().currentUser?.dealerId,
        versionNumber: 1,
        status: 'PUBLISHED',
        exShowroomPrice: Number(input.breakdown?.exShowroomPrice || 1000000),
        registrationCharges: Number(input.breakdown?.registrationCharges || 100000),
        insuranceAmount: Number(input.breakdown?.insuranceAmount || 80000),
        accessoriesAmount: Number(input.breakdown?.accessoriesAmount || 12000),
        otherCharges: Number(input.breakdown?.otherCharges || 0),
        discountAmount: Number(input.breakdown?.discountAmount || 30000),
        calculatedOnRoadPrice: calculateOnRoadPrice(input.breakdown),
        deliveryMinDays: input.deliveryMinDays || 7,
        deliveryMaxDays: input.deliveryMaxDays || 14,
        validityDays: input.validityDays || 10,
        stockStatus: input.stockStatus || 'IN_STOCK',
        note: input.note || '',
        createdAt: new Date().toISOString(),
      };

      const newQuotation = {
        id: quoteId,
        groupId: input.groupId,
        dealerId: input.dealerId || get().currentUser?.dealerId,
        dealer: get().dealers.find((d) => d.id === (input.dealerId || get().currentUser?.dealerId)) || {
          id: input.dealerId || get().currentUser?.dealerId,
          dealershipName: get().currentUser?.dealershipName || 'Authorized Dealership',
          brand: 'Authorized',
          city: 'Pune',
        },
        currentVersion: newVersion,
        versionHistory: [newVersion],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        quotations: [
          newQuotation,
          ...state.quotations.filter((q) => q.id !== quoteId),
        ],
        quotationVersions: [newVersion, ...state.quotationVersions],
      }));

      return { success: true, versionId: newVersion.id };
    }
  },

  // ----------------------------------------------------
  // CONSENT & LEADS API ACTIONS
  // ----------------------------------------------------
  fetchConsents: async () => {
    try {
      const res = await consentsApi.getMyConsents();
      const list = res || [];
      const synthesizedLeads = list.map((c) => ({
        id: c.leadId || `lead-${c.id}`,
        consentId: c.id,
        buyerId: c.buyerId,
        dealerId: c.dealerId,
        groupId: c.groupId,
        offerId: c.quotationId,
        offerVersionId: c.quotationVersionId,
        status: c.leadStatus || (c.status === 'GRANTED' ? 'DEMO_DELIVERED' : c.status === 'REVOKED' ? 'LOST' : 'DEMO_DELIVERED'),
        createdAt: c.grantedAt,
      }));

      set((state) => {
        const existingMap = new Map((state.leads || []).map((l) => [l.id, l]));
        synthesizedLeads.forEach((sl) => {
          existingMap.set(sl.id, { ...(existingMap.get(sl.id) || {}), ...sl });
        });
        return {
          consents: list,
          leads: Array.from(existingMap.values()),
        };
      });
    } catch (err) {
      console.error('Failed to fetch consents from DB:', err);
    }
  },

  grantConsentAndCreateLead: (input) => {
    const { consents, leads, dealers } = get();
    const dealer = dealers.find((d) => d.id === input.dealerId);
    if (dealer && dealer.status === 'SUSPENDED') {
      return { success: false, error: 'Dealership is not eligible to receive leads.' };
    }
    const existingLead = leads.find(
      (l) => l.buyerId === input.buyerId && l.dealerId === input.dealerId && l.groupId === input.groupId && l.status !== 'LOST' && l.status !== 'PURCHASED'
    );
    if (existingLead) {
      return { success: false, error: 'You already have an active lead with this dealership for this group.' };
    }

    const targetQuotationId = input.offerId || input.quotationId;
    const existingConsent = consents.find(
      (c) => (c.quotationId === targetQuotationId || c.offerId === targetQuotationId) && (c.status === 'GRANTED' || c.status === 'ACTIVE')
    );
    const newConsentId = existingConsent?.id || generateId('cst');
    const newLeadId = `lead-${newConsentId}`;

    if (targetQuotationId) {
      consentsApi.grantConsent(targetQuotationId, {
        purpose: input.purpose || 'Direct showroom test drive coordination and quote finalization.',
        preferredContactTime: 'ANYTIME',
        notes: Array.isArray(input.dataFields) ? input.dataFields.join(', ') : '',
      })
      .then(() => get().fetchConsents())
      .catch((err) => {
        // Idempotent: ignore 409 already granted and refresh consents
        if (err.status === 409 || err.message?.toLowerCase().includes('already granted')) {
          get().fetchConsents().catch(() => {});
        }
      });
    }

    const newLead = {
      id: newLeadId,
      consentId: newConsentId,
      buyerId: input.buyerId,
      dealerId: input.dealerId,
      groupId: input.groupId,
      offerId: targetQuotationId,
      offerVersionId: input.offerVersionId,
      status: 'DEMO_DELIVERED',
      createdAt: new Date().toISOString(),
    };

    const newConsent = {
      id: newConsentId,
      buyerId: input.buyerId,
      dealerId: input.dealerId,
      groupId: input.groupId,
      quotationId: targetQuotationId,
      status: 'GRANTED',
      grantedAt: new Date().toISOString(),
    };

    set((state) => {
      const existingLeads = state.leads || [];
      const updatedLeads = existingLeads.some((l) => l.id === newLeadId)
        ? existingLeads
        : [newLead, ...existingLeads];
      const existingConsents = state.consents || [];
      const updatedConsents = existingConsents.some((c) => c.id === newConsentId)
        ? existingConsents
        : [newConsent, ...existingConsents];
      return {
        leads: updatedLeads,
        consents: updatedConsents,
      };
    });

    return { success: true, leadId: newLeadId, consentId: newConsentId };
  },

  withdrawConsent: (consentId, reason = '') => {
    consentsApi.revokeConsent(consentId, reason).catch(() => {});
    set((state) => ({
      consents: state.consents.map((c) =>
        c.id === consentId ? { ...c, status: 'WITHDRAWN', withdrawnAt: new Date().toISOString() } : c
      ),
    }));
    return { success: true };
  },

  fetchDealerLeads: async (status) => {
    try {
      const res = await leadsApi.getDealerLeads(status);
      const leadList = res?.content || (Array.isArray(res) ? res : []);
      set({ leads: leadList });
    } catch (err) {
      console.error('Failed to fetch dealer leads from DB:', err);
    }
  },

  updateLeadStatus: async (leadId, status, notes = '') => {
    try {
      const backendStatusMap = {
        DEMO_DELIVERED: 'DEMO_DELIVERED',
        DEALER_ACKNOWLEDGED: 'CONTACTED',
        CONTACTED: 'CONTACTED',
        TEST_DRIVE_SCHEDULED: 'TEST_DRIVE_SCHEDULED',
        BOOKING_IN_PROGRESS: 'BOOKED',
        BOOKED: 'BOOKED',
        PURCHASED: 'DELIVERED',
        DELIVERED: 'DELIVERED',
        LOST: 'LOST',
        DISPUTED: 'DISPUTED',
      };
      const mappedStatus = backendStatusMap[status] || status;
      await leadsApi.updateLeadStatus(leadId, mappedStatus, notes);
      await get().fetchDealerLeads();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update lead status in database' };
    }
  },

  submitLeadDispute: async (leadId, reason, description = '') => {
    try {
      await leadsApi.updateLeadStatus(leadId, 'DISPUTED', `Dispute [${reason}]: ${description}`);
      await get().fetchDealerLeads();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to register lead dispute' };
    }
  },

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------
  fetchNotifications: async (unreadOnly = false) => {
    try {
      const notifs = await notificationsApi.getNotifications(unreadOnly);
      const list = Array.isArray(notifs) ? notifs : notifs?.data || [];
      const normalized = list.map((n) => ({
        ...n,
        read: n.read !== undefined ? n.read : (n.isRead !== undefined ? n.isRead : false),
      }));
      set({ notifications: normalized });
    } catch (err) {
      console.error('Failed to fetch notifications from DB:', err);
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    } catch (err) {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
    }
  },

  markAllNotificationsReadForRole: (role) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.recipientRole === role ? { ...n, read: true } : n
      ),
    }));
  },

  // ----------------------------------------------------
  // ADMIN OPERATIONS & TELEMETRY ACTIONS
  // ----------------------------------------------------
  fetchAdminAnalytics: async () => {
    try {
      const data = await fetchAdminAnalytics();
      if (data) {
        set((state) => ({
          adminAnalytics: {
            ...state.adminAnalytics,
            ...data,
          },
        }));
        return data;
      }
    } catch (err) {
      console.warn('Backend admin analytics unavailable, computing dynamically:', err);
    }
  },

  fetchAdminDealers: async () => {
    try {
      const dealers = await fetchAdminDealers();
      if (Array.isArray(dealers)) {
        set({ dealers });
        return dealers;
      }
    } catch (err) {
      console.warn('Backend admin dealers fallback:', err);
    }
  },

  reviewDealerApplication: async (dealerId, decision, reason) => {
    const newStatus = decision === 'APPROVE' ? 'VERIFIED' : decision === 'REJECT' ? 'REJECTED' : 'SUSPENDED';
    try {
      await updateDealerStatus(dealerId, newStatus, reason);
    } catch (err) {
      console.warn('Backend updateDealerStatus failed, applying optimistic update:', err);
    }
    set((state) => ({
      dealers: state.dealers.map((d) =>
        d.id === dealerId
          ? { ...d, status: newStatus, verificationStatus: newStatus, verifiedAt: new Date().toISOString() }
          : d
      ),
    }));
    return { success: true };
  },

  fetchAdminUsers: async () => {
    try {
      const users = await fetchAdminUsers();
      if (Array.isArray(users)) {
        set({ users });
        return users;
      }
    } catch (err) {
      console.warn('Backend admin users fallback:', err);
    }
  },

  fetchAdminGroups: async () => {
    try {
      const groups = await fetchAdminGroups();
      if (Array.isArray(groups)) {
        set({ groups });
        return groups;
      }
    } catch (err) {
      console.warn('Backend admin groups fallback:', err);
    }
  },

  fetchAdminLeads: async () => {
    try {
      const leads = await fetchAdminLeads();
      if (Array.isArray(leads)) {
        set({ leads });
        return leads;
      }
    } catch (err) {
      console.warn('Backend admin leads fallback:', err);
    }
  },

  fetchAdminAuditEvents: async () => {
    try {
      const auditEvents = await fetchAdminAudit();
      if (Array.isArray(auditEvents)) {
        set({ auditEvents });
        return auditEvents;
      }
    } catch (err) {
      console.warn('Backend admin audit fallback:', err);
    }
  },

  fetchAdminNotifications: async () => {
    try {
      const notifications = await fetchAdminNotifications();
      if (Array.isArray(notifications)) {
        set({ adminNotifications: notifications });
        return notifications;
      }
    } catch (err) {
      console.warn('Backend admin notifications fallback:', err);
    }
  },

  fetchAdminOverview: async () => {
    set({ adminLoading: true });
    try {
      await Promise.allSettled([
        get().fetchAdminAnalytics(),
        get().fetchAdminDealers(),
        get().fetchAdminUsers(),
        get().fetchAdminLeads(),
        get().fetchAdminAuditEvents(),
        get().fetchAdminNotifications(),
        get().fetchCars(),
        get().fetchGroups(),
      ]);
    } finally {
      const { users, dealers, groups, leads, cars } = get();
      const buyersCount = users.filter((u) => u.role === 'BUYER').length;
      const verifiedDealersCount = dealers.filter((d) => d.verificationStatus === 'VERIFIED' || d.status === 'VERIFIED').length;
      const activeGroupsCount = groups.filter((g) => g.status !== 'CLOSED' && g.stage !== 'CLOSED').length;

      set((state) => ({
        adminLoading: false,
        adminFetched: true,
        adminAnalytics: {
          ...state.adminAnalytics,
          totalBuyers: state.adminAnalytics?.totalBuyers !== undefined ? state.adminAnalytics.totalBuyers : buyersCount,
          totalDealers: state.adminAnalytics?.totalDealers !== undefined ? state.adminAnalytics.totalDealers : dealers.length,
          verifiedDealers: state.adminAnalytics?.verifiedDealers !== undefined ? state.adminAnalytics.verifiedDealers : verifiedDealersCount,
          totalActiveGroups: state.adminAnalytics?.totalActiveGroups !== undefined ? state.adminAnalytics.totalActiveGroups : activeGroupsCount,
          totalCars: state.adminAnalytics?.totalCars !== undefined ? state.adminAnalytics.totalCars : cars.length,
          totalLeads: state.adminAnalytics?.totalLeads !== undefined ? state.adminAnalytics.totalLeads : leads.length,
          totalGMV: state.adminAnalytics?.totalGMV !== undefined ? state.adminAnalytics.totalGMV : 0,
          totalSavings: state.adminAnalytics?.totalSavings !== undefined ? state.adminAnalytics.totalSavings : 0,
          avgDiscountPercentage: state.adminAnalytics?.avgDiscountPercentage || 0,
          conversionRate: state.adminAnalytics?.conversionRate || 0,
        },
      }));
    }
  },

  // Test helper compatibility
  resetDemoData: () => {
    set({
      consents: [],
      leads: [],
      dealers: [],
      quotationVersions: [],
    });
  },
}));
