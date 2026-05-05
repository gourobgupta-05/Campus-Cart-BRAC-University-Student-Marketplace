import { MESSAGES_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: `${MESSAGES_URL}/conversations`,
      }),
      providesTags: ['Message'],
    }),
    getMessages: builder.query({
      query: (userId) => ({
        url: `${MESSAGES_URL}/${userId}`,
      }),
      providesTags: ['Message'],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: MESSAGES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message'],
    }),
    markMessagesAsRead: builder.mutation({
      query: (userId) => ({
        url: `${MESSAGES_URL}/${userId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Message'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} = messagesApiSlice;
