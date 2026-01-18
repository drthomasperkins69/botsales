import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, RobotListing, Conversation, Message, SearchFilters } from '@/types';
import { mockUsers } from '@/data/users';
import { mockListings } from '@/data/listings';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, _password: string) => {
        // Simulate API call
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        // For demo, create a new user if not found
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          location: { city: 'Sydney', state: 'NSW', postcode: '2000' },
          memberSince: new Date().toISOString(),
          listingsCount: 0,
          rating: 0,
          reviewCount: 0,
          verified: false,
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      register: async (userData) => {
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: userData.email!,
          name: userData.name || userData.email!.split('@')[0],
          location: userData.location || { city: 'Sydney', state: 'NSW', postcode: '2000' },
          memberSince: new Date().toISOString(),
          listingsCount: 0,
          rating: 0,
          reviewCount: 0,
          verified: false,
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    { name: 'auth-storage' }
  )
);

// Listings Store
interface ListingsState {
  listings: RobotListing[];
  userListings: RobotListing[];
  favorites: string[];
  addListing: (listing: Omit<RobotListing, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'favorites'>) => string;
  updateListing: (id: string, updates: Partial<RobotListing>) => void;
  deleteListing: (id: string) => void;
  toggleFavorite: (id: string) => void;
  incrementViews: (id: string) => void;
  getListingById: (id: string) => RobotListing | undefined;
  getListingsByUser: (userId: string) => RobotListing[];
  searchListings: (filters: SearchFilters) => RobotListing[];
  getFeaturedListings: () => RobotListing[];
  getRecentListings: (limit?: number) => RobotListing[];
}

export const useListingsStore = create<ListingsState>()(
  persist(
    (set, get) => ({
      listings: mockListings,
      userListings: [],
      favorites: [],

      addListing: (listingData) => {
        const id = `listing-${Date.now()}`;
        const newListing: RobotListing = {
          ...listingData,
          id,
          views: 0,
          favorites: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          listings: [newListing, ...state.listings],
          userListings: [newListing, ...state.userListings],
        }));
        return id;
      },

      updateListing: (id, updates) => {
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
          ),
          userListings: state.userListings.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
          ),
        }));
      },

      deleteListing: (id) => {
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== id),
          userListings: state.userListings.filter((l) => l.id !== id),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        }));
      },

      incrementViews: (id) => {
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, views: l.views + 1 } : l
          ),
        }));
      },

      getListingById: (id) => {
        return get().listings.find((l) => l.id === id);
      },

      getListingsByUser: (userId) => {
        return get().listings.filter((l) => l.sellerId === userId);
      },

      searchListings: (filters) => {
        let results = get().listings.filter((l) => l.status === 'active');

        if (filters.query) {
          const query = filters.query.toLowerCase();
          results = results.filter(
            (l) =>
              l.title.toLowerCase().includes(query) ||
              l.description.toLowerCase().includes(query) ||
              l.brand.toLowerCase().includes(query) ||
              l.model.toLowerCase().includes(query)
          );
        }

        if (filters.category) {
          results = results.filter((l) => l.category === filters.category);
        }

        if (filters.brand) {
          results = results.filter((l) => l.brand.toLowerCase() === filters.brand!.toLowerCase());
        }

        if (filters.minPrice !== undefined) {
          results = results.filter((l) => l.price >= filters.minPrice!);
        }

        if (filters.maxPrice !== undefined) {
          results = results.filter((l) => l.price <= filters.maxPrice!);
        }

        if (filters.condition && filters.condition.length > 0) {
          results = results.filter((l) => filters.condition!.includes(l.condition));
        }

        if (filters.location) {
          const loc = filters.location.toLowerCase();
          results = results.filter(
            (l) =>
              l.location.city.toLowerCase().includes(loc) ||
              l.location.state.toLowerCase().includes(loc)
          );
        }

        // Sort
        switch (filters.sortBy) {
          case 'newest':
            results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'oldest':
            results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'price-low':
            results.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            results.sort((a, b) => b.price - a.price);
            break;
          default:
            // Relevance - featured first, then by views
            results.sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return b.views - a.views;
            });
        }

        return results;
      },

      getFeaturedListings: () => {
        return get().listings.filter((l) => l.featured && l.status === 'active');
      },

      getRecentListings: (limit = 8) => {
        return get()
          .listings
          .filter((l) => l.status === 'active')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },
    }),
    { name: 'listings-storage' }
  )
);

// Messages Store
interface MessagesState {
  conversations: Conversation[];
  messages: Message[];
  startConversation: (listingId: string, participantIds: string[]) => string;
  sendMessage: (conversationId: string, senderId: string, content: string) => void;
  getConversationsByUser: (userId: string) => Conversation[];
  getMessagesByConversation: (conversationId: string) => Message[];
  markAsRead: (conversationId: string, userId: string) => void;
  getUnreadCount: (userId: string) => number;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: [],

      startConversation: (listingId, participantIds) => {
        const existing = get().conversations.find(
          (c) =>
            c.listingId === listingId &&
            participantIds.every((p) => c.participants.includes(p))
        );
        if (existing) return existing.id;

        const id = `conv-${Date.now()}`;
        const newConversation: Conversation = {
          id,
          listingId,
          participants: participantIds,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
        }));
        return id;
      },

      sendMessage: (conversationId, senderId, content) => {
        const message: Message = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId,
          content,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          messages: [...state.messages, message],
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: message, updatedAt: new Date().toISOString() }
              : c
          ),
        }));
      },

      getConversationsByUser: (userId) => {
        return get()
          .conversations
          .filter((c) => c.participants.includes(userId))
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getMessagesByConversation: (conversationId) => {
        return get()
          .messages
          .filter((m) => m.conversationId === conversationId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },

      markAsRead: (conversationId, userId) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.conversationId === conversationId && m.senderId !== userId
              ? { ...m, read: true }
              : m
          ),
        }));
      },

      getUnreadCount: (userId) => {
        const userConversations = get().conversations.filter((c) =>
          c.participants.includes(userId)
        );
        return get().messages.filter(
          (m) =>
            userConversations.some((c) => c.id === m.conversationId) &&
            m.senderId !== userId &&
            !m.read
        ).length;
      },
    }),
    { name: 'messages-storage' }
  )
);

// Saved Searches Store
interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  emailAlerts: boolean;
}

interface SavedSearchesState {
  savedSearches: SavedSearch[];
  addSavedSearch: (name: string, filters: SearchFilters, emailAlerts?: boolean) => void;
  removeSavedSearch: (id: string) => void;
  toggleEmailAlerts: (id: string) => void;
}

export const useSavedSearchesStore = create<SavedSearchesState>()(
  persist(
    (set) => ({
      savedSearches: [],

      addSavedSearch: (name, filters, emailAlerts = false) => {
        const newSearch: SavedSearch = {
          id: `search-${Date.now()}`,
          name,
          filters,
          createdAt: new Date().toISOString(),
          emailAlerts,
        };
        set((state) => ({
          savedSearches: [newSearch, ...state.savedSearches],
        }));
      },

      removeSavedSearch: (id) => {
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
        }));
      },

      toggleEmailAlerts: (id) => {
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === id ? { ...s, emailAlerts: !s.emailAlerts } : s
          ),
        }));
      },
    }),
    { name: 'saved-searches-storage' }
  )
);
