export const userSelector = (state) => state.auth.user;
export const todosSelector = (state) => state.todos.todos;
export const errorSelector = (state) => state.auth.error;

export const todosShowingFrom = (state) => state.todos.showingFrom;
export const todosShowingTo = (state) => state.todos.showingTo;
export const todosResultsCountSelector = (state) => state.todos.resultsCount;
export const todosPageSelector = (state) => state.todos.page;
export const todosLimitSelector = (state) => state.todos.limit;
