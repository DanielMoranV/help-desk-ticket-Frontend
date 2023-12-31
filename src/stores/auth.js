import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { sigin, currentUser, updateAccessUser, updateUser, logout } from '../api';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: cache.getItem('user'),
        msg: {},
        position: 'Invitado',
        area: 'Colaborador',
        returnUrl: '',
        sessionUser: false,
        loadingUser: false
    }),
    getters: {
        hasRole: (state) => (roles) => {
            return state.user?.position && roles.includes(state.user.position);
        },
        getEsential(state) {
            return {
                name: state.user?.user?.name,
                position: state.user.position.name,
                area: state.user.position.areaId || ''
            };
        },
        token(state) {
            return state.user?.token || '';
        }
    },
    actions: {
        async login(payload) {
            try {
                const { data } = await sigin(payload);
                cache.setItem('user', data);
                this.user = data;
                this.sessionUser = true;
                this.position = this.user.position.name;
                this.area = this.user.position.areaId !== 11 && this.user.position.areaId !== 4 && this.user.position.areaId !== 2 && this.user.position.areaId !== 6 ? 'Colaborador' : this.user.position.areaId;
            } catch (error) {
                this.msg = error.message;
                this.user = null;
                this.sessionUser = false;
            }
        },
        async logout(username) {
            this.user = null;
            this.sessionUser = false;
            this.position = 'Invitado';
            await logout({ username });
            cache.cleanAll();
        },
        async currentUser() {
            try {
                const { data } = await currentUser();
                const { email, phone } = data.user;
                this.user.user.email = email;
                this.user.user.phone = phone;
                this.sessionUser = true;
                this.position = this.user.position.name;
                this.area = this.user.position.areaId !== 1 && this.user.position.areaId !== 11 && this.user.position.areaId !== 4 && this.user.position.areaId !== 2 && this.user.position.areaId !== 6 ? 'Colaborador' : this.user.position.areaId;
            } catch (error) {
                this.user = null;
                this.sessionUser = false;
                this.position = 'Invitado';
            }
        },
        async updateAccessUser(payload) {
            try {
                const username = this.user.username;
                const { data } = await updateAccessUser(username, payload);
                return data.count;
            } catch (error) {
                console.log(error);
            }
        },
        async updateDataUser(payload) {
            try {
                const username = this.user.username;
                const { data } = await updateUser(username, payload);
                return data;
            } catch (error) {
                console.log(error);
            }
        }
    }
});
