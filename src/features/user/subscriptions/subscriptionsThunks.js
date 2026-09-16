import { createAsyncThunk } from "@reduxjs/toolkit";
import * as subscriptionsApi from "./subscriptionsApi";

/**
 * User subscriptions async thunks — orchestration only; HTTP in subscriptionsApi.
 */

export const fetchMySubscription = createAsyncThunk(
  "userSubscriptions/fetchMySubscription",
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionsApi.getMySubscription();
    } catch (err) {
      return rejectWithValue(
        subscriptionsApi.getApiErrorMessage(
          err,
          "Failed to load subscription",
        ),
      );
    }
  },
);

export const fetchPlans = createAsyncThunk(
  "userSubscriptions/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionsApi.getPlans();
    } catch (err) {
      return rejectWithValue(
        subscriptionsApi.getApiErrorMessage(err, "Failed to load plans"),
      );
    }
  },
);

export const subscribe = createAsyncThunk(
  "userSubscriptions/subscribe",
  async (plan, { rejectWithValue }) => {
    try {
      return await subscriptionsApi.subscribe(plan);
    } catch (err) {
      return rejectWithValue(
        subscriptionsApi.getApiErrorMessage(err, "Failed to subscribe"),
      );
    }
  },
);

export const cancelSubscription = createAsyncThunk(
  "userSubscriptions/cancelSubscription",
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionsApi.cancelSubscription();
    } catch (err) {
      return rejectWithValue(
        subscriptionsApi.getApiErrorMessage(
          err,
          "Failed to cancel subscription",
        ),
      );
    }
  },
);
