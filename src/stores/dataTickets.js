import { defineStore } from 'pinia';
import {
    getCategory,
    getPriority,
    createTicket,
    createTicketBilling,
    getTicket,
    getTicketBilling,
    getUserTicket,
    getUserTicketBilling,
    deleteTicket,
    deleteTicketBilling,
    getTickets,
    getTicketsBilling,
    updateTicket,
    updateTicketBilling,
    getCategoryBilling,
    countStatusTicket,
    countStatusTicketBilling
} from '../api';
import cache from '../utils/cache';

export const useTicketStore = defineStore({
    id: 'ticket',
    state: () => ({
        dataTicket: cache.getItem('dataTicket'),
        dataTicketBilling: cache.getItem('dataTicketBilling'),
        loadingDataTicket: false,
        statusBilling: cache.getItem('dataStatusBilling'),
        statusTickets: cache.getItem('dataStatusTickets'),
        category: [],
        categoryBilling: [],
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
        async countStatusTicketBilling() {
            this.loadingDataTicket = true;
            try {
                const { data } = await countStatusTicketBilling();
                cache.setItem('dataStatusBilling', data);
                this.statusBilling = data;
                return this.statusBilling;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async countStatusTicket() {
            this.loadingDataTicket = true;
            try {
                const { data } = await countStatusTicket();
                cache.setItem('dataStatusTickets', data);
                this.statusTickets = data;
                return this.statusTickets;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async getCategoryBilling() {
            if (this.category.length === 0) {
                this.loadingDataTicket = true;
                try {
                    const { data } = await getCategoryBilling();
                    this.categoryBilling = data;
                    return this.categoryBilling;
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
        async addTicketBilling(payload) {
            try {
                const { data } = await createTicketBilling(payload);
                cache.setItem('dataTicketBilling', data);
                this.dataTicketBilling = data;
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
        async getTicketBilling(ticketId) {
            try {
                const { data } = await getTicketBilling(ticketId);
                cache.setItem('dataTicketBilling', data[0]);
                this.dataTicketBilling = data[0];
                return this.dataTicketBilling;
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
        async getUserTicketBilling(userId) {
            try {
                const { data } = await getUserTicketBilling(userId);
                cache.setItem('dataTicketBilling', data);
                this.dataTicketBilling = data;
                return this.dataTicketBilling;
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
        async getTicketsBilling() {
            try {
                const { data } = await getTicketsBilling();
                cache.setItem('dataTicketBilling', data);
                this.dataTicketBilling = data;
                return this.dataTicketBilling;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async updateTickets(ticketId, payload) {
            try {
                const { data } = await updateTicket(ticketId, payload);
                cache.setItem('dataTicket', data);
                this.dataTicket = data;
                return this.dataTicket;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async updateTicketsBilling(ticketId, payload, userId) {
            try {
                const { data } = await updateTicketBilling(ticketId, { status: payload, resolvedAt: new Date(), agentId: userId });
                cache.setItem('dataTicketBilling', data);
                this.dataTicketBilling = data;
                return this.dataTicketBilling;
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
        },
        async deleteTicketBilling(ticketId) {
            try {
                await deleteTicketBilling(ticketId);
                this.dataTicketBilling = this.dataTicketBilling.filter((item) => item.ticketId !== ticketId);
            } catch (error) {
                console.log(error.message);
            } finally {
                console.log('Finalizado');
            }
        }
    }
});
