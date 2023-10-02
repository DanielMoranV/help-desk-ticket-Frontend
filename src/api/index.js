/* eslint-disable prettier/prettier */
import axios from './axios';

// Accesos
/**
 * @url POST /access
 * @since 1.0
 */

export const sigin = (payload) => axios.post('/access', payload);

/**
 * @url POST /access:username
 * @since 1.0
 */
export const createAccessUser = (username, payload) => axios.post(`/access/${username}`, payload);

/**
 * @url GET /access
 * @since 1.0
 */
export const fetchAccess = () => axios.get('/access');

/**
 * @url GET /access:username
 * @since 1.0
 */
export const getAccessUser = (username, payload) => axios.get(`/access/${username}`, payload);

/**
 * @url PUT /access:username
 * @since 1.0
 */
export const updateAccessUser = (username, payload) => axios.put(`/access/${username}`, payload);

// Usuarios
/**
 * @url GET /users
 * @since 1.0
 */
export const fetchUsers = () => axios.get('/users');

/**
 * @url PUT /users/:dni
 * @since 1.0
 */
export const updateUser = (dni, payload) => axios.put(`/users/${dni}`, payload);
/*

/**
 * @url POST /users
 * @since 1.0
 */
export const createUser = (payload) => axios.post('/users', payload);

/**
 * @url POST /users/patients
 * @since 1.0
 */
export const createPatients = (payload) => axios.post('/users/patients', payload);

/**
 * @url GET /users/:id
 * @since 1.0
 */
export const getUser = (dni) => axios.get(`/users/${dni}`);

/**
 * @url DELETE /users/:id
 * @since 1.0
 */
export const deleteUser = (dni) => axios.delete(`/users/${dni}`);

/**
 * @url GET /users/currentuser
 * @since 1.0
 */
export const currentUser = () => axios.get('/users/currentuser');

/**
 * @url GET /category
 * @since 1.0
 */
export const getCategory = () => axios.get('/category');

/**
 * @url GET /category/billing
 * @since 1.0
 */
export const getCategoryBilling = () => axios.get('/category/billing');

/**
 * @url GET /priority
 * @since 1.0
 */
export const getPriority = () => axios.get('/priority');

/**
 * @url POST /tickets
 * @since 1.0
 */
export const createTicket = (payload) => axios.post('/tickets', payload);

/**
 * @url POST /tickets
 * @since 1.0
 */
export const getTicket = (ticketId) => axios.get(`/tickets/${ticketId}`);

/**
 * @url PUT tickets/:ticketId/photo
 * @since 1.0
 */
export const createTicketPhoto = (ticketId) => axios.post(`/tickets/${ticketId}/photo`);

/**
 * @url PUT tickets/:ticketId/photo
 * @since 1.0
 */
export const getUserTicket = (userId) => axios.get(`/tickets/user/${userId}`);

/**
 * @url PUT tickets/:ticketId/photo
 * @since 1.0
 */
export const getTickets = () => axios.get(`/tickets/`);

/**
 * @url PUT /users/:dni
 * @since 1.0
 */
export const updateTicket = (ticketId, payload) => axios.put(`/tickets/${ticketId}`, payload);
/*

/**
 * @url DELETE /users/:id
 * @since 1.0
 */
export const deleteTicket = (ticketId) => axios.delete(`/tickets/${ticketId}`);
/** */

/**
 * @url POST /tickets
 * @since 1.0
 */
export const createTicketBilling = (payload) => axios.post('/ticketsBilling', payload);

/**
 * @url POST /tickets
 * @since 1.0
 */
export const getTicketBilling = (ticketId) => axios.get(`/ticketsBilling/${ticketId}`);

/**
 * @url PUT tickets/:ticketId/photo
 * @since 1.0
 */
export const createTicketBillingPhoto = (ticketId) => axios.post(`/ticketsBilling/${ticketId}/photo`);

/**
 * @url PUT tickets/:ticketId/photo
 * @since 1.0
 */
export const getUserTicketBilling = (userId) => axios.get(`/ticketsBilling/user/${userId}`);

/**
 * @url PUT tickets/:ticketId/photo
 * @since 1.0
 */
export const getTicketsBilling = () => axios.get(`/ticketsBilling/`);

/**
 * @url PUT /users/:dni
 * @since 1.0
 */
export const updateTicketBilling = (ticketId, payload) => axios.put(`/ticketsBilling/${ticketId}`, payload);
/*

/**
 * @url DELETE /users/:id
 * @since 1.0
 */
export const deleteTicketBilling = (ticketId) => axios.delete(`/ticketsBilling/${ticketId}`);
/** */

/**
 * @url PUT tickets/:ticketId/photo
 * @since 1.0
 */
export const getPhoto = (filename) => axios.get(`/photos/${filename}`);
/** */
