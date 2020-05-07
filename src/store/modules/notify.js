import {
  getList
} from "@/myapi/message.js";

import store from '../index';

store
const user = {
  state: {
    messageList: [],
    readList: [],
    unreadList: []
  },
  mutations: {
    SET_LIST: (state, list) => {
      state.messageList = list;
      state.readList = list.filter(m => m.status === 2);
      state.unreadList = list.filter(m => m.status === 1);
    }
  },

  actions: {
    async GetMessage({
      commit
    }) {
      let result = await getList();
      if (result.status == 200) {
        commit('SET_LIST', result.data);
      }
    }
  }
};

export default user;
