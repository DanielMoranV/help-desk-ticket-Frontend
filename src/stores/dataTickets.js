import { defineStore } from 'pinia';
import { getCategory, getPriority, createTicket, getTicket, getUserTicket, deleteTicket, getTickets, updateTicket } from '../api';
import cache from '../utils/cache';

export const useTicketStore = defineStore({
    id: 'ticket',
    state: () => ({
        dataTicket: cache.getItem('dataTicket'),
        loadingDataTicket: false,
        category: [],
        priority: []
    }),
    actions: {
        async getCategory() {
            if (this.category.length === 0) {
                this.loadingDataTicket = true;
                try {
                    const { data } = await getCategory();
                    this.category = data;
                    return this.category;
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loadingDataTicket = false;
                }
            }
        },
        async getPriority() {
            if (this.priority.length === 0) {
                this.loadingDataTicket = true;
                try {
                    const { data } = await getPriority();
                    this.priority = data;
                    return this.priority;
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loadingDataTicket = false;
                }
            }
        },
        async getOptions() {},
        async addTicket(payload) {
            try {
                const { data } = await createTicket(payload);
                cache.setItem('dataTicket', data);
                this.dataTicket = data;
            } catch (error) {
                console.log('addticket: ', error);
            }
        },
        async getTicket(ticketId) {
            try {
                const { data } = await getTicket(ticketId);
                cache.setItem('dataTicket', data[0]);
                this.dataTicket = data[0];
                return this.dataTicket;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async getUserTicket(userId) {
            try {
                const { data } = await getUserTicket(userId);
                cache.setItem('dataTicket', data);
                this.dataTicket = data;
                return this.dataTicket;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async getTickets() {
            try {
                const { data } = await getTickets();
                cache.setItem('dataTicket', data);
                this.dataTicket = data;
                return this.dataTicket;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async updateTickets(ticketId, payload) {
            try {
                const { data } = await updateTicket(ticketId, { status: payload, resolvedAt: new Date() });
                cache.setItem('dataTicket', data);
                this.dataTicket = data;
                return this.dataTicket;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async deleteTicket(ticketId) {
            try {
                await deleteTicket(ticketId);
                this.dataTicket = this.dataTicket.filter((item) => item.ticketId !== ticketId);
            } catch (error) {
                console.log(error.message);
            } finally {
                console.log('Finalizado');
            }
        }
    }
});
