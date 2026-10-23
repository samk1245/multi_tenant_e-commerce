import { api } from '../api';

const STORAGE_KEY = 'omnistore_saved_addresses_v2';

const DEFAULT_ADDRESSES = [
  {
    id: 'addr_1',
    _id: 'addr_1',
    label: 'Home',
    name: 'Rahul Verma',
    phone: '+91 91234 56789',
    street: 'Flat 402, Sea View Apartments, Bandra West',
    landmark: 'Near Carter Road Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400050',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr_2',
    _id: 'addr_2',
    label: 'Office',
    name: 'Rahul Verma',
    phone: '+91 98765 43210',
    street: '12/A Green Glen Layout, Outer Ring Road, Bellandur',
    landmark: 'Behind Ecospace Tech Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560103',
    country: 'India',
    isDefault: false,
  },
];

export const addressManager = {
  loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored addresses:', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADDRESSES));
    return DEFAULT_ADDRESSES;
  },

  saveLocal(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving addresses:', e);
    }
  },

  async getAddresses(email = 'customer@example.com') {
    let local = this.loadLocal();
    try {
      const serverList = await api.getAddresses(email);
      if (Array.isArray(serverList) && serverList.length > 0) {
        const formatted = serverList.map((a) => ({
          ...a,
          id: a._id ? a._id.toString() : a.id,
        }));
        this.saveLocal(formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Failed to fetch addresses from backend, using local storage:', err);
    }
    return local;
  },

  async addAddress(email = 'customer@example.com', addressData) {
    let list = this.loadLocal();
    const newId = 'addr_' + Date.now();
    const isFirst = list.length === 0;
    const shouldDefault = addressData.isDefault || isFirst;

    if (shouldDefault) {
      list = list.map((a) => ({ ...a, isDefault: false }));
    }

    const newAddr = {
      ...addressData,
      id: newId,
      _id: newId,
      isDefault: shouldDefault,
      country: addressData.country || 'India',
    };

    list.unshift(newAddr);
    this.saveLocal(list);

    try {
      await api.addAddress(email, newAddr);
    } catch (e) {
      console.warn('Could not sync address to server:', e);
    }

    return list;
  },

  async updateAddress(email = 'customer@example.com', addressId, updatedData) {
    let list = this.loadLocal();
    const targetId = addressId ? addressId.toString() : '';

    if (updatedData.isDefault) {
      list = list.map((a) => ({ ...a, isDefault: false }));
    }

    list = list.map((a) => {
      const currentId = a._id ? a._id.toString() : a.id;
      if (currentId === targetId) {
        return {
          ...a,
          ...updatedData,
          id: currentId,
          _id: currentId,
        };
      }
      return a;
    });

    this.saveLocal(list);

    try {
      await api.updateAddress(email, addressId, updatedData);
    } catch (e) {
      console.warn('Could not sync update to server:', e);
    }

    return list;
  },

  async deleteAddress(email = 'customer@example.com', addressId) {
    let list = this.loadLocal();
    const targetId = addressId ? addressId.toString() : '';
    const wasDefault = list.find((a) => (a._id ? a._id.toString() : a.id) === targetId)?.isDefault;

    list = list.filter((a) => (a._id ? a._id.toString() : a.id) !== targetId);
    if (wasDefault && list.length > 0) {
      list[0].isDefault = true;
    }

    this.saveLocal(list);

    try {
      await api.deleteAddress(email, addressId);
    } catch (e) {
      console.warn('Could not sync delete to server:', e);
    }

    return list;
  },

  async setDefault(email = 'customer@example.com', addressId) {
    let list = this.loadLocal();
    const targetId = addressId ? addressId.toString() : '';

    list = list.map((a) => ({
      ...a,
      isDefault: (a._id ? a._id.toString() : a.id) === targetId,
    }));

    this.saveLocal(list);

    try {
      await api.setDefaultAddress(email, addressId);
    } catch (e) {
      console.warn('Could not sync default to server:', e);
    }

    return list;
  },
};
