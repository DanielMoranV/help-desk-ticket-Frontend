import { defineStore } from 'pinia';
import cache from '../utils/cache';
import { createUser, getUser, updateUser, deleteUser, getAcess, getPosition, createAccessUser } from '../api';

export const useDataauthStore = defineStore('dataauthStore', {
    state: () => ({
        dataUser: cache.getItem('users'),
        loadingDataUser: false,
        position: cache.getItem('position')
    }),
    actions: {
        async getUsers() {
            this.loadingDataUser = true;
            try {
                const { data } = await getAcess();
                cache.setItem('users', data);
                this.dataUser = data;
                return data;
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDataUser = false;
            }
        },

        // async addUsers(payload) {
        //     try {
        //         const { data } = await createUser(payload);

        //         this.dataUser = data;
        //     } catch (error) {
        //         console.log(error);
        //     } finally {
        //         console.log('Finalizado');
        //     }
        // },
        async createUser(payload) {
            try {
                const { user, ...access } = payload;
                console.log(user, access);
                const { data } = await createUser(user);
                // if (data) {
                //     await createAccessUser(user.dni, access);
                // }
                this.dataUser = data;
                return data;
            } catch (error) {
                console.log(error);
            } finally {
                console.log('Finalizado');
            }
        },
        async profileUser(dni) {
            try {
                const { data } = await getUser(dni);
                this.dataUser = data;
            } catch (error) {
                console.log(error.message);
            } finally {
                console.log('Finalizada la carga de datos del perfil');
            }
        },
        async updateUser(dni, payload) {
            try {
                console.log(payload);
                const { user, ...access } = payload;
                const dataUser = {
                    ...user,
                    access: {
                        update: {
                            where: {
                                username: access.username
                            },
                            data: {
                                ...access
                            }
                        }
                    }
                };
                console.log(dataUser);
                const { data } = await updateUser(dni, dataUser);
                this.dataUser = this.dataUser.map((item) => (item.dni === dni ? { ...item, ...data } : item));
            } catch (error) {
                console.log(error.message);
            }
        },
        async deleteUser(dni) {
            try {
                await deleteUser(dni);
                this.dataUser = this.dataUser.filter((item) => item.dni !== dni);
            } catch (error) {
                console.log(error.message);
            } finally {
                console.log('Finalizado');
            }
        },
        async getPosition() {
            try {
                const { data } = await getPosition();
                cache.setItem('users', data);
                this.position = data;
                return data;
            } catch (error) {
                console.log(error.message);
            }
        }
    }
});
