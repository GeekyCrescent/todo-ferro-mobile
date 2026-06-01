import { api } from "./api";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Category = {
  uuid: string;
  name: string;
  color?: string | null;
  createdAt?: string;
};

export type Todo = {
  uuid: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: string;
  ownerId?: string;
  listId?: string | null;
  priority?: Priority;
  dueDate?: string | null;
  categories?: Category[];
};

export type TaskList = {
  uuid: string;
  name: string;
  description?: string | null;
  color?: string | null;
  ownerId?: string;
  createdAt?: string;
  todoCount?: number;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  firebaseUuid: string;
  role?: string;
};

export type CreateUserDto = {
  email: string;
  password: string;
  fullName: string;
};

export type CreateTodoDto = {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  listId?: string | null;
  categoryIds?: string[];
};

export type UpdateTodoDto = {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string | null;
  listId?: string | null;
  categoryIds?: string[];
};

export type CreateCategoryDto = {
  name: string;
  color: string;
};

export type ListDto = {
  name: string;
  description?: string;
  color?: string;
};

export const createUser = async (dto: CreateUserDto): Promise<User> => {
  const { data } = await api.post<User>("/user", dto);
  return data;
};

export const createTodo = async (dto: CreateTodoDto): Promise<Todo> => {
  const { data } = await api.post<Todo>("/todo", dto);
  return data;
};

export const updateTodo = async (
  id: string,
  dto: UpdateTodoDto
): Promise<Todo> => {
  const { data } = await api.put<Todo>(`/todo/${id}`, dto);
  return data;
};

export const getMyTodos = async (): Promise<Todo[]> => {
  const { data } = await api.get<Todo[]>("/todo/my-todos");
  return data;
};

export const getTodosByUser = async (userId: string): Promise<Todo[]> => {
  const { data } = await api.get<Todo[]>(`/todo/user/${userId}`);
  return data;
};

export const pingTodoTest = async (): Promise<string> => {
  const { data } = await api.get<string>("/todo/test");
  return data;
};

// Pass an explicit body to bodyless requests (PATCH/DELETE): without it,
// axios + React Native throws "header name must be a non-empty string".
export const toggleTodo = async (id: string): Promise<Todo> => {
  const { data } = await api.patch<Todo>(`/todo/${id}/toggle`, {});
  return data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todo/${id}`, { data: {} });
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/category");
  return data;
};

export const createCategory = async (
  dto: CreateCategoryDto
): Promise<Category> => {
  const { data } = await api.post<Category>("/category", dto);
  return data;
};

// --- Listas ---

export const getLists = async (): Promise<TaskList[]> => {
  const { data } = await api.get<TaskList[]>("/list");
  return data;
};

export const createList = async (dto: ListDto): Promise<TaskList> => {
  const { data } = await api.post<TaskList>("/list", dto);
  return data;
};

export const updateList = async (
  id: string,
  dto: ListDto
): Promise<TaskList> => {
  const { data } = await api.put<TaskList>(`/list/${id}`, dto);
  return data;
};

export const deleteList = async (id: string): Promise<void> => {
  await api.delete(`/list/${id}`, { data: {} });
};

export const getListTodos = async (listId: string): Promise<Todo[]> => {
  const { data } = await api.get<Todo[]>(`/list/${listId}/todos`);
  return data;
};
