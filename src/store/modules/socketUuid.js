const socket = {
  state: {
    uuid: ''
  },
  mutations: {
    SET_SOCKET_UUID: (state, uuid) => {
      state.uuid = uuid;
    }
  }
};

export default socket;
