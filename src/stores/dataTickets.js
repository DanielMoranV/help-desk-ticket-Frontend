import { defineStore } from 'pinia';
import { getCategory, getPriority, createTicket } from '../api';
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
        }
    }
});
