import EventService from "@/services/EventService.js";

export const namespaced = true;

export const state = {
  events: [],
  totalEvents: 0,
  event: {},
};
export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event);
  },
  SET_EVENT(state, event) {
    state.event = event;
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_TOTAL_EVENTS(state, totalEvents) {
    state.totalEvents = totalEvents;
  },
};
export const actions = {
  fetchEvent({ commit, getters, dispatch }, id) {
    const event = getters.getEventById(id);
    if (event) return commit("SET_EVENT", event);

    EventService.getEvent(id)
      .then((response) => {
        commit("SET_EVENT", response.data);
      })
      .catch((error) => {
        const notification = {
          type: "error",
          message: `There was a problem fetching event: ${error.message}`,
        };
        dispatch("notification/add", notification, { root: true });
      });
  },
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then(() => {
        commit("ADD_EVENT", event);
        const notification = {
          type: "success",
          message: "Your event has been created!",
        };
        dispatch("notification/add", notification, { root: true });
      })
      .catch((error) => {
        const notification = {
          type: "error",
          message: "There was a problem creating your event: " + error.message,
        };
        dispatch("notification/add", notification, { root: true });
        throw error;
      });
  },
  fetchEvents({ commit, dispatch }, { perPage, page }) {
    EventService.getEvents(perPage, page)
      .then((response) => {
        commit("SET_TOTAL_EVENTS", response.headers["x-total-count"]);
        commit("SET_EVENTS", response.data);
      })
      .catch((error) => {
        const notification = {
          type: "error",
          message: "There was a problem fetching events: " + error.message,
        };
        dispatch("notification/add", notification, { root: true });
      });
  },
};
export const getters = {
  getEventById: (state) => (id) => {
    return state.events.find((event) => event.id === id);
  },
};
