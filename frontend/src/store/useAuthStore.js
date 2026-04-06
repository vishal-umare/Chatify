import { create } from "zustand";

export const useAuthStore = create((set) => ({

    isLoggedIn: false ,
    authUser: {name:"john", id:1}
    
}))