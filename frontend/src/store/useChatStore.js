import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useChatStore = create((set,get) => ({
  message: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });

    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const {selectedUser,message} = get();

    try{
      const res = await axiosInstance.post(`/messages/${selectedUser._id}`,messageData);
      set({messages: [...message,res.messageData]});
    }
    catch(error){
      toast.error(error.response.messageData.message);
    }
  },
  // this can be optimized...
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
