import { createSlice } from "@reduxjs/toolkit";
import {
  fetchContactsList,
  fetchContactDetails,
  requestContactConnection,
  acceptConnection,
  declineConnection,
  removeConnection,
} from "./contactsThunks";

const initialState = {
  contacts: [],
  contactsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  selectedContact: null,
  contactsLoading: false,
  selectedContactLoading: false,
  connectingId: null,
  actionLoading: false,
  error: null,
};

const markPendingOnContact = (contact, addresseeId) => {
  if (!contact || contact.id !== addresseeId) return contact;
  return {
    ...contact,
    connectionStatus: "PENDING",
    connectionDirection: "outgoing",
  };
};

const applyConnectionStatus = (contact, connectionId, status) => {
  if (!contact) return contact;
  const matches =
    contact.connectionId === connectionId ||
    contact.id === connectionId;
  if (!matches) return contact;
  return {
    ...contact,
    connectionStatus: status,
    connectionId: contact.connectionId || connectionId,
  };
};

const contactsSlice = createSlice({
  name: "userContacts",
  initialState,
  reducers: {
    clearContactsError: (state) => {
      state.error = null;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactsList.pending, (state) => {
        state.contactsLoading = true;
        state.error = null;
      })
      .addCase(fetchContactsList.fulfilled, (state, action) => {
        state.contactsLoading = false;
        state.contacts = action.payload.data;
        state.contactsMeta = action.payload.meta;
      })
      .addCase(fetchContactsList.rejected, (state, action) => {
        state.contactsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchContactDetails.pending, (state) => {
        state.selectedContactLoading = true;
        state.error = null;
      })
      .addCase(fetchContactDetails.fulfilled, (state, action) => {
        state.selectedContactLoading = false;
        state.selectedContact = action.payload;
      })
      .addCase(fetchContactDetails.rejected, (state, action) => {
        state.selectedContactLoading = false;
        state.error = action.payload;
      })
      .addCase(requestContactConnection.pending, (state, action) => {
        state.connectingId = action.meta.arg;
        state.error = null;
      })
      .addCase(requestContactConnection.fulfilled, (state, action) => {
        state.connectingId = null;
        const { addresseeId } = action.payload;
        state.contacts = state.contacts.map((c) =>
          markPendingOnContact(c, addresseeId),
        );
        state.selectedContact = markPendingOnContact(
          state.selectedContact,
          addresseeId,
        );
      })
      .addCase(requestContactConnection.rejected, (state, action) => {
        state.connectingId = null;
        state.error = action.payload;
      })
      .addCase(acceptConnection.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(acceptConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { connectionId } = action.payload;
        state.contacts = state.contacts.map((c) =>
          applyConnectionStatus(c, connectionId, "ACCEPTED"),
        );
        state.selectedContact = applyConnectionStatus(
          state.selectedContact,
          connectionId,
          "ACCEPTED",
        );
      })
      .addCase(acceptConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(declineConnection.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(declineConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { connectionId } = action.payload;
        state.contacts = state.contacts.filter(
          (c) =>
            c.connectionId !== connectionId && c.id !== connectionId,
        );
        if (
          state.selectedContact?.connectionId === connectionId ||
          state.selectedContact?.id === connectionId
        ) {
          state.selectedContact = null;
        }
      })
      .addCase(declineConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(removeConnection.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { connectionId } = action.payload;
        state.contacts = state.contacts.filter(
          (c) =>
            c.connectionId !== connectionId && c.id !== connectionId,
        );
        if (
          state.selectedContact?.connectionId === connectionId ||
          state.selectedContact?.id === connectionId
        ) {
          state.selectedContact = null;
        }
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactsError, clearSelectedContact } =
  contactsSlice.actions;
export default contactsSlice.reducer;
