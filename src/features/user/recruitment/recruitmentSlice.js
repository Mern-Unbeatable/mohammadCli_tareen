import { createSlice } from "@reduxjs/toolkit";
import {
  fetchJobs,
  fetchJobDetails,
  createJob,
  updateJob,
  removeJob,
  applyToJob,
  fetchMyApplications,
} from "./recruitmentThunks";

const initialState = {
  jobs: [],
  jobsMeta: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
  selectedJob: null,
  applications: [],
  applicationsMeta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  jobsLoading: false,
  selectedJobLoading: false,
  applicationsLoading: false,
  saving: false,
  deleting: false,
  applying: false,
  error: null,
};

const upsertJob = (state, job) => {
  if (!job?.id) return;
  const index = state.jobs.findIndex((row) => row.id === job.id);
  if (index >= 0) state.jobs[index] = job;
  else state.jobs = [job, ...state.jobs];
  if (state.selectedJob?.id === job.id) state.selectedJob = job;
};

const recruitmentSlice = createSlice({
  name: "userRecruitment",
  initialState,
  reducers: {
    clearRecruitmentError: (state) => {
      state.error = null;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.jobsLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobs = action.payload.data;
        state.jobsMeta = action.payload.meta;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobDetails.pending, (state) => {
        state.selectedJobLoading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.selectedJobLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.selectedJobLoading = false;
        state.error = action.payload;
      })
      .addCase(createJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.saving = false;
        upsertJob(state, action.payload);
        if (action.payload?.id) {
          state.jobsMeta = {
            ...state.jobsMeta,
            total: (state.jobsMeta.total || 0) + 1,
          };
        }
      })
      .addCase(createJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.saving = false;
        upsertJob(state, action.payload);
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(removeJob.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(removeJob.fulfilled, (state, action) => {
        state.deleting = false;
        state.jobs = state.jobs.filter(
          (job) => job.id !== action.payload.jobId,
        );
        if (state.selectedJob?.id === action.payload.jobId) {
          state.selectedJob = null;
        }
      })
      .addCase(removeJob.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      .addCase(applyToJob.pending, (state) => {
        state.applying = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.applying = false;
        if (action.payload?.application) {
          state.applications = [
            action.payload.application,
            ...state.applications,
          ];
        }
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.applying = false;
        state.error = action.payload;
      })
      .addCase(fetchMyApplications.pending, (state) => {
        state.applicationsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.applications = action.payload.data;
        state.applicationsMeta = action.payload.meta;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecruitmentError, clearSelectedJob } =
  recruitmentSlice.actions;
export default recruitmentSlice.reducer;
