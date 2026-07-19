import { JoinRequest, ContactMessage } from '../types';

const JOIN_KEY = 'uaos_join_requests_v1';
const CONTACT_KEY = 'uaos_contact_messages_v1';

export function getJoinRequests(): JoinRequest[] {
  try {
    const data = localStorage.getItem(JOIN_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to get join requests', e);
  }
  return [];
}

export function saveJoinRequests(requests: JoinRequest[]): void {
  try {
    localStorage.setItem(JOIN_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save join requests', e);
  }
}

export function addJoinRequest(req: Omit<JoinRequest, 'id' | 'createdAt' | 'status'>): JoinRequest {
  const requests = getJoinRequests();
  const newRequest: JoinRequest = {
    ...req,
    id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  requests.unshift(newRequest);
  saveJoinRequests(requests);
  return newRequest;
}

export function updateJoinRequestStatus(id: string, status: JoinRequest['status']): void {
  const requests = getJoinRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index].status = status;
    saveJoinRequests(requests);
  }
}

export function deleteJoinRequest(id: string): void {
  const requests = getJoinRequests();
  const filtered = requests.filter(r => r.id !== id);
  saveJoinRequests(filtered);
}


export function getContactMessages(): ContactMessage[] {
  try {
    const data = localStorage.getItem(CONTACT_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to get contact messages', e);
  }
  return [];
}

export function saveContactMessages(messages: ContactMessage[]): void {
  try {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save contact messages', e);
  }
}

export function addContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
  const messages = getContactMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'new'
  };
  messages.unshift(newMessage);
  saveContactMessages(messages);
  return newMessage;
}

export function updateContactMessageStatus(id: string, status: ContactMessage['status']): void {
  const messages = getContactMessages();
  const index = messages.findIndex(m => m.id === id);
  if (index !== -1) {
    messages[index].status = status;
    saveContactMessages(messages);
  }
}

export function deleteContactMessage(id: string): void {
  const messages = getContactMessages();
  const filtered = messages.filter(m => m.id !== id);
  saveContactMessages(filtered);
}
