import { createAsyncThunk } from "@reduxjs/toolkit";
import * as contactsApi from "./contactsApi";

/**
 * Supplier contacts async thunks — orchestration only; HTTP in contactsApi.
 */

// ═══════════════════════════════════════════════════════════════════════
// Directory list
// ═══════════════════════════════════════════════════════════════════════
export const fetchContactsList = createAsyncThunk(
  "supplierContacts/fetchContactsList",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await contactsApi.getContactsList(params);
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to load contacts"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Contact profile
// ═══════════════════════════════════════════════════════════════════════
export const fetchContactDetails = createAsyncThunk(
  "supplierContacts/fetchContactDetails",
  async (contactId, { rejectWithValue }) => {
    try {
      return await contactsApi.getContactById(contactId);
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to load contact"),
      );
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════
// Request connection
// ═══════════════════════════════════════════════════════════════════════
export const requestContactConnection = createAsyncThunk(
  "supplierContacts/requestContactConnection",
  async (addresseeId, { rejectWithValue }) => {
    try {
      const connection = await contactsApi.requestConnection(addresseeId);
      return { addresseeId, connection };
    } catch (err) {
      return rejectWithValue(
        contactsApi.getApiErrorMessage(err, "Failed to send connection request"),
      );
    }
  },
);
