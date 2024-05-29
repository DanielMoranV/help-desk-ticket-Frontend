import { defineStore } from 'pinia';
import { getTariffGeneral, getTariffPersonalizado } from '../api';
import cache from '../utils/cache';

export const useTariffStore = defineStore({
    id: 'tariff',
    state: () => ({
        dataTariffGeneral: cache.getItem('dataTariffGeneral'),
        dataTariffPersonalizado: cache.getItem('dataTariffPersonalizado'),
        loadingDataTicket: false,
        priority: []
    }),
    actions: {
        async getTariffGeneral() {
            try {
                const data = await getTariffGeneral();
                //cache.setItem('dataTariffGeneral', data);
                this.dataTariffGeneral = data;
                return this.dataTariffGeneral;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        },
        async getTariffPersonalizado() {
            try {
                const data = await getTariffPersonalizado();
                cache.setItem('dataTariffPersonalizado', data);
                this.dataTariffPersonalizado = data;
                return this.dataTariffPersonalizado;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataTicket = false;
            }
        }
    }
});
