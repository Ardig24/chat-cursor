import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'YOUR_CLIENT_ID', // Replace with your Azure AD app client ID
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
  account: null,
  scopes: ['Calendars.ReadWrite', 'User.Read'],
  interactionRequiredRedirect: async (context) => {
    throw new InteractionRequiredAuthError();
  },
});

const graphClient = Client.initWithMiddleware({ authProvider });

export const outlookCalendar = {
  async getEvents(startDate: Date, endDate: Date) {
    try {
      const response = await graphClient.api('/me/calendarView')
        .query({
          startDateTime: startDate.toISOString(),
          endDateTime: endDate.toISOString(),
        })
        .select('subject,start,end,location')
        .orderby('start/dateTime')
        .get();

      return response.value;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  async createEvent(event: {
    subject: string;
    start: Date;
    end: Date;
    location?: string;
    attendees?: string[];
    content?: string;
  }) {
    try {
      const eventData = {
        subject: event.subject,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        location: event.location ? {
          displayName: event.location,
        } : undefined,
        attendees: event.attendees?.map(email => ({
          emailAddress: {
            address: email,
          },
          type: 'required',
        })),
        body: event.content ? {
          contentType: 'text',
          content: event.content,
        } : undefined,
      };

      const response = await graphClient.api('/me/events')
        .post(eventData);

      return response;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },
};