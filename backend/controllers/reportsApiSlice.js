import { apiSlice } from './apiSlice';
import { REPORTS_URL } from '../constants'; // Needs to be added in constants

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: () => ({
        url: REPORTS_URL,
      }),
      providesTags: ['Report'],
      keepUnusedDataFor: 5,
    }),
    createReport: builder.mutation({
      query: (data) => ({
        url: REPORTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Report'],
    }),
    resolveReport: builder.mutation({
      query: (reportId) => ({
        url: `${REPORTS_URL}/${reportId}/resolve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useResolveReportMutation,
} = reportsApiSlice;
